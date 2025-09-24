// import axiosInstance from 'configs/axios';
// import { DashboardStats } from '../../types/DashboardStats';

// export const dashboardFn = async (): Promise<DashboardStats> => {
//   try {
//     const response = await axiosInstance.get('/getTicketStatus');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// import axiosInstance from 'configs/axios';
// export interface DashboardStats {
//   totalTickets: number;
//   openTickets: number;
//   resolvedToday: number;
//   sla_breached: number;
//   avg_resolution_time: number;
//   customer_satisfaction: number;
// }

// export interface Ticket {
//   id: number;
//   ticket_number: string;
//   subject: string;
//   customer_name: string;
//   customer_company: string;
//   created_at: string;
//   priority: 'high' | 'medium' | 'low';
//   status: 'open' | 'in-progress' | 'resolved' | 'closed';
//   sla_status: string;
// }

// export const dashboardFn = async (): Promise<{
//   stats: DashboardStats;
//   tickets: Ticket[];
// }> => {
//   try {
//     const response = await axiosInstance.get('/getTicketStatus');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

import axiosInstance from 'configs/axios';

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedToday: number;
  sla_breached: number;
  avg_resolution_time: number;
  customer_satisfaction: number;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  customer_name: string;
  customer_company: string;
  created_at: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  sla_status: string;
}

export const dashboardFn = async (): Promise<{
  stats: DashboardStats;
  tickets: Ticket[];
}> => {
  try {
    const response = await axiosInstance.get('/getTicketStatus');

    const data = response.data.data;

    return {
      stats: {
        totalTickets: data.totalTickets ?? 0,
        openTickets: data.openTickets ?? 0,
        resolvedToday: data.resolvedToday ?? 0,
        sla_breached: data.sla_breached ?? 0,
        avg_resolution_time: data.avg_resolution_time ?? 0,
        customer_satisfaction: data.customer_satisfaction ?? 0
      },
      tickets: data.tickets ?? [] // API currently doesn’t send tickets array
    };
  } catch (error) {
    throw error;
  }
};
