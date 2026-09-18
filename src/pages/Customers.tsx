import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Customer } from '../types';
import { ChartCard, MetricCard, formatMoney } from '../components/UI';

export function Customers({ customers }: { customers: Customer[] }) {
  const source=useMemo(()=>{const m=new Map<string,number>();customers.forEach(c=>m.set(c.acquisitionSource,(m.get(c.acquisitionSource)||0)+1));return [...m.entries()].map(([name,value])=>({name,value}));},[customers]);
  const geo=useMemo(()=>{const m=new Map<string,number>();customers.forEach(c=>m.set(c.country,(m.get(c.country)||0)+1));return [...m.entries()].map(([country,value])=>({country,value})).sort((a,b)=>b.value-a.value).slice(0,8);},[customers]);
  const repeat=customers.filter(c=>c.isRepeatCustomer).length/customers.length*100;
  const clv=customers.reduce((s,c)=>s+c.totalSpent,0)/customers.length;
  return <div className="page"><div className="page-intro"><div><span className="eyebrow">Customers</span><h2>Customer analytics</h2><p>Acquisition, geography and value across the simulated audience.</p></div></div>
    <div className="metric-grid"><MetricCard label="Total Customers" value={customers.length} change={2.1}/><MetricCard label="New Customers" value={customers.filter(c=>c.orders===1).length} change={4.8}/><MetricCard label="Repeat Customer Rate" value={repeat.toFixed(1)} suffix="%" change={repeat>50?3.2:-2.1}/><MetricCard label="Customer Lifetime Value" value={formatMoney(clv)} change={1.7}/></div>
    <div className="dashboard-grid"><ChartCard title="Acquisition sources" subtitle="Generated customer acquisition mix"><div className="donut-wrap"><ResponsiveContainer width="55%" height={270}><PieChart><Pie data={source} dataKey="value" nameKey="name" innerRadius={72} outerRadius={105} paddingAngle={3}>{source.map((_,i)=><Cell key={i} fill={`hsl(${210+i*55} 75% ${55-i*4}%)`}/>)}</Pie><Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12}}/></PieChart></ResponsiveContainer><div className="legend">{source.map((s,i)=><div key={s.name}><span className="legend-dot" style={{background:`hsl(${210+i*55} 75% ${55-i*4}%)`}}></span><span>{s.name}</span><strong>{s.value} · {(s.value/customers.length*100).toFixed(0)}%</strong></div>)}</div></div></ChartCard>
      <ChartCard title="Customer geography" subtitle="Top generated customer locations"><div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={geo} layout="vertical" margin={{left:10,right:20}}><CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" horizontal={false}/><XAxis type="number" hide/><YAxis dataKey="country" type="category" width={90} tick={{fill:'var(--muted)',fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12}}/><Bar dataKey="value" fill="var(--accent)" radius={[0,5,5,0]}/></BarChart></ResponsiveContainer></div></ChartCard>
    </div><div className="note">Customer names, locations and acquisition figures are simulated portfolio data and are not claims about a real store.</div>
  </div>;
}
