'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Ticket } from '@/lib/types';
import { PriorityBadge, StatusBadge, STATUS_CONFIG } from '@/components/Badges';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
}

function getProgressPercent(status: string): number {
  const map: Record<string, number> = {
    open: 0,
    in_progress: 40,
    resolved: 100,
    closed: 100,
  };
  return map[status] ?? 0;
}

export default function TicketCard({ ticket, index }: TicketCardProps) {
  const progress = getProgressPercent(ticket.status);
  const bar = STATUS_CONFIG[ticket.status]?.bar ?? 'bg-slate-300';

  return (
    <div
      className="card p-5 hover:shadow-card-hover transition-all duration-200 group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Ticket number + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Ticket #{String(ticket.id).padStart(4, '0')}
            </span>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>

          <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-green-600 transition-colors duration-150">
            {ticket.subject}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-1">{ticket.description}</p>

          {/* Progress */}
          <div className="mt-3 flex items-center gap-3">
            <div className="progress-bar-track flex-1">
              <div
                className={`progress-bar-fill ${bar}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500 min-w-[36px] text-right">
              {progress}%
            </span>
          </div>
        </div>

        {/* View link */}
        <Link
          href={`/tickets/${ticket.id}`}
          className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-green-500 hover:text-green-600 transition-colors mt-1"
        >
          View ticket
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
