import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Unable to sign in. Check credentials.');
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10 ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#020617] text-white'}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),transparent_50%)]" />
      </div>
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1700px] gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-col justify-between overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_120px_-40px_rgba(59,130,246,0.65)] backdrop-blur-3xl sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_35%)]" />
          <div className="absolute left-8 top-16 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
              Enterprise performance platform
            </div>
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">GoalSync</p>
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Align goals, approvals, and performance in one intelligent workspace.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Launch a premium enterprise HQ built for modern teams. Powerful analytics, performance coaching, and seamless growth tracking — all in a beautiful dashboard experience.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Automated goal scoring', 'Real-time approval workflows', 'Executive analytics', 'Secure enterprise access'].map((item) => (
                <div key={item} className="rounded-[28px] border border-white/10 bg-slate-900/70 px-5 py-4">
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Enterprise adoption</p>
                <p className="mt-3 text-2xl font-semibold text-white">98% team alignment</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Performance analytics</p>
                <p className="mt-3 text-2xl font-semibold text-white">Quarterly performance pulse</p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute right-12 bottom-12 hidden h-48 w-48 rounded-full border border-cyan-400/10 bg-cyan-400/5 blur-3xl lg:block" />
        </motion.section>
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-center">
          <div className="glass-card w-full max-w-xl border-white/15 bg-slate-950/85 p-8 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.5)] backdrop-blur-3xl sm:p-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300">
                Sign in
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white">Welcome back to GoalSync</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Sign in to manage your team goals, review approvals, and access premium analytics.
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Work Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="name@goalsync.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 px-5 py-4 pr-14 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-rose-300">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Continue'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
              <div className="flex flex-col gap-3 text-center text-sm text-slate-400 sm:flex-row sm:justify-between">
                <Link to="/register" className="font-semibold text-white hover:text-cyan-300">
                  Create account
                </Link>
                <Link to="/forgot-password" className="font-semibold text-white hover:text-cyan-300">
                  Forgot password?
                </Link>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  <span>Secure enterprise-grade authentication and compliance-ready goal tracking.</span>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
