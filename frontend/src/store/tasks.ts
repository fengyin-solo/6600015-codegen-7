import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, ClusterNode, MetricsSnapshot, TaskStatus, Team } from '../types'

const TEAM_COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16']

function generateNodes(teamId: string): ClusterNode[] {
  return Array.from({ length: 3 }, (_, i) => ({
    id: `${teamId}-node-${i + 1}`,
    teamId,
    name: i === 0 ? `${teamId}-scheduler` : `${teamId}-worker-${i}`,
    type: i === 0 ? 'scheduler' as const : 'worker' as const,
    status: Math.random() > 0.1 ? 'online' as const : 'overloaded' as const,
    cpu: +(20 + Math.random() * 60).toFixed(1),
    memory: +(30 + Math.random() * 50).toFixed(1),
    tasks: Math.floor(Math.random() * 8000),
    uptime: 3600 + Math.floor(Math.random() * 86400),
  }))
}

function generateTasks(teamId: string, nodes: ClusterNode[]): Task[] {
  const names = ['data_sync', 'email_batch', 'report_gen', 'cache_warm', 'log_rotate', 'db_backup', 'index_rebuild', 'health_check']
  return Array.from({ length: 8 }, (_, i) => {
    const status: TaskStatus[] = ['pending', 'running', 'success', 'failed']
    const s = status[Math.floor(Math.random() * 4)]
    const node = nodes[Math.floor(Math.random() * nodes.length)]
    return {
      id: `${teamId}-task-${100000000 + i}`,
      teamId,
      name: names[i % names.length],
      status: s,
      node: node.name,
      createdAt: Date.now() - Math.floor(Math.random() * 600000),
      startedAt: s !== 'pending' ? Date.now() - Math.floor(Math.random() * 300000) : undefined,
      completedAt: s === 'success' || s === 'failed' ? Date.now() - Math.floor(Math.random() * 60000) : undefined,
      retries: s === 'failed' ? Math.floor(Math.random() * 3) : 0,
      maxRetries: 3,
      duration: s === 'success' ? 1000 + Math.floor(Math.random() * 30000) : undefined,
      logs: [`[INFO] Task ${names[i % names.length]} started`, `[INFO] Processing on ${node.name}`],
    }
  })
}

function generateMetrics(teamId: string): MetricsSnapshot[] {
  return Array.from({ length: 20 }, (_, i) => ({
    teamId,
    time: Date.now() - (20 - i) * 5000,
    totalTasks: 50 + i * 2 + Math.floor(Math.random() * 10),
    runningTasks: 2 + Math.floor(Math.random() * 5),
    successRate: +(80 + Math.random() * 19).toFixed(1),
    avgLatency: +(300 + Math.random() * 2000).toFixed(0),
    nodeCount: 3,
  }))
}

function createDefaultTeams() {
  const teams: Team[] = [
    { id: 'team-data', name: '数据平台团队', color: TEAM_COLORS[0], createdAt: Date.now() - 86400000 * 30 },
    { id: 'team-pay', name: '支付团队', color: TEAM_COLORS[1], createdAt: Date.now() - 86400000 * 20 },
    { id: 'team-ai', name: 'AI 算法团队', color: TEAM_COLORS[2], createdAt: Date.now() - 86400000 * 10 },
  ]
  const tasksMap: Record<string, Task[]> = {}
  const nodesMap: Record<string, ClusterNode[]> = {}
  const metricsMap: Record<string, MetricsSnapshot[]> = {}

  for (const team of teams) {
    const nodes = generateNodes(team.id)
    nodesMap[team.id] = nodes
    tasksMap[team.id] = generateTasks(team.id, nodes)
    metricsMap[team.id] = generateMetrics(team.id)
  }

  return { teams, tasksMap, nodesMap, metricsMap, currentTeamId: teams[0].id }
}

interface TaskStore {
  teams: Team[]
  currentTeamId: string
  tasksMap: Record<string, Task[]>
  nodesMap: Record<string, ClusterNode[]>
  metricsMap: Record<string, MetricsSnapshot[]>
  selectedTask: Task | null
  tasks: Task[]
  nodes: ClusterNode[]
  metrics: MetricsSnapshot[]
  addTeam: (name: string) => void
  switchTeam: (teamId: string) => void
  addTask: (name: string) => void
  retryTask: (id: string) => void
  cancelTask: (id: string) => void
  selectTask: (t: Task | null) => void
  refreshNodes: () => void
  addMetric: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => {
      const defaults = createDefaultTeams()

      return {
        teams: defaults.teams,
        currentTeamId: defaults.currentTeamId,
        tasksMap: defaults.tasksMap,
        nodesMap: defaults.nodesMap,
        metricsMap: defaults.metricsMap,
        selectedTask: null,
        get tasks() {
          return get().tasksMap[get().currentTeamId] || []
        },
        get nodes() {
          return get().nodesMap[get().currentTeamId] || []
        },
        get metrics() {
          return get().metricsMap[get().currentTeamId] || []
        },
        addTeam: (name) => {
          const state = get()
          const teamId = `team-${Date.now()}`
          const color = TEAM_COLORS[state.teams.length % TEAM_COLORS.length]
          const newTeam: Team = { id: teamId, name, color, createdAt: Date.now() }
          const nodes = generateNodes(teamId)
          const tasks = generateTasks(teamId, nodes)
          const metrics = generateMetrics(teamId)
          set({
            teams: [...state.teams, newTeam],
            currentTeamId: teamId,
            nodesMap: { ...state.nodesMap, [teamId]: nodes },
            tasksMap: { ...state.tasksMap, [teamId]: tasks },
            metricsMap: { ...state.metricsMap, [teamId]: metrics },
            selectedTask: null,
          })
        },
        switchTeam: (teamId) => set({ currentTeamId: teamId, selectedTask: null }),
        addTask: (name) => {
          const state = get()
          const teamId = state.currentTeamId
          const nodes = state.nodesMap[teamId] || []
          const task: Task = {
            id: `${teamId}-task-${Date.now()}`,
            teamId,
            name,
            status: 'pending',
            node: nodes.length > 0 ? nodes[Math.floor(Math.random() * nodes.length)].name : 'default-node',
            createdAt: Date.now(),
            retries: 0,
            maxRetries: 3,
            logs: [`[INFO] Task ${name} queued`],
          }
          set({
            tasksMap: {
              ...state.tasksMap,
              [teamId]: [task, ...(state.tasksMap[teamId] || [])],
            },
          })
        },
        retryTask: (id) => {
          const state = get()
          const teamId = state.currentTeamId
          set({
            tasksMap: {
              ...state.tasksMap,
              [teamId]: (state.tasksMap[teamId] || []).map(t =>
                t.id === id ? { ...t, status: 'pending' as TaskStatus, retries: t.retries + 1, logs: [...t.logs, '[INFO] Retrying...'] } : t
              ),
            },
          })
        },
        cancelTask: (id) => {
          const state = get()
          const teamId = state.currentTeamId
          set({
            tasksMap: {
              ...state.tasksMap,
              [teamId]: (state.tasksMap[teamId] || []).map(t =>
                t.id === id ? { ...t, status: 'failed' as TaskStatus, logs: [...t.logs, '[WARN] Cancelled by user'] } : t
              ),
            },
          })
        },
        selectTask: (t) => set({ selectedTask: t }),
        refreshNodes: () => {
          const state = get()
          const teamId = state.currentTeamId
          set({
            nodesMap: { ...state.nodesMap, [teamId]: generateNodes(teamId) },
          })
        },
        addMetric: () => {
          const state = get()
          const teamId = state.currentTeamId
          const teamTasks = state.tasksMap[teamId] || []
          const teamNodes = state.nodesMap[teamId] || []
          const m: MetricsSnapshot = {
            teamId,
            time: Date.now(),
            totalTasks: teamTasks.length,
            runningTasks: teamTasks.filter(t => t.status === 'running').length,
            successRate: +((teamTasks.filter(t => t.status === 'success').length / Math.max(teamTasks.length, 1)) * 100).toFixed(1),
            avgLatency: +(500 + Math.random() * 2000).toFixed(0),
            nodeCount: teamNodes.filter(n => n.status !== 'offline').length,
          }
          const currentMetrics = state.metricsMap[teamId] || []
          set({
            metricsMap: {
              ...state.metricsMap,
              [teamId]: [...currentMetrics.slice(-30), m],
            },
          })
        },
      }
    },
    {
      name: 'multi-tenant-workspace',
      partialize: (state) => ({
        teams: state.teams,
        currentTeamId: state.currentTeamId,
        tasksMap: state.tasksMap,
        nodesMap: state.nodesMap,
        metricsMap: state.metricsMap,
      }),
    }
  )
)
