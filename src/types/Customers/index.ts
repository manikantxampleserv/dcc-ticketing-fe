export interface Customer {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  companies: {
    id: number;
    company_name: string;
    domain: string;
  };
  support_ticket_responses: [];
  tickets: [];
}
