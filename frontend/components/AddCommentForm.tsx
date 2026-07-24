'use client';

import { useState, FormEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { addComment } from '@/lib/api';
import { Comment } from '@/lib/types';

interface AddCommentFormProps {
  ticketId: number;
  onCommentAdded: (comment: Comment) => void;
}

export default function AddCommentForm({ ticketId, onCommentAdded }: AddCommentFormProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const comment = await addComment(ticketId, text.trim());
      onCommentAdded(comment);
      setText('');
    } catch (_) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Add Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment here…"
          rows={4}
          className="input-field resize-none"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {loading ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}
