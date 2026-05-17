import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';
import StatCard from '../../components/ui/StatCard';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-4">
        <StatCard label="Active goals" value={analytics?.totalGoals || 0} accent="bg-sky-500/20" caption="All time" />
        <StatCard label="Completion" value={`${analytics?.completionRate || 0}%`} accent="bg-emerald-500/20" caption="Trend" />
        <StatCard label="Approval rate" value={`${analytics?.approvalRate || 0}%`} accent="bg-violet-500/20" caption="Policy" />
        <StatCard label="Team segments" value={analytics?.teamBreakdown?.length || 0} accent="bg-amber-500/20" caption="Units" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <GlassyCard title="Organization completion pulse">
          <div className="text-slate-300">View rollout performance across business units, approvals and long-term trajectory.</div>
        </GlassyCard>
        <GlassyCard title="Executive summary">
          <div className="space-y-3 text-slate-300">
            <p>Audit logs are available in the server for full compliance and traceability.</p>
            <p>Reset quarterly goals to refresh adoption and maintain enterprise cadence.</p>
          </div>
        </GlassyCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
