export interface Ticket {
  id: number;
  attachment_urls?: any; // Array of attachment URLs
  ticket_number: string;
  customer_id: number;
  assigned_agent_id?: number | null;
  category_id?: number | null;
  subject: string;
  description: string;
  priority: number;
  // priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed' | 'Resolved' | 'Merged';
  source?: string | null;
  sla_deadline?: string | null;
  sla_status?: 'Within' | 'Breached' | 'Met' | null;
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
  ticket_id: number;
  comment_text: string;
  parent_id: number;
  reason: string;
  action: string;
}

export interface TicketComment {
  ticket_id: number;
  comment_text: string;
  is_internal: boolean;
  attachments?: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  id: number;
  customer_id: number;
  comment_type: string;
  email_message_id: string;
  attachment_urls?: string | null;
}
export interface TicketAttachment {
  ticket_id: number;
  response_id: number;
  file_name: string;
  original_file_name: string;
  file_path: any;
  file_size: number;
  content_type: string;
  file_hash: string;
  uploaded_by: number;
  uploaded_by_type: string;
  is_public: any;
  virus_scanned: boolean;
  scan_result: string;
}

// ✅ sirf create ke liye
export type CreateTicketInput = Omit<Ticket, 'id' | 'created_at' | 'updated_at'>;
