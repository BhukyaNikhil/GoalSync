import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';
import StatCard from '../../components/ui/StatCard';

const ManagerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [analyticsRes, goalsRes] = await Promise.all([api.get('/analytics'), api.get('/goals?status=On%20Track')]);
      setAnalytics(analyticsRes.data);
      setPending(goalsRes.data.filter((goal) => !goal.approved));
    };
    load();
  }, []);

  const barData = analytics?.teamBreakdown?.map((team) => ({ team: team._id, users: team.count })) || [];

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-3">
        <StatCard label="Team completion" value={`${analytics?.completionRate || 0}%`} accent="bg-emerald-500/20" caption="Pulse" />
        <StatCard label="Goal approvals" value={`${analytics?.approvedGoals || 0}`} accent="bg-sky-500/20" caption="Live" />
        <StatCard label="Pending reviews" value={`${pending.length}`} accent="bg-amber-500/20" caption="Review" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <GlassyCard title="Team performance roadmap">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="team" axisLine={false} tickLine={false} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155', borderRadius: '16px' }} />
                <Bar dataKey="users" radius={[12, 12, 0, 0]} fill="#38bdf8">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#38bdf8' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassyCard>
        <GlassyCard title="Pending approvals" className="space-y-4">
          <p className="text-sm text-slate-400">Review team submissions and keep the execution backlog aligned.</p>
          <div className="space-y-3">
            {pending.slice(0, 4).map((goal) => (
              <div key={goal._id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">{goal.user?.name || 'Employee'}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{goal.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full bg-white/5 px-3 py-1">{goal.quarter}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1">{goal.weightage}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassyCard>
      </div>
    </div>
  );
};

export default ManagerDashboard;
