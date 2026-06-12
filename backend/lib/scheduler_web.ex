defmodule SchedulerWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :scheduler

  plug Plug.Static, at: "/", from: :scheduler, gzip: false
  plug Plug.Parsers, parsers: [:json], pass: [], json_decoder: Jason
  plug CORSPlug
  plug SchedulerWeb.Router
end

defmodule CORSPlug do
  import Plug.Conn

  def init(options), do: options

  def call(conn, _opts) do
    conn
    |> put_resp_header("access-control-allow-origin", "*")
    |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "content-type, authorization")
    |> handle_options()
  end

  defp handle_options(%{method: "OPTIONS"} = conn) do
    send_resp(conn, 204, "")
    |> halt()
  end

  defp handle_options(conn), do: conn
end

defmodule SchedulerWeb.Router do
  use Phoenix.Router
  import Phoenix.Controller

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", SchedulerWeb do
    pipe_through :api

    get "/teams", TeamController, :index
    post "/teams", TeamController, :create

    get "/teams/:team_id/tasks", TaskController, :index
    post "/teams/:team_id/tasks", TaskController, :create
    post "/teams/:team_id/tasks/:id/retry", TaskController, :retry
    post "/teams/:team_id/tasks/:id/cancel", TaskController, :cancel

    get "/teams/:team_id/stats", TaskController, :stats
    get "/teams/:team_id/nodes", TaskController, :nodes
  end
end

defmodule SchedulerWeb.TeamController do
  use Phoenix.Controller, formats: [:json]

  def index(conn, _params) do
    teams = Scheduler.TaskManager.list_teams()
    json(conn, %{teams: Enum.map(teams, &Map.from_struct/1)})
  end

  def create(conn, %{"name" => name}) do
    team = Scheduler.TaskManager.create_team(name)
    json(conn, %{team: Map.from_struct(team)})
  end
end

defmodule SchedulerWeb.TaskController do
  use Phoenix.Controller, formats: [:json]

  def index(conn, %{"team_id" => team_id}) do
    tasks = Scheduler.TaskManager.list_tasks(team_id)
    json(conn, %{tasks: Enum.map(tasks, &Map.from_struct/1)})
  end

  def create(conn, %{"team_id" => team_id, "name" => name}) do
    task = Scheduler.TaskManager.add_task(team_id, name)
    json(conn, %{task: Map.from_struct(task)})
  end

  def retry(conn, %{"team_id" => team_id, "id" => id}) do
    Scheduler.TaskManager.retry_task(team_id, id)
    json(conn, %{status: "ok"})
  end

  def cancel(conn, %{"team_id" => team_id, "id" => id}) do
    Scheduler.TaskManager.cancel_task(team_id, id)
    json(conn, %{status: "ok"})
  end

  def stats(conn, %{"team_id" => team_id}) do
    json(conn, Scheduler.TaskManager.get_stats(team_id))
  end

  def nodes(conn, %{"team_id" => team_id}) do
    nodes = Scheduler.TaskManager.list_nodes(team_id)
    json(conn, %{nodes: nodes})
  end
end

defmodule SchedulerWeb.ErrorJSON do
  def render(template, _assigns) do
    %{errors: %{detail: Phoenix.Controller.status_message_from_template(template)}}
  end
end
