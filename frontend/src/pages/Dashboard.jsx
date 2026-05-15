import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { CheckCircle2, CircleDashed, Clock, ListTodo } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('/dashboard');
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetrics();
  }, []);

  if (!metrics) return <Layout title="Dashboard Overview"><div style={{ padding: '2rem' }}>Loading metrics...</div></Layout>;

  // Data for Pie Chart
  const pieData = [
    { name: 'To Do', value: metrics.tasksByStatus.todo, color: '#94a3b8' },
    { name: 'In Progress', value: metrics.tasksByStatus.inProgress, color: '#3b82f6' },
    { name: 'Done', value: metrics.tasksByStatus.done, color: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <Layout title="Dashboard Overview">
      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="saas-card saas-card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Tasks</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metrics.totalTasks}</p>
          </div>
        </div>

        <div className="saas-card saas-card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Completed</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metrics.tasksByStatus.done}</p>
          </div>
        </div>

        <div className="saas-card saas-card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircleDashed size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>In Progress</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metrics.tasksByStatus.inProgress}</p>
          </div>
        </div>

        <div className="saas-card saas-card-hover" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Overdue</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metrics.overdueTasks}</p>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Task Status Donut Chart */}
        <div className="saas-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Task Distribution</h3>
          {pieData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '-1rem' }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: d.color }}></div>
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No tasks found.</div>
          )}
        </div>

        {/* Tasks Per User Bar Chart (Admin Only) */}
        {user?.role === 'Admin' && (
          <div className="saas-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Tasks per Member</h3>
            {metrics.tasksPerUser && metrics.tasksPerUser.length > 0 ? (
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.tasksPerUser} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                    <RechartsTooltip cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No assignments found.</div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Dashboard;
