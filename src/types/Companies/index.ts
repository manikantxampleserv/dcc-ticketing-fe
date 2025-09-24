export interface Company {
  id: number;
  company_name: string;
  domain: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  customers?: any[];
}
