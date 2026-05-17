import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';
import StatCard from '../../components/ui/StatCard';

const colors = ['#22c55e', '#38bdf8', '#f59e0b', '#fb7185'];

const EmployeeDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [analyticsRes, goalsRes] = await Promise.all([api.get('/analytics'), api.get('/goals')]);
      setAnalytics(analyticsRes.data);
      setGoals(goalsRes.data);
    };
    loadData();
  }, []);

  const progressCards = [
    { label: 'Goal completion', value: analytics?.completionRate + '%', accent: 'bg-emerald-500/20', caption: 'Live' },
    { label: 'Approved goals', value: analytics?.approvedGoals || 0, accent: 'bg-sky-500/20', caption: 'Approved' },
    { label: 'Total goals', value: analytics?.totalGoals || goals.length, accent: 'bg-violet-500/20', caption: 'Current' },
    { label: 'Completion', value: analytics?.approvalRate + '%', accent: 'bg-amber-500/20', caption: 'Aligned' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <GlassyCard className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Employee performance</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Your quarterly momentum</h2>
            <p className="mt-2 text-slate-400">Visualize current goal progress, approval state, and productivity intelligence.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {progressCards.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value || '—'} accent={item.accent} caption={item.caption} />
            ))}
          </div>
        </GlassyCard>
        <GlassyCard title="Quarterly trajectory" className="h-full">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.timeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" axisLine={false} tickLine={false} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="averageProgress" stroke="#38bdf8" fill="url(#progressGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassyCard>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassyCard title="Active goals overview">
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal._id} className="rounded-3xl border border-white/10 p-4 hover:border-brand/40 transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{goal.thrustArea}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{goal.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{goal.status}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400">{goal.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <span>Progress {goal.progress}%</span>
                  <span>Weight {goal.weightage}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassyCard>
        <GlassyCard title="Goal completion mix">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[
                  { name: 'Completed', value: analytics?.completedGoals || 0 },
                  { name: 'Pending', value: (analytics?.totalGoals || goals.length) - (analytics?.completedGoals || 0) },
                ]} innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {colors.map((color, index) => <Cell key={index} fill={color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155', borderRadius: '16px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassyCard>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
