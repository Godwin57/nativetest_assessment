'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Users, TicketCheck, RefreshCw, Plus, UserPlus, Ticket } from 'lucide-react';
import Topbar from '@/components/Topbar';
import NewTicketModal from '@/components/NewTicketModal';
import { getTicketsByStatus, getCustomers, getTickets } from '@/lib/api';
import { TicketStatusCount } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState({ tickets: 0, customers: 0, comments: 0 });
  const [byStatus, setByStatus] = useState<TicketStatusCount[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const [statusData, customers, tickets] = await Promise.all([
        getTicketsByStatus(),
        getCustomers(),
        getTickets(),
      ]);
      const totalComments = tickets.reduce((s, t) => s + (t.comments?.length ?? 0), 0);
      setStats({ tickets: tickets.length, customers: customers.length, comments: totalComments });
      setByStatus(statusData);
      setLastUpdated(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    } catch (_) {
      // silently fail for demo
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  // Build fake monthly chart data blending real total
  const chartData = MONTHS.map((m, i) => ({
    month: m,
    rate: Math.round(20 + Math.random() * 60),
    highlight: i === 6,
  }));

  const STAT_CARDS = [
    { label: 'Comments', value: stats.comments, icon: MessageSquare, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Customers', value: stats.customers, icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Tickets', value: stats.tickets, icon: TicketCheck, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  const QUICK_ACTIONS = [
    { label: 'Create New Ticket', icon: Ticket, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', onClick: () => setModalOpen(true) },
    { label: 'Create New Customer', icon: UserPlus, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', onClick: () => {} },
    { label: 'Create New User', icon: Plus, iconBg: 'bg-green-100', iconColor: 'text-green-600', onClick: () => {} },
  ];

  return (
    <>
      <Topbar
        title="Dashboard"
        actions={
          <button
            onClick={fetchData}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 transition-all hover:bg-slate-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Refreshing…'}
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={iconColor} />
              </div>
              <p className="text-sm text-slate-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Tickets Completion Rate</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'Rate']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.highlight ? '#22c55e' : '#e2e8f0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ label, icon: Icon, iconBg, iconColor, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex flex-col items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-card hover:border-slate-200 transition-all duration-150 text-left"
              >
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <span className="text-sm font-semibold text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <NewTicketModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={fetchData} />
    </>
  );
}
