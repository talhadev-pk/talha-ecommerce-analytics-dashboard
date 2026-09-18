import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BarChart3, Boxes, ChevronLeft, ChevronRight, CircleDollarSign, Menu, Moon, Sun, Users, X, Download, Clock3 } from 'lucide-react';

export type Page = 'dashboard' | 'revenue' | 'products' | 'customers' | 'orders';

const nav = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: BarChart3 },
  { id: 'revenue' as Page, label: 'Revenue Analytics', icon: CircleDollarSign },
  { id: 'products' as Page, label: 'Product Performance', icon: Boxes },
  { id: 'customers' as Page, label: 'Customer Analytics', icon: Users },
  { id: 'orders' as Page, label: 'Order Management', icon: Download },
];

interface Props {
  page: Page;
  setPage: (page: Page) => void;
  dark: boolean;
  setDark: (value: boolean) => void;
  children: ReactNode;
  exportCsv?: () => void;
}

export function Layout({ page, setPage, dark, setDark, children, exportCsv }: Props) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('talha-dashboard-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const pageTitle = nav.find(n => n.id === page)?.label ?? 'Dashboard';

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${open ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">T</div>
          {!collapsed && <div><strong>Talha</strong><span>E-Commerce Analytics</span></div>}
          <button className="icon-btn mobile-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={18}/></button>
        </div>
        <div className="nav-label">{!collapsed && 'Workspace'}</div>
        <nav>
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => { setPage(id); setOpen(false); }} aria-label={label} title={collapsed ? label : undefined}>
              <Icon size={19}/><span>{!collapsed && label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="simulated-badge"><span className="live-dot"></span>{!collapsed && 'Simulated data'}</div>
          <button className="collapse-btn" onClick={() => setCollapsed(v => !v)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={18}/> : <><ChevronLeft size={18}/><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close menu overlay"></button>}

      <main className={`main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21}/></button>
          <div className="header-title">
            <span className="eyebrow">Talha / Analytics</span>
            <h1>{pageTitle}</h1>
          </div>
          <div className="top-actions">
            <div className="clock"><Clock3 size={16}/><span>{now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span></div>
            {exportCsv && <button className="btn secondary export-btn" onClick={exportCsv}><Download size={16}/> Export CSV</button>}
            <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>
            <div className="avatar" aria-label="Talha profile">T</div>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
