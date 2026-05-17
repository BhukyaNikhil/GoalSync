const Toast = ({ message, type }) => {
  const palette = {
    success: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
    error: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
    warning: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    info: 'bg-sky-500/15 text-sky-200 border-sky-500/30',
  };
  return <div className={`rounded-3xl border p-4 text-sm ${palette[type] || palette.info}`}>{message}</div>;
};

export default Toast;
