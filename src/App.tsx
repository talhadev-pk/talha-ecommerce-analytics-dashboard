import { useEffect, useMemo, useState } from 'react';
import { Layout, type Page } from './components/Layout';
import { generateMockData } from './data/mockData';
import { Dashboard } from './pages/Dashboard';
import { Revenue } from './pages/Revenue';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Orders } from './pages/Orders';
import type { DashboardData } from './types';

function exportCsv(data: DashboardData) {
  const rows = [['Order ID','Product','Customer','Amount','Date','Status'], ...data.orders.map(o => [o.id,o.product,o.customer,o.amount.toFixed(2),o.date,o.status])];
  const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='talha-ecommerce-orders.csv'; a.click(); URL.revokeObjectURL(url);
}

export default function App() {
  const [page,setPage]=useState<Page>('dashboard');
  const [dark,setDark]=useState(() => localStorage.getItem('talha-dashboard-theme') !== 'light');
  const [data,setData]=useState<DashboardData>(() => generateMockData());
  const [loading,setLoading]=useState(true);
  const [liveTick,setLiveTick]=useState(0);

  useEffect(()=>{const id=window.setTimeout(()=>setLoading(false),450);return()=>window.clearTimeout(id)},[]);
  useEffect(()=>{const id=window.setInterval(()=>{setLiveTick(v=>v+1); setData(d=>({...d, orders:d.orders.map((o,i)=>i===liveTick%d.orders.length?{...o,amount:Math.max(10,o.amount*(0.995+Math.random()*0.01))}:o)}));},7000);return()=>window.clearInterval(id)},[liveTick]);

  const pageContent=useMemo(()=>{
    if(loading) return <div className="loading-page"><div className="loading-logo">T</div><div className="skeleton-line wide"></div><div className="skeleton-line"></div></div>;
    switch(page){
      case 'revenue': return <Revenue records={data.revenue}/>;
      case 'products': return <Products products={data.products}/>;
      case 'customers': return <Customers customers={data.customers}/>;
      case 'orders': return <Orders orders={data.orders} onExport={()=>exportCsv(data)}/>;
      default: return <Dashboard data={data}/>;
    }
  },[page,data,loading]);

  return <Layout page={page} setPage={setPage} dark={dark} setDark={setDark} exportCsv={page==='orders'?()=>exportCsv(data):undefined}>{pageContent}</Layout>;
}
