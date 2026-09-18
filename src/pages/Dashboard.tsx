import { useMemo } from 'react';
import { Activity, ArrowUpRight, Package, Sparkles, UsersRound } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardData } from '../types';
import { ChartCard, EmptyState, MetricCard, formatMoney } from '../components/UI';

export function Dashboard({ data }: { data: DashboardData }) {
  const metrics = useMemo(() => {
    const revenue = data.orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.amount, 0);
    const previous = revenue * (0.88 + Math.random() * 0.20);
    const aov = revenue / Math.max(1, data.orders.filter(o => o.status !== 'Cancelled').length);
    const repeat = data.customers.filter(c => c.isRepeatCustomer).length / Math.max(1, data.customers.length) * 100;
    return {
      revenue, revenueChange: (revenue - previous) / previous * 100,
      orders: data.orders.length, orderChange: -5 + Math.random() * 16,
      aov, aovChange: -4 + Math.random() * 15,
      conversion: 2.8 + Math.random() * 2.7, conversionChange: -3 + Math.random() * 10, repeat
    };
  }, [data]);

  const chart = data.revenue.slice(-30);
  const topProduct = [...data.products].sort((a,b) => b.revenue - a.revenue)[0];
  const topCountry = useMemo(() => {
    const counts = new Map<string, number>();
    data.customers.forEach(c => counts.set(c.country, (counts.get(c.country) || 0) + 1));
    return [...counts.entries()].sort((a,b) => b[1]-a[1])[0];
  }, [data]);

  if (!data.orders.length) return <EmptyState title="No dashboard data" message="The simulated dataset is empty."/>;

  return <div className="page">
    <div className="page-intro"><div><span className="eyebrow">Overview</span><h2>Good evening, Talha.</h2><p>Here’s the pulse of your simulated store today.</p></div><div className="live-pill"><span className="live-dot"></span> LIVE SIMULATION</div></div>
    <div className="metric-grid">
      <MetricCard label="Total Revenue" value={formatMoney(metrics.revenue)} change={metrics.revenueChange}/>
      <MetricCard label="Total Orders" value={metrics.orders} change={metrics.orderChange}/>
      <MetricCard label="Average Order Value" value={formatMoney(metrics.aov)} change={metrics.aovChange}/>
      <MetricCard label="Conversion Rate" value={metrics.conversion.toFixed(2)} suffix="%" change={metrics.conversionChange}/>
    </div>

    <div className="dashboard-grid">
      <ChartCard title="Revenue performance" subtitle="Last 30 simulated days">
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart}><defs><linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".28"/><stop offset="100%" stopColor="var(--accent)" stopOpacity=".01"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--grid)"/><XAxis dataKey="date" tick={{fill:'var(--muted)',fontSize:11}} tickFormatter={v => v.slice(5)} tickLine={false} axisLine={false}/><YAxis tick={{fill:'var(--muted)',fontSize:11}} tickFormatter={v => `$${Math.round(v/1000)}k`} tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12}} formatter={(v) => [formatMoney(Number(v)), 'Revenue']}/><Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2.5} fill="url(#revFill)" animationDuration={700}/></AreaChart></ResponsiveContainer></div>
      </ChartCard>
      <section className="card insights"><div className="card-head"><div><h2>Automated Insights</h2><p>Rule-based observations from mock data</p></div><Sparkles size={19}/></div>
        <div className="insight"><ArrowUpRight size={18}/><div><strong>Revenue signal</strong><p>{metrics.revenueChange >= 0 ? 'Revenue is trending upward' : 'Revenue is softer'} compared with the generated comparison period.</p></div></div>
        <div className="insight"><Package size={18}/><div><strong>Product leader</strong><p>{topProduct?.name || 'No product'} currently generates the most simulated product revenue.</p></div></div>
        <div className="insight"><UsersRound size={18}/><div><strong>Customer mix</strong><p>Repeat customers represent {metrics.repeat.toFixed(0)}% of the generated customer base.</p></div></div>
        <div className="mini-stat"><span>Largest customer region</span><strong>{topCountry?.[0] || '—'} · {topCountry?.[1] || 0}</strong></div>
      </section>
    </div>
    <div className="note"><Activity size={16}/> All figures are simulated portfolio data. Refreshing the page generates a new scenario; values are intentionally non-persistent.</div>
  </div>;
}
