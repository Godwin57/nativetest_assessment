'use client';

import { useState, useEffect, FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createTicket, getCustomers } from '@/lib/api';
import { Customer, Priority, Category, TicketStatus } from '@/lib/types';

interface NewTicketModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function NewTicketModal({ open, onClose, onCreated }: NewTicketModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    customer: '',
    subject: '',
    description: '',
    priority: 'medium' as Priority,
    category: 'general' as Category,
    status: 'open' as TicketStatus,
  });

  useEffect(() => {
    if (open) {
      getCustomers().then(setCustomers).catch(() => {});
    }
  }, [open]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.customer) { setError('Please select a customer.'); return; }
    setLoading(true);
    setError('');
    try {
      await createTicket({
        customer: Number(form.customer),
        subject: form.subject,
        description: form.description,
        priority: form.priority,
        category: form.category,
        status: form.status,
      });
      onCreated?.();
      onClose();
      setForm({ customer: '', subject: '', description: '', priority: 'medium', category: 'general', status: 'open' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">New Ticket</h2>
            <p className="text-sm text-slate-500 mt-0.5">Create a support ticket</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer</label>
            <select
              name="customer"
              value={form.customer}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
            <input
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief description of the issue…"
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed description…"
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          {/* Priority + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                <option value="general">General</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="feature_request">Feature Request</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary text-sm">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Creating…' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
