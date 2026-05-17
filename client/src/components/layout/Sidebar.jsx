import { motion } from 'framer-motion';
import { CalendarDays, ClipboardList, LineChart, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';

const navItems = [
  { label: 'Overview', path: '/', icon: LineChart },
  { label: 'Goals', path: '/goals', icon: ClipboardList },
  { label: 'Check-ins', path: '/checkins', icon: CalendarDays },
  { label: 'Team', path: '/manager', icon: Users, role: 'manager' },
  { label: 'Admin', path: '/admin', icon: ShieldCheck, role: 'admin' },
  { label: 'Insights', path: '/insights', icon: Sparkles },
];

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-80 flex-col gap-6 overflow-y-auto p-6 border-r border-white/10 bg-slate-950/80 backdrop-blur-3xl">
      <div className="space-y-3">
        <div className="text-sm uppercase tracking-[0.3em] text-slate-400">GoalSync</div>
        <h1 className="text-3xl font-semibold text-white">GoalSync</h1>
        <p className="text-sm text-slate-400 max-w-[18rem]">Premium enterprise goal performance platform for strategic teams.</p>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          if (item.role && item.role !== user?.role) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-4 text-sm font-medium transition ${
                  isActive ? 'bg-gradient-to-r from-cyan-500/20 via-slate-900/40 to-blue-500/20 text-white shadow-glass' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <p className="text-sm text-slate-300">Your enterprise workspace is ready to support strategic planning.</p>
        <div className="mt-4 rounded-3xl border border-white/10 p-4 bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Enterprise Pulse</p>
          <p className="mt-2 text-sm font-semibold text-white">78% goal alignment</p>
        </div>
      </motion.div>
    </aside>
  );
};

export default Sidebar;
