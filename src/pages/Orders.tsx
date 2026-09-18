import { useMemo, useState } from 'react';
import type { Order, OrderStatus } from '../types';
import { EmptyState, Pagination, SearchInput, formatMoney } from '../components/UI';

export function Orders({ orders, onExport }: { orders: Order[]; onExport: () => void }) {
  const [q,setQ]=useState(''); const [status,setStatus]=useState<'All'|OrderStatus>('All'); const [sort,setSort]=useState<keyof Order>('date'); const [asc,setAsc]=useState(false); const [page,setPage]=useState(1);
  const filtered=useMemo(()=>orders.filter(o=>(status==='All'||o.status===status)&&`${o.id} ${o.customer} ${o.product}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>{const av=a[sort],bv=b[sort]; if(typeof av==='number'&&typeof bv==='number') return asc?av-bv:bv-av; return asc?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av));}),[orders,q,status,sort,asc]);
  const pages=Math.ceil(filtered.length/10); const shown=filtered.slice((page-1)*10,page*10);
  const statuses:['All',...OrderStatus[]]=['All','Completed','Processing','Shipped','Pending','Cancelled'];
  const headers:[keyof Order,string][]=[['id','Order ID'],['product','Product'],['customer','Customer'],['amount','Amount'],['date','Date'],['status','Status']];
  const changeSort=(key:keyof Order)=>{if(sort===key)setAsc(v=>!v);else{setSort(key);setAsc(false)};setPage(1)};
  return <div className="page"><div className="page-intro"><div><span className="eyebrow">Operations</span><h2>Order management</h2><p>Search, filter, sort and export the generated order stream.</p></div><button className="btn primary" onClick={onExport}>Export CSV</button></div>
    <section className="card table-card"><div className="toolbar"><SearchInput value={q} onChange={v=>{setQ(v);setPage(1)}} placeholder="Search order ID, customer or product..."/><select value={status} onChange={e=>{setStatus(e.target.value as 'All'|OrderStatus);setPage(1)}} aria-label="Filter order status">{statuses.map(s=><option key={s}>{s}</option>)}</select></div>
      <div className="table-scroll"><table><thead><tr>{headers.map(([key,label])=><th key={key} onClick={()=>changeSort(key)}>{label} <span className="sort-mark">{sort===key?(asc?'↑':'↓'):''}</span></th>)}</tr></thead><tbody>{shown.map(o=><tr key={o.id}><td><strong>{o.id}</strong></td><td>{o.product}</td><td>{o.customer}</td><td><strong>{formatMoney(o.amount)}</strong></td><td>{o.date}</td><td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td></tr>)}</tbody></table></div>
      {!shown.length&&<EmptyState title="No orders found" message="Try changing your search or status filter."/>}<div className="table-foot"><span>Showing {shown.length} of {filtered.length}</span><Pagination page={page} pages={pages} setPage={setPage}/></div>
    </section>
  </div>;
}
