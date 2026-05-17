import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';
import Toast from '../../components/ui/Toast';

const initialForm = { thrustArea: '', title: '', description: '', uomType: 'Completion', target: '', weightage: 10, quarter: 'Q2' };

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchGoals = async () => {
    try {
      const result = await api.get('/goals');
      console.log('[Goals] Fetch response:', result.data.length, 'items');
      setGoals(result.data);
    } catch (error) {
      console.error('[Goals] Fetch error:', error.message, error.response?.data);
      setMessage({ type: 'error', message: error.response?.data?.message || 'Unable to load goals.' });
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalWeight = useMemo(() => goals.reduce((sum, item) => sum + (Number(item.weightage) || 0), 0), [goals]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (goals.length >= 8) {
      return setMessage({ type: 'warning', message: 'Max 8 goals allowed' });
    }

    const weightNumber = Number(form.weightage);
    if (Number.isNaN(weightNumber) || weightNumber < 10) {
      return setMessage({ type: 'error', message: 'Weightage must be at least 10%.' });
    }

    if (totalWeight + weightNumber > 100) {
      return setMessage({ type: 'error', message: 'Total weightage cannot exceed 100%.' });
    }

    const payload = {
      thrustArea: form.thrustArea.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      uomType: form.uomType.trim() || 'Completion',
      target: form.target.trim(),
      weightage: weightNumber,
      quarter: form.quarter,
    };

    console.log('[Goals] Create payload:', payload);
    setSubmitting(true);

    try {
      const response = await api.post('/goals', payload);
      console.log('[Goals] Create response:', response.data);
      setGoals((prev) => [response.data, ...prev]);
      setForm(initialForm);
      setMessage({ type: 'success', message: 'Goal added successfully.' });
    } catch (error) {
      console.error('[Goals] Create error:', error.message, error.response?.data);
      setMessage({ type: 'error', message: error.response?.data?.message || error.message || 'Unable to add goal.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((goal) => goal._id !== id));
      setMessage({ type: 'info', message: 'Goal removed successfully.' });
    } catch (error) {
      console.error('[Goals] Delete error:', error.message, error.response?.data);
      setMessage({ type: 'error', message: error.response?.data?.message || 'Unable to delete goal.' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <GlassyCard title="Goal management" className="space-y-5">
          <p className="text-sm text-slate-400">Create, refine and submit your goals. Maintain balanced weightage and keep your quarterly plan aligned with leadership.</p>
          <form onSubmit={handleAdd} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.thrustArea}
                onChange={(e) => setForm({ ...form, thrustArea: e.target.value })}
                required
                placeholder="Thrust area"
                className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-brand"
              />
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="Goal title"
                className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-brand"
              />
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Goal description"
              className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-brand"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                value={form.uomType}
                onChange={(e) => setForm({ ...form, uomType: e.target.value })}
                placeholder="UOM Type"
                className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-brand"
              />
              <input
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                required
                placeholder="Target"
                className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-brand"
              />
              <input
                value={form.weightage}
                onChange={(e) => setForm({ ...form, weightage: Number(e.target.value) })}
                type="number"
                min={10}
                max={100}
                required
                placeholder="Weightage"
                className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-brand"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm text-slate-400">Total assigned weightage: {totalWeight}%</span>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-3xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <PlusCircle className="h-4 w-4" /> {submitting ? 'Adding goal...' : 'Add goal'}
              </button>
            </div>
          </form>
        </GlassyCard>
        <GlassyCard title="Goal insights">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Your quarterly goal balance and submission readiness at a glance.</p>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Current goals</span>
                <span>{goals.length}/8</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600" style={{ width: `${Math.min(100, totalWeight)}%` }} />
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <span>Minimum per goal: 10%</span>
                <span>Ensure total weightage stays balanced before the next performance review.</span>
              </div>
            </div>
          </div>
        </GlassyCard>
      </div>
      {message && <Toast message={message.message} type={message.type} />}
      <div className="grid gap-5">
        {goals.map((goal) => (
          <div key={goal._id} className="glass-card animate-[fadeIn_0.25s_ease-out] p-6 hover:border-brand/40 transition border border-white/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{goal.thrustArea}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{goal.title}</h3>
                <p className="mt-3 text-slate-400">{goal.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="rounded-full bg-slate-900/80 px-3 py-2">{goal.status}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(goal._id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/15 px-4 py-2 text-rose-200 transition hover:bg-rose-500/25"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p>Progress</p>
                <p className="mt-2 text-lg font-semibold text-white">{goal.progress}%</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p>Weight</p>
                <p className="mt-2 text-lg font-semibold text-white">{goal.weightage}%</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p>Approved</p>
                <p className="mt-2 text-lg font-semibold text-white">{goal.approved ? 'Yes' : 'Pending'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;
