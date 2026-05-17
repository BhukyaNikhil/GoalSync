import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center gap-6 rounded-[36px] border border-white/10 bg-slate-950/70 p-10 text-center shadow-glass">
      <p className="text-sm uppercase tracking-[0.4em] text-slate-500">404 ERROR</p>
      <h1 className="text-5xl font-semibold text-white">Page not found</h1>
      <p className="max-w-xl text-slate-400">The destination you are trying to reach is not available in this enterprise goal ecosystem.</p>
      <Link to="/" className="rounded-3xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-blue-500">
        Return to dashboard
      </Link>
    </div>
  );
};

export default NotFound;
