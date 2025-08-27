// types/Role.ts
export interface Role {
  id: number;
  name: string; // Role Name
  is_active: boolean; // Status (Active / Inactive)
  created_at: string; // Date created
  updated_at: string; // Last updated
}
