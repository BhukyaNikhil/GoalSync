import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

const strengthLabels = [
  { label: 'Weak', color: 'bg-rose-500' },
  { label: 'Fair', color: 'bg-amber-400' },
  { label: 'Strong', color: 'bg-emerald-500' },
];

const getPasswordStrength = (value) => {
  if (value.length > 9 && /[A-Z]/.test(value) && /\d/.test(value)) return 2;
  if (value.length >= 7) return 1;
  return 0;
};

const Register = () => {
  const { register, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const strengthIndex = passwordTouched ? getPasswordStrength(form.password) : -1;
  const strength = strengthIndex >= 0 ? strengthLabels[strengthIndex] : null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10 ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#020617] text-white'}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-0 top-28 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1700px] gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-col justify-between overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_120px_-40px_rgba(59,130,246,0.65)] backdrop-blur-3xl sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_35%)]" />
          <div className="absolute left-8 top-16 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
              Talent & growth hub
            </div>
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">GoalSync</p>
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Create your enterprise account and secure your team's success.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Start with a premium implementation built for executive teams, high-growth leaders, and strategic goal management.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Secure onboarding', 'Compliance-ready workflows', 'Modern collaboration', 'Performance guidance'].map((item) => (
                <div key={item} className="rounded-[28px] border border-white/10 bg-slate-900/70 px-5 py-4">
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute right-12 bottom-12 hidden h-48 w-48 rounded-full border border-cyan-400/10 bg-cyan-400/5 blur-3xl lg:block" />
        </motion.section>
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-center">
          <div className="glass-card w-full max-w-xl border-white/15 bg-slate-950/85 p-8 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.5)] backdrop-blur-3xl sm:p-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-300">
                Join the enterprise platform
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-white">Create your GoalSync account</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Register and start aligning your goals, tracking approvals, and unlocking enterprise reports.
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Your name"
                />
              </div>
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
                    minLength={8}
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      setPasswordTouched(true);
                    }}
                    className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 px-5 py-4 pr-14 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Choose a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                  <span>Password strength</span>
                  <span className={`font-semibold ${strength ? 'text-white' : 'text-slate-500'}`}>
                    {strength ? strength.label : 'Enter a password'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className={`${strength?.color || 'bg-slate-500/30'} h-2 rounded-full transition-all duration-300`} style={{ width: `${strengthIndex >= 0 ? ((strengthIndex + 1) / 3) * 100 : 10}%` }} />
                </div>
                {passwordTouched && (
                  <div className="grid gap-2 text-xs text-slate-400">
                    <p>• At least 8 characters</p>
                    <p>• Include uppercase and numbers for strong security</p>
                    <p>• Avoid common passwords or repeated text</p>
                  </div>
                )}
              </div>
              {error && <p className="text-sm text-rose-300">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[28px] bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
              <p className="text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-white hover:text-cyan-300">
                  Sign in
                </Link>
              </p>
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

export default Register;
