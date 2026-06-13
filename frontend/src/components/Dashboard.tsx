import { useState } from 'react'
<<<<<<< ours
import { Layout, Tabs, Statistic, Row, Col, Card, Tag, Button, Input, Table, Drawer, Descriptions, Space, Progress, Modal, Form } from 'antd'
=======
<<<<<<< HEAD
import { Layout, Tabs, Statistic, Row, Col, Card, Tag, Button, Input, Table, Drawer, Descriptions, Space, Progress, Select, Modal, Form } from 'antd'
=======
import { Layout, Tabs, Statistic, Row, Col, Card, Tag, Button, Input, Table, Drawer, Descriptions, Space, Progress, Modal, Form } from 'antd'
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useTaskStore } from '../store/tasks'
import type { Task, TaskStatus, Team } from '../types'

const { Header, Content, Sider } = Layout

const STATUS_COLORS: Record<TaskStatus, string> = {
<<<<<<< ours
  pending: 'default',
  running: 'processing',
  success: 'success',
  failed: 'error',
  retry: 'warning',
}

export default function Dashboard() {
  const store = useTaskStore()
=======
  pending: 'default', running: 'processing', success: 'success', failed: 'error', retry: 'warning'
}

export default function Dashboard() {
  const teams = useTaskStore(s => s.teams)
  const currentTeamId = useTaskStore(s => s.currentTeamId)
  const currentTeam = useTaskStore(s => s.currentTeam())
  const tasks = useTaskStore(s => s.currentTasks())
  const nodes = useTaskStore(s => s.currentNodes())
  const metrics = useTaskStore(s => s.currentMetrics())
  const selectedTask = useTaskStore(s => s.selectedTask)
  const tasksMap = useTaskStore(s => s.tasksMap)
  const nodesMap = useTaskStore(s => s.nodesMap)
  const switchTeam = useTaskStore(s => s.switchTeam)
  const addTeam = useTaskStore(s => s.addTeam)
  const addTask = useTaskStore(s => s.addTask)
  const retryTask = useTaskStore(s => s.retryTask)
  const cancelTask = useTaskStore(s => s.cancelTask)
  const selectTask = useTaskStore(s => s.selectTask)

>>>>>>> theirs
  const [newTaskName, setNewTaskName] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [form] = Form.useForm()
<<<<<<< ours

  const currentTeam = store.teams.find(t => t.id === store.currentTeamId)
=======
<<<<<<< HEAD

  const currentTeam = store.teams.find(t => t.id === store.currentTeamId)
=======
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs

  const taskColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 180 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: TaskStatus) => <Tag color={STATUS_COLORS[s]}>{s}</Tag> },
    { title: '节点', dataIndex: 'node', key: 'node' },
<<<<<<< ours
    { title: '重试', key: 'retries', render: (_: unknown, r: Task) => `${r.retries}/${r.maxRetries}` },
    { title: '耗时', key: 'duration', render: (_: unknown, r: Task) => (r.duration ? `${(r.duration / 1000).toFixed(1)}s` : '-') },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, r: Task) => (
        <Space>
          {r.status === 'failed' && <Button size="small" type="primary" onClick={() => store.retryTask(r.id)}>重试</Button>}
          {r.status === 'running' && <Button size="small" danger onClick={() => store.cancelTask(r.id)}>取消</Button>}
          <Button size="small" onClick={() => { store.selectTask(r); setDrawerOpen(true) }}>详情</Button>
        </Space>
      ),
    },
  ]

  const successCount = store.tasks.filter(t => t.status === 'success').length
  const failedCount = store.tasks.filter(t => t.status === 'failed').length
  const runningCount = store.tasks.filter(t => t.status === 'running').length
=======
    { title: '重试', key: 'retries', render: (_: any, r: Task) => `${r.retries}/${r.maxRetries}` },
    { title: '耗时', key: 'duration', render: (_: any, r: Task) => r.duration ? `${(r.duration / 1000).toFixed(1)}s` : '-' },
    { title: '操作', key: 'actions', render: (_: any, r: Task) => (
      <Space>
        {r.status === 'failed' && <Button size="small" type="primary" onClick={() => retryTask(r.id)}>重试</Button>}
        {r.status === 'running' && <Button size="small" danger onClick={() => cancelTask(r.id)}>取消</Button>}
        <Button size="small" onClick={() => { selectTask(r); setDrawerOpen(true) }}>详情</Button>
      </Space>
    )},
  ]

  const successCount = tasks.filter(t => t.status === 'success').length
  const failedCount = tasks.filter(t => t.status === 'failed').length
  const runningCount = tasks.filter(t => t.status === 'running').length

  const handleCreateTeam = async () => {
    try {
      const values = await form.validateFields()
      addTeam(values.name)
      form.resetFields()
      setTeamModalOpen(false)
    } catch (_) {}
  }
>>>>>>> theirs

  const handleCreateTeam = async () => {
    try {
      const values = await form.validateFields()
      store.addTeam(values.name)
      form.resetFields()
      setTeamModalOpen(false)
    } catch (_) {}
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
<<<<<<< ours
      <Sider width={240} style={{ background: '#001529', padding: '16px 0', overflow: 'auto' }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: 16, marginBottom: 12 }}>🏢 团队工作台</h2>
          <Button type="primary" block onClick={() => setTeamModalOpen(true)}>
            + 新建团队
=======
<<<<<<< HEAD
      <Sider width={240} style={{ background: '#001529', padding: '16px 0' }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #1f1f1f' }}>
=======
      <Sider width={240} style={{ background: '#001529', padding: '16px 0', overflow: 'auto' }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
          <h2 style={{ color: 'white', margin: 0, fontSize: 16, marginBottom: 12 }}>🏢 团队工作台</h2>
          <Button
            type="primary"
            block
<<<<<<< HEAD
            icon={<span style={{ marginRight: 4 }}>+</span>}
            onClick={() => setTeamModalOpen(true)}
          >
            新建团队
>>>>>>> theirs
          </Button>
        </div>
        <div style={{ padding: 8 }}>
          {store.teams.map((team: Team) => (
            <div
              key={team.id}
              onClick={() => store.switchTeam(team.id)}
<<<<<<< ours
=======
=======
            onClick={() => setTeamModalOpen(true)}
          >
            + 新建团队
          </Button>
        </div>
        <div style={{ padding: 8 }}>
          {teams.map((team: Team) => (
            <div
              key={team.id}
              onClick={() => switchTeam(team.id)}
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
              style={{
                padding: '12px 12px',
                marginBottom: 4,
                borderRadius: 6,
                cursor: 'pointer',
<<<<<<< ours
                background: team.id === store.currentTeamId ? 'rgba(24,144,255,0.2)' : 'transparent',
=======
<<<<<<< HEAD
                background: team.id === store.currentTeamId ? '#1890ff30' : 'transparent',
=======
                background: team.id === currentTeamId ? 'rgba(24,144,255,0.2)' : 'transparent',
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
                borderLeft: `4px solid ${team.color}`,
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
<<<<<<< ours
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                if (team.id !== store.currentTeamId) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                if (team.id !== store.currentTeamId) e.currentTarget.style.background = 'transparent'
              }}
=======
<<<<<<< HEAD
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => { if (team.id !== store.currentTeamId) e.currentTarget.style.background = '#ffffff10' }}
              onMouseLeave={(e) => { if (team.id !== store.currentTeamId) e.currentTarget.style.background = 'transparent' }}
>>>>>>> theirs
            >
              <div>
                <div style={{ color: 'white', fontWeight: team.id === store.currentTeamId ? 600 : 400, fontSize: 14 }}>
                  {team.name}
                </div>
                <div style={{ color: '#8c8c8c', fontSize: 11, marginTop: 2 }}>
                  {store.tasksMap[team.id]?.length || 0} 个任务 · {store.nodesMap[team.id]?.length || 0} 个节点
<<<<<<< ours
=======
=======
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => { if (team.id !== currentTeamId) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={(e) => { if (team.id !== currentTeamId) e.currentTarget.style.background = 'transparent' }}
            >
              <div>
                <div style={{ color: 'white', fontWeight: team.id === currentTeamId ? 600 : 400, fontSize: 14 }}>
                  {team.name}
                </div>
                <div style={{ color: '#8c8c8c', fontSize: 11, marginTop: 2 }}>
                  {tasksMap[team.id]?.length || 0} 个任务 · {nodesMap[team.id]?.length || 0} 个节点
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
                </div>
              </div>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: team.color,
<<<<<<< ours
                  flexShrink: 0,
=======
<<<<<<< HEAD
                  flexShrink: 0
=======
                  flexShrink: 0,
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
                }}
              />
            </div>
          ))}
        </div>
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px' }}>
          <Space>
            <h1 style={{ color: 'white', margin: 0, fontSize: 18 }}>🔧 分布式任务调度与监控平台</h1>
            {currentTeam && (
              <Tag color={currentTeam.color} style={{ fontSize: 13, padding: '2px 10px' }}>
                当前团队: {currentTeam.name}
              </Tag>
            )}
          </Space>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Input placeholder="任务名称" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} style={{ width: 160 }} />
<<<<<<< ours
            <Button
              type="primary"
              onClick={() => {
                if (newTaskName) {
                  store.addTask(newTaskName)
                  setNewTaskName('')
                }
              }}
            >
=======
<<<<<<< HEAD
            <Button type="primary" onClick={() => { if (newTaskName) { store.addTask(newTaskName); setNewTaskName('') } }}>
=======
            <Button type="primary" onClick={() => { if (newTaskName) { addTask(newTaskName); setNewTaskName('') } }}>
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
              添加任务
            </Button>
          </div>
        </Header>
        <Content style={{ padding: 16 }}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
<<<<<<< ours
            <Col span={6}><Card><Statistic title="总任务" value={store.tasks.length} /></Card></Col>
=======
<<<<<<< HEAD
            <Col span={6}><Card><Statistic title="总任务" value={store.tasks.length} /></Card></Col>
=======
            <Col span={6}><Card><Statistic title="总任务" value={tasks.length} /></Card></Col>
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
            <Col span={6}><Card><Statistic title="运行中" value={runningCount} valueStyle={{ color: '#1890ff' }} /></Card></Col>
            <Col span={6}><Card><Statistic title="成功" value={successCount} valueStyle={{ color: '#52c41a' }} /></Card></Col>
            <Col span={6}><Card><Statistic title="失败" value={failedCount} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
          </Row>

<<<<<<< ours
          <Tabs
            items={[
              {
                key: 'metrics',
                label: '监控指标',
                children: (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="运行中任务数">
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={store.metrics}>
                            <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleTimeString()} fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip labelFormatter={t => new Date(t as number).toLocaleString()} />
                            <Area type="monotone" dataKey="runningTasks" stroke={currentTeam?.color || '#1890ff'} fill={currentTeam?.color || '#1890ff'} fillOpacity={0.3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="成功率 %">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={store.metrics}>
                            <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleTimeString()} fontSize={10} />
                            <YAxis domain={[0, 100]} fontSize={10} />
                            <Tooltip labelFormatter={t => new Date(t as number).toLocaleString()} />
                            <Line type="monotone" dataKey="successRate" stroke="#52c41a" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                    <Col span={24} style={{ marginTop: 16 }}>
                      <Card title="平均延迟 (ms)">
                        <ResponsiveContainer width="100%" height={150}>
                          <AreaChart data={store.metrics}>
                            <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleTimeString()} fontSize={10} />
                            <YAxis fontSize={10} />
                            <Tooltip />
                            <Area type="monotone" dataKey="avgLatency" stroke="#faad14" fill="#faad14" fillOpacity={0.2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'tasks',
                label: '任务列表',
                children: <Table dataSource={store.tasks} columns={taskColumns} rowKey="id" size="small" pagination={{ pageSize: 10 }} />,
              },
              {
                key: 'nodes',
                label: '集群节点',
                children: (
                  <Row gutter={16}>
                    {store.nodes.map(node => (
                      <Col span={8} key={node.id} style={{ marginBottom: 16 }}>
                        <Card
                          title={<span>{node.type === 'scheduler' ? '🎯' : '⚙️'} {node.name}</span>}
                          extra={<Tag color={node.status === 'online' ? 'green' : node.status === 'overloaded' ? 'orange' : 'red'}>{node.status}</Tag>}
                        >
                          <Progress percent={Math.round(node.cpu)} strokeColor={node.cpu > 80 ? '#ff4d4f' : '#1890ff'} format={v => `CPU ${v}%`} />
                          <Progress percent={Math.round(node.memory)} strokeColor={node.memory > 80 ? '#ff4d4f' : '#52c41a'} format={v => `MEM ${v}%`} />
                          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                            任务数: {node.tasks} | 运行时间: {Math.floor(node.uptime / 3600)}h
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ),
              },
            ]}
          />

          <Drawer title="任务详情" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={480}>
            {(() => {
              const task = store.selectedTask
=======
          <Tabs items={[
            { key: 'metrics', label: '监控指标', children: (
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="运行中任务数">
                    <ResponsiveContainer width="100%" height={200}>
<<<<<<< HEAD
                      <AreaChart data={store.metrics}>
=======
                      <AreaChart data={metrics}>
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
                        <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleTimeString()} fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip labelFormatter={t => new Date(t as number).toLocaleString()} />
                        <Area type="monotone" dataKey="runningTasks" stroke={currentTeam?.color || '#1890ff'} fill={currentTeam?.color || '#1890ff'} fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="成功率 %">
                    <ResponsiveContainer width="100%" height={200}>
<<<<<<< HEAD
                      <LineChart data={store.metrics}>
=======
                      <LineChart data={metrics}>
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
                        <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleTimeString()} fontSize={10} />
                        <YAxis domain={[0, 100]} fontSize={10} />
                        <Tooltip labelFormatter={t => new Date(t as number).toLocaleString()} />
                        <Line type="monotone" dataKey="successRate" stroke="#52c41a" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={24} style={{ marginTop: 16 }}>
                  <Card title="平均延迟 (ms)">
                    <ResponsiveContainer width="100%" height={150}>
<<<<<<< HEAD
                      <AreaChart data={store.metrics}>
=======
                      <AreaChart data={metrics}>
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
                        <XAxis dataKey="time" tickFormatter={t => new Date(t).toLocaleTimeString()} fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="avgLatency" stroke="#faad14" fill="#faad14" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            )},
            { key: 'tasks', label: '任务列表', children: (
<<<<<<< HEAD
              <Table dataSource={store.tasks} columns={taskColumns} rowKey="id" size="small" pagination={{ pageSize: 10 }} />
            )},
            { key: 'nodes', label: '集群节点', children: (
              <Row gutter={16}>
                {store.nodes.map(node => (
=======
              <Table dataSource={tasks} columns={taskColumns} rowKey="id" size="small" pagination={{ pageSize: 10 }} />
            )},
            { key: 'nodes', label: '集群节点', children: (
              <Row gutter={16}>
                {nodes.map(node => (
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
                  <Col span={8} key={node.id} style={{ marginBottom: 16 }}>
                    <Card title={<span>{node.type === 'scheduler' ? '🎯' : '⚙️'} {node.name}</span>}
                      extra={<Tag color={node.status === 'online' ? 'green' : node.status === 'overloaded' ? 'orange' : 'red'}>{node.status}</Tag>}>
                      <Progress percent={Math.round(node.cpu)} strokeColor={node.cpu > 80 ? '#ff4d4f' : '#1890ff'} format={v => `CPU ${v}%`} />
                      <Progress percent={Math.round(node.memory)} strokeColor={node.memory > 80 ? '#ff4d4f' : '#52c41a'} format={v => `MEM ${v}%`} />
                      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                        任务数: {node.tasks} | 运行时间: {Math.floor(node.uptime / 3600)}h
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )},
          ]} />

          <Drawer title="任务详情" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={480}>
            {(() => {
<<<<<<< HEAD
              const task = store.selectedTask
=======
              const task = selectedTask
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
              if (!task) return null
              return (
                <>
                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="ID">{task.id}</Descriptions.Item>
                    <Descriptions.Item label="名称">{task.name}</Descriptions.Item>
                    <Descriptions.Item label="状态"><Tag color={STATUS_COLORS[task.status]}>{task.status}</Tag></Descriptions.Item>
<<<<<<< ours
                    <Descriptions.Item label="所属团队">{store.teams.find(t => t.id === task.teamId)?.name || '-'}</Descriptions.Item>
=======
<<<<<<< HEAD
                    <Descriptions.Item label="所属团队">{store.teams.find(t => t.id === task.teamId)?.name || '-'}</Descriptions.Item>
=======
                    <Descriptions.Item label="所属团队">{teams.find(t => t.id === task.teamId)?.name || '-'}</Descriptions.Item>
>>>>>>> 64da416 (.1835502840582874:1dbec6b0f61fe9be2d6565747082665b_6a2c0916e7e8601dfb2c4233.6a2c3ccce7e8601dfb2c48ea.6a2c3ccc3cc603406e30d7cb:Trae CN.T(2026/6/13 01:07:24))
>>>>>>> theirs
                    <Descriptions.Item label="执行节点">{task.node}</Descriptions.Item>
                    <Descriptions.Item label="重试次数">{task.retries}/{task.maxRetries}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{new Date(task.createdAt).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="耗时">{task.duration ? `${(task.duration / 1000).toFixed(1)}s` : '-'}</Descriptions.Item>
                  </Descriptions>
                  <h4 style={{ marginTop: 16 }}>执行日志</h4>
                  <pre style={{ background: '#1f1f1f', padding: 12, borderRadius: 8, fontSize: 12, maxHeight: 300, overflow: 'auto' }}>
                    {task.logs.join('\n')}
                  </pre>
                </>
              )
            })()}
          </Drawer>

          <Modal
            title="新建团队"
            open={teamModalOpen}
            onOk={handleCreateTeam}
<<<<<<< ours
            onCancel={() => {
              setTeamModalOpen(false)
              form.resetFields()
            }}
=======
            onCancel={() => { setTeamModalOpen(false); form.resetFields() }}
>>>>>>> theirs
            okText="创建"
            cancelText="取消"
          >
            <Form form={form} layout="vertical">
<<<<<<< ours
              <Form.Item label="团队名称" name="name" rules={[{ required: true, message: '请输入团队名称' }]}>
=======
              <Form.Item
                label="团队名称"
                name="name"
                rules={[{ required: true, message: '请输入团队名称' }]}
              >
>>>>>>> theirs
                <Input placeholder="请输入团队名称，如：风控团队" maxLength={20} />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  )
}
