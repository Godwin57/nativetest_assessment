'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Filter } from 'lucide-react';
import Topbar from '@/components/Topbar';
import TicketCard from '@/components/TicketCard';
import NewTicketModal from '@/components/NewTicketModal';
import { getTickets, getTicketsByStatus } from '@/lib/api';
import { Ticket, TicketStatus } from '@/lib/types';
import { TicketStatusCount } from '@/lib/types';

const STATUS_TABS: { label: string; value: TicketStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
];

const STATUS_ICON_MAP = {
  open: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Not Started' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'In Progress' },
  resolved: { bg: 'bg-green-100', text: 'text-green-600', label: 'Completed' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Closed' },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [byStatus, setByStatus] = useState<TicketStatusCount[]>([]);
  const [activeTab, setActiveTab] = useState<TicketStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [t, s] = await Promise.all([getTickets(), getTicketsByStatus()]);
      setTickets(t);
      setByStatus(s);
      setLastUpdated(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = activeTab === 'all' ? tickets : tickets.filter((t) => t.status === activeTab);

  const countFor = (status: TicketStatus) =>
    byStatus.find((s) => s.status === status)?.count ?? 0;

  return (
    <>
      <Topbar
        title="Tickets"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-sm"
          >
            <Plus size={16} />
            New Ticket
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Date bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
            <RefreshCw
              size={14}
              onClick={fetchData}
              className={`cursor-pointer hover:text-slate-700 transition-colors ${loading ? 'animate-spin' : ''}`}
            />
            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Loading…'}
          </div>
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 transition-all hover:bg-slate-50">
            <Filter size={14} />
            Filter
          </button>
        </div>

        {/* Status summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {(['open', 'in_progress', 'resolved'] as TicketStatus[]).map((s) => {
            const cfg = STATUS_ICON_MAP[s];
            return (
              <div key={s} className="card p-5 cursor-pointer hover:shadow-card-hover transition-all" onClick={() => setActiveTab(s)}>
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center mb-3`}>
                  <span className={`text-lg font-bold ${cfg.text}`}>#</span>
                </div>
                <p className="text-sm text-slate-500 mb-1">{cfg.label}</p>
                <p className="text-3xl font-bold text-slate-900">{countFor(s)}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {STATUS_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === value
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Ticket list */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/4 mb-3" />
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-slate-400 text-sm">No tickets found.</p>
            </div>
          ) : (
            filtered.map((ticket, i) => (
              <TicketCard key={ticket.id} ticket={ticket} index={i} />
            ))
          )}
        </div>
      </div>

      <NewTicketModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={fetchData} />
    </>
  );
}
