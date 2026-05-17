const GlassyCard = ({ title, children, className = '' }) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      <div className="mt-4 text-slate-300">{children}</div>
    </div>
  );
};

export default GlassyCard;
