'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Tag, User, AlertCircle, Clock, MessageCircle } from 'lucide-react';
import Topbar from '@/components/Topbar';
import { PriorityBadge, StatusBadge, STATUS_CONFIG } from '@/components/Badges';
import AddCommentForm from '@/components/AddCommentForm';
import { getTicket } from '@/lib/api';
import { Ticket, Comment } from '@/lib/types';

function CommentBubble({ comment, index }: { comment: Comment; index: number }) {
  return (
    <div
      className="flex gap-3 items-start"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-white text-xs font-semibold">S</span>
      </div>
      {/* Bubble */}
      <div className="flex-1 min-w-0">
        <div className="bg-slate-50 border border-slate-100 rounded-xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-slate-700 leading-relaxed">{comment.text_content}</p>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
          <Clock size={11} />
          {new Date(comment.timestamp).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTicket(id)
      .then((t) => {
        setTicket(t);
        setComments(t.comments ?? []);
      })
      .catch(() => setError('Could not load this ticket.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleCommentAdded(c: Comment) {
    setComments((prev) => [...prev, c]);
  }

  if (loading) {
    return (
      <>
        <Topbar title="Ticket Details" />
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-6 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (error || !ticket) {
    return (
      <>
        <Topbar title="Ticket Details" />
        <div className="p-6">
          <div className="card p-10 flex flex-col items-center text-center gap-3">
            <AlertCircle size={32} className="text-rose-400" />
            <p className="text-slate-600">{error || 'Ticket not found.'}</p>
            <button onClick={() => router.back()} className="btn-ghost text-sm mt-2">
              <ArrowLeft size={16} /> Go back
            </button>
          </div>
        </div>
      </>
    );
  }

  const progress = STATUS_CONFIG[ticket.status]?.progress ?? '0%';
  const bar = STATUS_CONFIG[ticket.status]?.bar ?? 'bg-slate-300';

  return (
    <>
      <Topbar
        title="Ticket Details"
        actions={
          <button
            onClick={() => router.back()}
            className="btn-ghost text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left column: main info + comments ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Ticket header card */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Ticket #{String(ticket.id).padStart(4, '0')}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">{ticket.subject}</h2>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Progress</span>
                  <span className="font-medium">{progress}</span>
                </div>
                <div className="progress-bar-track">
                  <div className={`progress-bar-fill ${bar}`} style={{ width: progress }} />
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
              </div>
            </div>

            {/* Comments section */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle size={16} className="text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Comments <span className="ml-1 text-slate-400 font-normal">({comments.length})</span>
                </h3>
              </div>

              {comments.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageCircle size={28} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No comments yet. Be the first to comment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((c, i) => (
                    <CommentBubble key={c.id} comment={c} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment */}
            <AddCommentForm ticketId={ticket.id} onCommentAdded={handleCommentAdded} />
          </div>

          {/* ── Right column: metadata sidebar ── */}
          <div className="space-y-5">
            {/* Details card */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-1">Details</h3>
              <DetailRow
                icon={User}
                label="Customer ID"
                value={`#${ticket.customer}`}
              />
              <DetailRow
                icon={Tag}
                label="Category"
                value={ticket.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              />
              <DetailRow
                icon={Calendar}
                label="Created"
                value={new Date(ticket.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              />
              <DetailRow
                icon={Clock}
                label="Last updated"
                value={new Date(ticket.updated_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              />
            </div>

            {/* Activity summary card */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <MessageCircle size={14} className="text-slate-300" />
                    Comments
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{comments.length}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <AlertCircle size={14} className="text-slate-300" />
                    Priority
                  </span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
