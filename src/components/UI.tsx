import { ArrowDownRight, ArrowUpRight, Search, ChevronLeft, ChevronRight, Loader2, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function MetricCard({ label, value, change, prefix = '', suffix = '' }: { label: string; value: string | number; change: number; prefix?: string; suffix?: string }) {
  const up = change >= 0;
  return <div className="metric-card">
    <div className="metric-head"><span>{label}</span><span className="metric-icon">•</span></div>
    <div className="metric-value">{prefix}{value}{suffix}</div>
    <div className={`metric-change ${up ? 'positive' : 'negative'}`}>{up ? <ArrowUpRight size={15}/> : <ArrowDownRight size={15}/>} {Math.abs(change).toFixed(1)}% <span>vs previous period</span></div>
  </div>;
}

export function ChartCard({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  return <section className="card chart-card"><div className="card-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{actions}</div>{children}</section>;
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div className="search-box"><Search size={17}/><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}/></div>;
}

export function LoadingState({ label = 'Loading analytics...' }: { label?: string }) {
  return <div className="loading"><Loader2 className="spin" size={22}/><span>{label}</span></div>;
}

export function EmptyState({ title = 'No results found', message = 'Try changing your search or filters.' }: { title?: string; message?: string }) {
  return <div className="empty"><Inbox size={28}/><strong>{title}</strong><span>{message}</span></div>;
}

export function Pagination({ page, pages, setPage }: { page: number; pages: number; setPage: (p: number) => void }) {
  if (pages <= 1) return null;
  const nums = Array.from({length: pages}, (_, i) => i + 1);
  return <div className="pagination">
    <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16}/></button>
    {nums.map(n => <button key={n} className={`page-btn ${n === page ? 'current' : ''}`} onClick={() => setPage(n)}>{n}</button>)}
    <button className="page-btn" disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={16}/></button>
  </div>;
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
