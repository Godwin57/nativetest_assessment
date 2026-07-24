'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, Users, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Tickets', href: '/tickets', icon: Ticket },
  { label: 'Customers', href: '/customers', icon: Users },
];

// The actual sidebar panel — shared between desktop and mobile overlay
function SidebarPanel({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-48 bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">NT</span>
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">
            native<span className="text-green-500">talk</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-green-50 text-green-600 border-l-[3px] border-green-500 pl-[9px]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">DA</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Denise Adebayor</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer whenever the route changes (navigation happened)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when the mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar (md and up) ── */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen z-20">
        <SidebarPanel />
      </aside>

      {/* ── Mobile: hamburger button in top-left corner ── */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-30 w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile: backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <div
        className={`md:hidden fixed top-0 left-0 inset-y-0 z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button inside drawer */}
        <div className="relative h-full">
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className={`absolute top-4 right-[-40px] w-8 h-8 flex items-center justify-center rounded-r-lg bg-white border border-l-0 border-slate-200 text-slate-500 hover:text-slate-800 transition-colors ${mobileOpen ? '' : 'hidden'}`}
          >
            <X size={16} />
          </button>
          <SidebarPanel onNavClick={() => setMobileOpen(false)} />
        </div>
      </div>
    </>
  );
}
