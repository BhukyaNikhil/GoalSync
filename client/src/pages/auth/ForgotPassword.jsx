import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import ThemeContext from '../../contexts/ThemeContext';

const ForgotPassword = () => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('loading');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset instructions have been sent.');
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Unable to send reset instructions.');
      setStatus('error');
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10 ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#020617] text-white'}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_50px_150px_-50px_rgba(0,0,0,0.55)] backdrop-blur-3xl sm:p-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Password recovery</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Recover your GoalSync access</h1>
            <p className="max-w-xl text-slate-400">
              Enter your work email and we’ll send a secure recovery link with next steps to access your dashboard again.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/70 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Instant recovery</p>
                <p className="mt-3 text-lg font-semibold text-white">Email link</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-900/70 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Enterprise secure</p>
                <p className="mt-3 text-lg font-semibold text-white">Compliance friendly</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-8">
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Reset password</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Forgot password?</h2>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-3 text-cyan-300 shadow-lg shadow-cyan-500/10">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            {status === 'success' ? (
              <div className="mt-8 rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 shadow-[0_20px_40px_-20px_rgba(16,185,129,0.65)] animate-[pulse_2s_ease-in-out_infinite]">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">Check your inbox</p>
                      <p className="text-sm text-slate-200">A reset link has been sent to your email.</p>
                    </div>
                  </div>
                  <Link to="/login" className="inline-flex rounded-3xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                    Return to sign in
                  </Link>
                </div>
                <p className="mt-4 text-sm text-slate-200">If you do not see the email within a few minutes, please check your spam folder or request a new link.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="name@goalsync.com"
                  />
                </div>
                {error && <p className="text-sm text-rose-300">{error}</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-sky-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending instructions...' : 'Send reset link'}
                </button>
                <p className="text-center text-sm text-slate-400">
                  Remember your password?{' '}
                  <Link to="/login" className="font-semibold text-white hover:text-cyan-300">
                    Sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
