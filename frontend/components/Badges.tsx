import { Priority, TicketStatus } from '@/lib/types';

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; className: string }
> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  high: { label: 'High', className: 'bg-rose-100 text-rose-600' },
  urgent: { label: 'Urgent', className: 'bg-red-600 text-white' },
};

export const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; className: string; progress: string; bar: string }
> = {
  open: {
    label: 'To do',
    className: 'bg-slate-100 text-slate-600',
    progress: '0%',
    bar: 'bg-slate-300',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-700',
    progress: '40%',
    bar: 'bg-amber-400',
  },
  resolved: {
    label: 'Done',
    className: 'bg-green-100 text-green-700',
    progress: '100%',
    bar: 'bg-green-500',
  },
  closed: {
    label: 'Closed',
    className: 'bg-slate-200 text-slate-500',
    progress: '100%',
    bar: 'bg-slate-400',
  },
};

interface PriorityBadgeProps { priority: Priority }
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  return (
    <span className={`badge ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

interface StatusBadgeProps { status: TicketStatus }
export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return (
    <span className={`badge ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
