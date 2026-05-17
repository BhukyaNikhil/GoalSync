import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';
import Toast from '../../components/ui/Toast';

const Approvals = () => {
  const [goals, setGoals] = useState([]);
  const [message, setMessage] = useState(null);

  const loadGoals = async () => {
    const response = await api.get('/goals');
    setGoals(response.data.filter((item) => !item.approved));
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleAction = async (id, action) => {
    await api.post(`/goals/${id}/approve`, { action, feedback: action === 'reject' ? 'Needs more detail and alignment.' : 'Approved for execution.' });
    setMessage({ type: 'success', message: `Goal ${action === 'approve' ? 'approved' : 'rejected'} successfully` });
    loadGoals();
  };

  return (
    <div className="space-y-8">
      <GlassyCard title="Goal approval workflow" className="space-y-4">
        <p className="text-sm text-slate-400">Approve or reject team goals with contextual intent and enterprise governance.</p>
        {message && <Toast message={message.message} type={message.type} />}
      </GlassyCard>
      <div className="grid gap-5">
        {goals.map((goal) => (
          <GlassyCard key={goal._id} className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-400">{goal.user?.name || 'Employee'} — {goal.thrustArea}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{goal.title}</h3>
                <p className="mt-3 text-slate-400">{goal.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleAction(goal._id, 'approve')} className="inline-flex items-center gap-2 rounded-3xl bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25">
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
                <button onClick={() => handleAction(goal._id, 'reject')} className="inline-flex items-center gap-2 rounded-3xl bg-rose-500/15 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/25">
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
              <div className="rounded-3xl bg-slate-900/80 p-4">Target: {goal.target}</div>
              <div className="rounded-3xl bg-slate-900/80 p-4">Weight: {goal.weightage}%</div>
              <div className="rounded-3xl bg-slate-900/80 p-4">Quarter: {goal.quarter}</div>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
              <MessageSquare className="mr-2 inline-block h-4 w-4 text-cyan-300" /> {goal.approvalFeedback || 'Awaiting manager review'}
            </div>
          </GlassyCard>
        ))}
      </div>
    </div>
  );
};

export default Approvals;
