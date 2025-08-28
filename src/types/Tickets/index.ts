export interface Ticket {
  id: number;
  ticket_number: string;
  customer_id: number;
  assigned_agent_id?: number | null;
  category_id?: number | null;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  source?: string | null;
  sla_deadline?: string | null;
  sla_status?: 'Within' | 'Breached' | null;
  first_response_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  assigned_by?: number | null;
  is_merged?: boolean | null;
  merged_into_ticket_id?: number | null;
  reopen_count?: number | null;
  time_spent_minutes?: number | null;
  last_reopened_at?: string | null;
  customer_satisfaction_rating?: number | null;
  customer_feedback?: string | null;
  tags?: string | null;
  created_at: string;
  updated_at: string;
}

// ✅ sirf create ke liye
export type CreateTicketInput = Omit<Ticket, 'id' | 'created_at' | 'updated_at'>;
