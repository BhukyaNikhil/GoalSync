const StatCard = ({ label, value, accent, caption }) => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
        </div>
        <div className={`rounded-2xl px-3 py-2 text-xs font-semibold text-white ${accent}`}>{caption}</div>
      </div>
    </div>
  );
};

export default StatCard;
