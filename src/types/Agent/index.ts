// types/Agent.ts
export interface Agent {
  id: number;
  user_id: string; // Unique agent identifier
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id: number;
  department_id: number;
  hire_date?: string; // YYYY-MM-DD
  avatar?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
