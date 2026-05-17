import { useEffect, useState } from 'react';
import { RefreshCcw, Lock, Unlock } from 'lucide-react';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';
import Toast from '../../components/ui/Toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);

  const loadUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleReset = async () => {
    await api.post('/users/reset-goals');
    setMessage({ type: 'success', message: 'All goals reset for the next cycle.' });
  };

  return (
    <div className="space-y-8">
      <GlassyCard title="User management" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-400">Manage user roles, monitor teams, and refresh goal targets for the organization.</p>
          <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-3xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
            <RefreshCcw className="h-4 w-4" /> Reset goals
          </button>
        </div>
      </GlassyCard>
      {message && <Toast type={message.type} message={message.message} />}
      <div className="grid gap-5">
        {users.map((user) => (
          <GlassyCard key={user._id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">{user.department} • {user.team}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{user.name}</h3>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">Role: {user.role}</span>
              <button className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-brand hover:text-white">
                <Lock className="h-4 w-4" /> Manage
              </button>
            </div>
          </GlassyCard>
        ))}
      </div>
    </div>
  );
};

export default Users;
