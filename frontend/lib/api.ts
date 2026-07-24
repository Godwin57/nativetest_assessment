import { Customer, Ticket, Comment, TicketStatusCount } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ---------- Tickets ----------

export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BASE_URL}/tickets/`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tickets');
  return res.json();
}

export async function getTicket(id: number | string): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/${id}/`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ticket ${id}`);
  return res.json();
}

export async function createTicket(
  data: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'comments'>
): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

export async function getTicketsByStatus(): Promise<TicketStatusCount[]> {
  const res = await fetch(`${BASE_URL}/tickets/by-status/`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch ticket stats');
  return res.json();
}

// ---------- Customers ----------

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${BASE_URL}/customers/`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

// ---------- Comments ----------

export async function addComment(
  ticketId: number,
  textContent: string
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket: ticketId, text_content: textContent }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}
