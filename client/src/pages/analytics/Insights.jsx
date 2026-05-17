import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, CartesianGrid } from 'recharts';
import api from '../../api/axiosConfig';
import GlassyCard from '../../components/ui/GlassyCard';

const palette = ['#34d399', '#60a5fa', '#fbbf24', '#f472b6'];

const CustomChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-card">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="mt-2 flex items-center justify-between gap-3 text-sm text-white">
          <span>{entry.name}</span>
          <span className="font-semibold">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-card">
      {payload.map((entry) => (
        <div key={entry.name} className="mt-2 flex items-center justify-between gap-3 text-sm text-white">
          <span>{entry.name}</span>
          <span className="font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const Insights = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    };
    loadData();
  }, []);

  const chartData = analytics?.timeline?.map((item) => ({
    quarter: item._id,
    progress: item.averageProgress,
  })) || [];

  const pieData = [
    { name: 'Complete', value: analytics?.completedGoals || 0 },
    { name: 'Remaining', value: Math.max((analytics?.totalGoals || 0) - (analytics?.completedGoals || 0), 0) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-3">
        <GlassyCard title="Organizational pulse">
          <div className="space-y-3 text-slate-300">
            <p>Completion rate across your enterprise portfolio.</p>
            <p className="text-white text-3xl font-semibold">{analytics?.completionRate || 0}%</p>
          </div>
        </GlassyCard>
        <GlassyCard title="Approval momentum">
          <div className="space-y-3 text-slate-300">
            <p>Goals currently aligned with leadership.</p>
            <p className="text-white text-3xl font-semibold">{analytics?.approvalRate || 0}%</p>
          </div>
        </GlassyCard>
        <GlassyCard title="Team segments">
          <div className="space-y-3 text-slate-300">
            <p>Active groups supporting shared objectives.</p>
            <p className="text-white text-3xl font-semibold">{analytics?.teamBreakdown?.length || 0}</p>
          </div>
        </GlassyCard>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassyCard title="Quarterly trendline">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#334155" opacity={0.5} />
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} stroke="#94a3b8" />
                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="progress" stroke="transparent" fill="url(#progressGradient)" />
                <Line type="monotone" dataKey="progress" stroke="#34d399" strokeWidth={3} dot={{ r: 5, fill: '#fff', stroke: '#34d399', strokeWidth: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassyCard>
        <GlassyCard title="Completion composition">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="transparent"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={index === 0 ? 'url(#donutGradient)' : palette[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Complete goals</span>
              <span className="font-semibold text-white">{analytics?.completedGoals || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Remaining goals</span>
              <span className="font-semibold text-white">{pieData[1].value}</span>
            </div>
          </div>
        </GlassyCard>
      </div>
    </div>
  );
};

export default Insights;
