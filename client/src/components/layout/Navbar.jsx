import { LogOut, Moon, SunMedium, Bell } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout, toast } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-3xl transition-colors duration-300 ${theme === 'light' ? 'border-slate-200/40 bg-slate-100/70 text-slate-900' : 'border-white/10 bg-slate-950/80 text-white'}`}>
      <div className="mx-auto flex h-24 max-w-screen-2xl flex-col justify-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
            <h2 className="text-2xl font-semibold text-white">{user?.name || 'Guest'}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
              <span className="inline-flex items-center gap-2"><Bell className="h-4 w-4" /> Alerts</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="group rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition duration-300 hover:bg-white/15"
            >
              <span className="inline-flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
              </span>
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        {toast && (
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-slate-100 shadow-lg shadow-cyan-500/10">
            {toast.message}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
