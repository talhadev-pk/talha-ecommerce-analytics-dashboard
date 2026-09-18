import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from 'recharts';
import type { RevenueRecord } from '../types';
import { ChartCard, formatMoney } from '../components/UI';

export function Revenue({ records }: { records: RevenueRecord[] }) {
  const [range, setRange] = useState<'Daily'|'Weekly'|'Monthly'>('Daily');
  const [start, setStart] = useState(records[0]?.date || '');
  const [end, setEnd] = useState(records[records.length - 1]?.date || '');

  const filtered = useMemo(() => records.filter(r => r.date >= start && r.date <= end), [records,start,end]);
  const weekly = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => { const d = new Date(r.date); const monday = new Date(d); monday.setDate(d.getDate() - ((d.getDay()+6)%7)); const key = monday.toISOString().slice(0,10); map.set(key, (map.get(key)||0)+r.revenue); });
    return [...map.entries()].map(([date,revenue]) => ({date,revenue}));
  }, [filtered]);
  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => { const key = r.date.slice(0,7); map.set(key,(map.get(key)||0)+r.revenue); });
    return [...map.entries()].map(([date,revenue]) => ({date,revenue}));
  }, [filtered]);

  const chartData = range === 'Daily' ? filtered : range === 'Weekly' ? weekly : monthly;
  const total = filtered.reduce((s,r)=>s+r.revenue,0);

  return <div className="page">
    <div className="page-intro"><div><span className="eyebrow">Revenue</span><h2>Revenue analytics</h2><p>Explore simulated revenue across different time resolutions.</p></div></div>
    <div className="filter-card">
      <div><label>From<input type="date" value={start} min={records[0]?.date} max={end} onChange={e => setStart(e.target.value)}/></label><label>To<input type="date" value={end} min={start} max={records[records.length - 1]?.date} onChange={e => setEnd(e.target.value)}/></label><button className="btn secondary" onClick={() => {setStart(records[0]?.date || '');setEnd(records[records.length - 1]?.date || '')}}>Reset</button></div>
    </div>
    <div className="revenue-summary"><div><span>Selected revenue</span><strong>{formatMoney(total)}</strong></div><div><span>Records</span><strong>{filtered.length}</strong></div><div><span>Avg / record</span><strong>{formatMoney(total/Math.max(1,filtered.length))}</strong></div></div>
    <ChartCard title={`${range} revenue`} subtitle="Changing the view aggregates the same simulated source records." actions={<div className="segmented">{(['Daily','Weekly','Monthly'] as const).map(v=><button key={v} className={range===v?'selected':''} onClick={()=>setRange(v)}>{v}</button>)}</div>}>
      <div className="chart-wrap tall">{chartData.length ? <ResponsiveContainer width="100%" height="100%">{range === 'Daily' ? <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--grid)"/><XAxis dataKey="date" tick={{fill:'var(--muted)',fontSize:11}} tickFormatter={v=>v.slice(5)} tickLine={false} axisLine={false}/><YAxis tick={{fill:'var(--muted)',fontSize:11}} tickFormatter={v=>`$${Math.round(v/1000)}k`} tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12}} formatter={(v)=>[formatMoney(Number(v)),'Revenue']}/><Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={3} dot={false}/></LineChart> : <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--grid)"/><XAxis dataKey="date" tick={{fill:'var(--muted)',fontSize:11}} tickFormatter={v=>range==='Monthly'?v:v.slice(5)} tickLine={false} axisLine={false}/><YAxis tick={{fill:'var(--muted)',fontSize:11}} tickFormatter={v=>`$${Math.round(v/1000)}k`} tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12}} formatter={(v)=>[formatMoney(Number(v)),'Revenue']}/><Bar dataKey="revenue" fill="var(--accent)" radius={[5,5,0,0]}/></BarChart>}</ResponsiveContainer> : <div className="empty">No revenue records in this date range.</div>}</div>
    </ChartCard>
  </div>;
}
