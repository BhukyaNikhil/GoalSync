import { useEffect, useState } from 'react';
import { Send, RefreshCcw } from 'lucide-react';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';
import Toast from '../../components/ui/Toast';

const Checkins = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ goalId: '', quarter: 'Q2', progress: 0, status: 'Not Started', comment: '' });
  const [message, setMessage] = useState(null);

  const fetchGoals = async () => {
    const response = await api.get('/goals');
    setGoals(response.data);
    if (response.data[0]) setForm((prev) => ({ ...prev, goalId: prev.goalId || response.data[0]._id }));
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/checkins', form);
      setMessage({ type: 'success', message: 'Check-in submitted successfully' });
      fetchGoals();
    } catch (error) {
      setMessage({ type: 'error', message: 'Unable to submit progress' });
    }
  };

  return (
    <div className="space-y-8">
      <GlassyCard title="Quarterly check-ins" className="space-y-5">
        <p className="text-sm text-slate-400">Update progress for your goals and keep your manager in sync with every milestone.</p>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <select value={form.goalId} onChange={(e) => setForm({ ...form, goalId: e.target.value })} className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-cyan-500/15">
              {goals.map((goal) => (
                <option value={goal._id} key={goal._id}>{goal.title}</option>
              ))}
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-cyan-500/15">
              <option>Not Started</option>
              <option>On Track</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-cyan-500/15" placeholder="Enter achievement progress" />
            <input type="text" value={form.quarter} disabled className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-300 outline-none" placeholder="Quarter" />
          </div>
          <textarea rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Summarize achievements and milestones" className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-cyan-500/15" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button type="submit" className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01]">
              <Send className="h-4 w-4" /> Submit update
            </button>
            <button type="button" onClick={fetchGoals} className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition duration-300 hover:border-brand hover:text-white hover:-translate-y-0.5">
              <RefreshCcw className="h-4 w-4" /> Refresh list
            </button>
          </div>
        </form>
        {message && <Toast message={message.message} type={message.type} />}
      </GlassyCard>
      <div className="grid gap-5">
        {goals.map((goal) => (
          <div key={goal._id} className="glass-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">{goal.thrustArea}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{goal.title}</h3>
              </div>
              <span className="rounded-full bg-sky-500/15 px-4 py-2 text-sm text-sky-200">{goal.status}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-300">
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p>Target</p>
                <p className="mt-2 text-white">{goal.target}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p>Weightage</p>
                <p className="mt-2 text-white">{goal.weightage}%</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p>Progress</p>
                <p className="mt-2 text-white">{goal.progress}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkins;
