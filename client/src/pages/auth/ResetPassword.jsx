import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CheckCircle2, Mail } from 'lucide-react';
import api from '../../api/axiosConfig';
import ThemeContext from '../../contexts/ThemeContext';
import { useContext } from 'react';

const ResetPassword = () => {
  const { theme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => password.length >= 8 && password === confirmPassword && token, [password, confirmPassword, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!canSubmit) {
      setError('Please provide a matching password with at least 8 characters.');
      return;
    }
    setStatus('loading');
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      setMessage(response.data.message || 'Password reset completed successfully.');
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to reset password.');
      setStatus('error');
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10 ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#020617] text-white'}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_50px_150px_-50px_rgba(0,0,0,0.55)] backdrop-blur-3xl sm:p-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Secure reset</p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Reset your password</h1>
            <p className="max-w-xl text-slate-400">
              Use the secure link from your inbox to set a new password. This page handles token validation and sends a confirmation when complete.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-slate-900/70 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Reset token</p>
                <p className="mt-3 text-lg font-semibold text-white">{token ? 'Token found' : 'Token missing'}</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-900/70 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Guided security</p>
                <p className="mt-3 text-lg font-semibold text-white">One-click reset flow</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-8">
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">New credentials</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Finish resetting access</h2>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-3 text-cyan-300 shadow-lg shadow-cyan-500/10">
                <Lock className="h-5 w-5" />
              </div>
            </div>
            {status === 'success' ? (
              <div className="mt-8 rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span className="font-semibold">Password reset complete.</span>
                </div>
                <p className="mt-3 text-sm text-slate-200">You can now return to sign in with your updated password.</p>
                <Link to="/login" className="mt-6 inline-flex rounded-3xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                  Return to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">New password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Create a strong new password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Confirm password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-[28px] border border-white/10 bg-slate-950/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Repeat your password"
                  />
                </div>
                {error && <p className="text-sm text-rose-300">{error}</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-[28px] bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? 'Resetting password...' : 'Reset password'}
                </button>
              </form>
            )}
            <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                <span>Passwords are encrypted and stored securely to protect enterprise access.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
