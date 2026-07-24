'use client';

import { useState, useEffect } from 'react';
import { Mail, User, Search } from 'lucide-react';
import Topbar from '@/components/Topbar';
import { getCustomers } from '@/lib/api';
import { Customer } from '@/lib/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Topbar title="Customers" />
      <div className="p-6 space-y-5">
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                      <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                      <td className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-12" /></td>
                    </tr>
                  ))
                : filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            <User size={14} className="text-white" />
                          </div>
                          <span className="font-medium text-slate-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail size={13} className="text-slate-400" />
                          {c.email}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-400 font-mono text-xs">#{c.id}</td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No customers found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
