defmodule Scheduler.TaskManager do
  use GenServer

  defmodule Team do
    defstruct [:id, :name, :color, :created_at]
  end

  defmodule Task do
    defstruct [:id, :team_id, :name, :status, :node, :created_at, :retries, :max_retries, :logs]
  end

  @team_colors ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2", "#eb2f96", "#fa8c16"]
  @task_names ~w[data_sync email_batch report_gen cache_warm log_rotate db_backup index_rebuild health_check]

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def list_teams, do: GenServer.call(__MODULE__, :list_teams)
  def create_team(name), do: GenServer.call(__MODULE__, {:create_team, name})
  def list_tasks(team_id), do: GenServer.call(__MODULE__, {:list_tasks, team_id})
  def add_task(team_id, name), do: GenServer.call(__MODULE__, {:add_task, team_id, name})
  def retry_task(team_id, id), do: GenServer.call(__MODULE__, {:retry_task, team_id, id})
  def cancel_task(team_id, id), do: GenServer.call(__MODULE__, {:cancel_task, team_id, id})
  def get_stats(team_id), do: GenServer.call(__MODULE__, {:get_stats, team_id})
  def list_nodes(team_id), do: GenServer.call(__MODULE__, {:list_nodes, team_id})

  @impl true
  def init(_) do
    teams = [
      %Team{id: "team-data", name: "数据平台团队", color: Enum.at(@team_colors, 0), created_at: DateTime.utc_now()},
      %Team{id: "team-pay", name: "支付团队", color: Enum.at(@team_colors, 1), created_at: DateTime.utc_now()},
      %Team{id: "team-ai", name: "AI 算法团队", color: Enum.at(@team_colors, 2), created_at: DateTime.utc_now()}
    ]

    tasks_map =
      Enum.reduce(teams, %{}, fn team, acc ->
        Map.put(acc, team.id, seed_tasks(team.id))
      end)

    team_counter = length(teams)
    task_counter = 1100

    {:ok, %{teams: teams, tasks_map: tasks_map, team_counter: team_counter, task_counter: task_counter}}
  end

  defp seed_tasks(team_id) do
    for i <- 1..6 do
      name = Enum.at(@task_names, rem(i - 1, length(@task_names)))
      status = Enum.at(~w[pending running success failed]a, :rand.uniform(4) - 1)
      %Task{
        id: "#{team_id}-task-#{1000 + i}",
        team_id: team_id,
        name: name,
        status: status,
        node: "#{team_id}-worker-#{:rand.uniform(2)}",
        created_at: DateTime.utc_now(),
        retries: 0,
        max_retries: 3,
        logs: ["[INFO] Task #{name} created"]
      }
    end
  end

  @impl true
  def handle_call(:list_teams, _from, state) do
    {:reply, state.teams, state}
  end

  @impl true
  def handle_call({:create_team, name}, _from, state) do
    team_counter = state.team_counter + 1
    team_id = "team-#{System.unique_integer([:positive])}"
    color = Enum.at(@team_colors, rem(team_counter, length(@team_colors)))

    team = %Team{
      id: team_id,
      name: name,
      color: color,
      created_at: DateTime.utc_now()
    }

    {:reply, team, %{
      state
      | teams: state.teams ++ [team],
        tasks_map: Map.put(state.tasks_map, team_id, []),
        team_counter: team_counter
    }}
  end

  @impl true
  def handle_call({:list_tasks, team_id}, _from, state) do
    tasks = Map.get(state.tasks_map, team_id, [])
    {:reply, tasks, state}
  end

  @impl true
  def handle_call({:add_task, team_id, name}, _from, state) do
    task_counter = state.task_counter + 1
    team_tasks = Map.get(state.tasks_map, team_id, [])

    task = %Task{
      id: "#{team_id}-task-#{task_counter}",
      team_id: team_id,
      name: name,
      status: :pending,
      node: "#{team_id}-worker-#{:rand.uniform(2)}",
      created_at: DateTime.utc_now(),
      retries: 0,
      max_retries: 3,
      logs: ["[INFO] Task #{name} queued"]
    }

    new_tasks_map = Map.put(state.tasks_map, team_id, [task | team_tasks])
    {:reply, task, %{state | tasks_map: new_tasks_map, task_counter: task_counter}}
  end

  @impl true
  def handle_call({:retry_task, team_id, id}, _from, state) do
    team_tasks = Map.get(state.tasks_map, team_id, [])
    updated_tasks = Enum.map(team_tasks, fn
      %{id: ^id} = t -> %{t | status: :pending, retries: t.retries + 1, logs: t.logs ++ ["[INFO] Retrying..."]}
      t -> t
    end)
    {:reply, :ok, %{state | tasks_map: Map.put(state.tasks_map, team_id, updated_tasks)}}
  end

  @impl true
  def handle_call({:cancel_task, team_id, id}, _from, state) do
    team_tasks = Map.get(state.tasks_map, team_id, [])
    updated_tasks = Enum.map(team_tasks, fn
      %{id: ^id} = t -> %{t | status: :failed, logs: t.logs ++ ["[WARN] Cancelled"]}
      t -> t
    end)
    {:reply, :ok, %{state | tasks_map: Map.put(state.tasks_map, team_id, updated_tasks)}}
  end

  @impl true
  def handle_call({:get_stats, team_id}, _from, state) do
    team_tasks = Map.get(state.tasks_map, team_id, [])
    stats = %{
      total: length(team_tasks),
      running: Enum.count(team_tasks, & &1.status == :running),
      success: Enum.count(team_tasks, & &1.status == :success),
      failed: Enum.count(team_tasks, & &1.status == :failed)
    }
    {:reply, stats, state}
  end

  @impl true
  def handle_call({:list_nodes, team_id}, _from, state) do
    nodes = for i <- 1..3 do
      %{
        id: "#{team_id}-node-#{i}",
        team_id: team_id,
        name: if(i == 1, do: "#{team_id}-scheduler", else: "#{team_id}-worker-#{i - 1}"),
        type: if(i == 1, do: "scheduler", else: "worker"),
        status: if(:rand.uniform() > 0.1, do: "online", else: "overloaded"),
        cpu: 20 + :rand.uniform() * 60,
        memory: 30 + :rand.uniform() * 50,
        tasks: :rand.uniform(8),
        uptime: 3600 + :rand.uniform(86400)
      }
    end
    {:reply, nodes, state}
  end
end
