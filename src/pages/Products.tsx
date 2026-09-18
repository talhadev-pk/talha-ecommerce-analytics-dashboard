import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { Product } from '../types';
import { EmptyState, Pagination, SearchInput, formatMoney } from '../components/UI';

export function Products({ products }: { products: Product[] }) {
  const [q,setQ]=useState(''); const [cat,setCat]=useState('All'); const [sort,setSort]=useState<keyof Product>('revenue'); const [asc,setAsc]=useState(false); const [page,setPage]=useState(1);
  const categories=['All',...Array.from(new Set(products.map(p=>p.category)))];
  const filtered=useMemo(()=>products.filter(p=>(cat==='All'||p.category===cat)&&`${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>{const av=a[sort],bv=b[sort]; if(typeof av==='number'&&typeof bv==='number') return asc?av-bv:bv-av; return asc?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av));}),[products,q,cat,sort,asc]);
  const pages=Math.ceil(filtered.length/10); const shown=filtered.slice((page-1)*10,page*10);
  const changeSort=(key:keyof Product)=>{if(sort===key)setAsc(v=>!v);else{setSort(key);setAsc(false)};setPage(1)};
  const headers:[keyof Product,string][]=[['name','Product'],['category','Category'],['unitsSold','Units Sold'],['revenue','Revenue'],['profitMargin','Profit Margin'],['trend','Trend']];
  return <div className="page"><div className="page-intro"><div><span className="eyebrow">Catalog</span><h2>Product performance</h2><p>{products.length} simulated products ranked by the current sort.</p></div></div>
    <section className="card table-card"><div className="toolbar"><SearchInput value={q} onChange={v=>{setQ(v);setPage(1)}} placeholder="Search products..."/><select value={cat} onChange={e=>{setCat(e.target.value);setPage(1)}} aria-label="Filter category">{categories.map(c=><option key={c}>{c}</option>)}</select></div>
      <div className="table-scroll"><table><thead><tr>{headers.map(([key,label])=><th key={key} onClick={()=>changeSort(key)}>{label} <span className="sort-mark">{sort===key?(asc?'↑':'↓'):''}</span></th>)}</tr></thead><tbody>{shown.map(p=><tr key={p.id}><td><div className="product-cell"><span className="product-icon">{p.name.slice(0,1)}</span><div><strong>{p.name}</strong><small>{p.id}</small></div></div></td><td><span className="tag">{p.category}</span></td><td>{p.unitsSold.toLocaleString()}</td><td><strong>{formatMoney(p.revenue)}</strong></td><td>{p.profitMargin.toFixed(1)}%</td><td><span className={`trend ${p.trend>=0?'up':'down'}`}>{p.trend>=0?<ArrowUpRight size={15}/>:<ArrowDownRight size={15}/>} {Math.abs(p.trend).toFixed(1)}%</span></td></tr>)}</tbody></table></div>
      {!shown.length&&<EmptyState title="No products found"/>}<div className="table-foot"><span>Showing {shown.length} of {filtered.length}</span><Pagination page={page} pages={pages} setPage={setPage}/></div>
    </section>
  </div>;
}
