import { create } from 'zustand'
import type { Task, ClusterNode, MetricsSnapshot, TaskStatus, Team } from '../types'

const TEAM_COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16']

function mockTeams(): Team[] {
  return [
    { id: 'team-data', name: '数据平台团队', color: TEAM_COLORS[0], createdAt: Date.now() - 86400000 * 30 },
    { id: 'team-pay', name: '支付团队', color: TEAM_COLORS[1], createdAt: Date.now() - 86400000 * 20 },
    { id: 'team-ai', name: 'AI 算法团队', color: TEAM_COLORS[2], createdAt: Date.now() - 86400000 * 10 },
  ]
}

function mockNodes(teamId: string): ClusterNode[] {
  return Array.from({ length: 3 }, (_, i) => ({
    id: `${teamId}-node-${i + 1}`,
    teamId,
    name: i === 0 ? `${teamId}-scheduler` : `${teamId}-worker-${i}`,
    type: i === 0 ? 'scheduler' as const : 'worker' as const,
    status: Math.random() > 0.1 ? 'online' as const : 'overloaded' as const,
    cpu: 20 + Math.random() * 60,
    memory: 30 + Math.random() * 50,
    tasks: Math.floor(Math.random() * 8),
    uptime: 3600 + Math.floor(Math.random() * 86400),
  }))
}

function mockTasks(teamId: string, nodes: ClusterNode[]): Task[] {
  const names = ['data_sync', 'email_batch', 'report_gen', 'cache_warm', 'log_rotate', 'db_backup', 'index_rebuild', 'health_check']
  return Array.from({ length: 8 }, (_, i) => {
    const status: TaskStatus[] = ['pending', 'running', 'success', 'failed']
    const s = status[Math.floor(Math.random() * 4)]
    const node = nodes[Math.floor(Math.random() * nodes.length)]
    return {
      id: `${teamId}-task-${1000 + i}`,
      teamId,
      name: names[i % names.length],
      status: s,
      node: node.name,
      createdAt: Date.now() - Math.floor(Math.random() * 600000),
      startedAt: s !== 'pending' ? Date.now() - Math.floor(Math.random() * 300000) : undefined,
      completedAt: (s === 'success' || s === 'failed') ? Date.now() - Math.floor(Math.random() * 60000) : undefined,
      retries: s === 'failed' ? Math.floor(Math.random() * 3) : 0,
      maxRetries: 3,
      duration: s === 'success' ? 1000 + Math.floor(Math.random() * 30000) : undefined,
      logs: [`[INFO] Task ${names[i % names.length]} started`, `[INFO] Processing on ${node.name}`],
    }
  })
}

function mockMetrics(teamId: string): MetricsSnapshot[] {
  return Array.from({ length: 20 }, (_, i) => ({
    teamId,
    time: Date.now() - (20 - i) * 5000,
    totalTasks: 50 + i * 2 + Math.floor(Math.random() * 10),
    runningTasks: 2 + Math.floor(Math.random() * 5),
    successRate: 80 + Math.random() * 19,
    avgLatency: 300 + Math.random() * 2000,
    nodeCount: 3,
  }))
}

const initialTeams = mockTeams()
const initialNodesMap: Record<string, ClusterNode[]> = {}
const initialTasksMap: Record<string, Task[]> = {}
const initialMetricsMap: Record<string, MetricsSnapshot[]> = {}

for (const team of initialTeams) {
  const nodes = mockNodes(team.id)
  initialNodesMap[team.id] = nodes
  initialTasksMap[team.id] = mockTasks(team.id, nodes)
  initialMetricsMap[team.id] = mockMetrics(team.id)
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

export const useTaskStore = create<TaskStore>((set, get) => ({
  teams: initialTeams,
  currentTeamId: initialTeams[0].id,
  tasksMap: initialTasksMap,
  nodesMap: initialNodesMap,
  metricsMap: initialMetricsMap,
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
    const nodes = mockNodes(teamId)
    const tasks = mockTasks(teamId, nodes)
    const metrics = mockMetrics(teamId)
    set({
      teams: [...state.teams, newTeam],
      currentTeamId: teamId,
      nodesMap: { ...state.nodesMap, [teamId]: nodes },
      tasksMap: { ...state.tasksMap, [teamId]: tasks },
      metricsMap: { ...state.metricsMap, [teamId]: metrics },
    })
  },
  switchTeam: (teamId) => set({ currentTeamId: teamId, selectedTask: null }),
  addTask: (name) => {
    const state = get()
    const teamId = state.currentTeamId
    const nodes = state.nodesMap[teamId]
    const task: Task = {
      id: `${teamId}-task-${Date.now()}`,
      teamId,
      name,
      status: 'pending',
      node: nodes[Math.floor(Math.random() * nodes.length)].name,
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
          t.id === id ? { ...t, status: 'pending', retries: t.retries + 1, logs: [...t.logs, '[INFO] Retrying...'] } : t
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
      nodesMap: { ...state.nodesMap, [teamId]: mockNodes(teamId) },
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
      successRate: (teamTasks.filter(t => t.status === 'success').length / Math.max(teamTasks.length, 1)) * 100,
      avgLatency: 500 + Math.random() * 2000,
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
}))
