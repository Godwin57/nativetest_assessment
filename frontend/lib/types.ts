export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type Category = 'billing' | 'technical' | 'general' | 'feature_request';

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Comment {
  id: number;
  ticket: number;
  text_content: string;
  timestamp: string;
}

export interface Ticket {
  id: number;
  customer: number;
  customer_name?: string;
  subject: string;
  description: string;
  priority: Priority;
  category: Category;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  comments: Comment[];
}

export interface TicketStatusCount {
  status: TicketStatus;
  count: number;
}

export interface DashboardStats {
  tickets: number;
  customers: number;
  comments: number;
  by_status: TicketStatusCount[];
}
