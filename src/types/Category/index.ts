export interface Category {
  id: number;
  name: string; // 👈 Prisma field
  description?: string | null;
  is_active?: boolean;
  created_at?: string; // Dates are usually strings when sent via API
  tickets?: any[]; // If you have a Ticket type, replace 'any' with Ticket[]
}
