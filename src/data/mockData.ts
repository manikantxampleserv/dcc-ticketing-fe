import { Ticket, Agent } from '../types';
import { addHours, subDays, subHours } from 'date-fns';

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'John Mwalimu',
    email: 'john@doubleclick.co.tz',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    is_active: true,
    performance: {
      total_tickets: 45,
      resolved_tickets: 42,
      avg_resolution_time: 6.5,
      sla_compliance: 93.3,
      customer_satisfaction: 4.7,
      response_time: 15
    }
  },
  {
    id: '2',
    name: 'Sarah Kimani',
    email: 'sarah@doubleclick.co.tz',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    is_active: true,
    performance: {
      total_tickets: 38,
      resolved_tickets: 35,
      avg_resolution_time: 8.2,
      sla_compliance: 89.5,
      customer_satisfaction: 4.5,
      response_time: 22
    }
  },
  {
    id: '3',
    name: 'David Mwangi',
    email: 'david@doubleclick.co.tz',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_active: true,
    performance: {
      total_tickets: 32,
      resolved_tickets: 30,
      avg_resolution_time: 7.1,
      sla_compliance: 91.2,
      customer_satisfaction: 4.6,
      response_time: 18
    }
  }
];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticket_number: 'DCK-2024-001',
    subject: 'URGENT: Email server down - cannot send emails',
    description:
      'Our email server has been down since this morning. Staff cannot send or receive emails. This is affecting our business operations.',
    priority: 'high',
    status: 'in-progress',
    customer_name: 'Michael Johnson',
    customer_email: 'michael@techcorp.co.tz',
    customer_company: 'TechCorp Ltd',
    assigned_to: '1',
    created_at: subHours(new Date(), 3).toISOString(),
    updated_at: subHours(new Date(), 1).toISOString(),
    sla_deadline: addHours(new Date(), 1).toISOString(),
    sla_status: 'approaching',
    tags: ['email', 'server', 'critical'],
    attachments: [],
    responses: [
      {
        id: '1',
        ticket_id: '1',
        message:
          'Thank you for reporting this issue. We are investigating the email server problem and will update you shortly.',
        author: 'John Mwalimu',
        author_type: 'agent',
        created_at: subHours(new Date(), 2).toISOString(),
        is_internal: false
      },
      {
        id: '2',
        ticket_id: '1',
        message: 'Checking server logs and mail queue status.',
        author: 'John Mwalimu',
        author_type: 'agent',
        created_at: subHours(new Date(), 1).toISOString(),
        is_internal: true
      }
    ],
    time_spent: 120
  },
  {
    id: '2',
    ticket_number: 'DCK-2024-002',
    subject: 'Website loading slowly',
    description:
      'Our company website has been loading very slowly for the past few days. Customers are complaining about the poor performance.',
    priority: 'medium',
    status: 'open',
    customer_name: 'Grace Mwangi',
    customer_email: 'grace@businesssolutions.co.tz',
    customer_company: 'Business Solutions Ltd',
    assigned_to: '2',
    created_at: subHours(new Date(), 6).toISOString(),
    updated_at: subHours(new Date(), 6).toISOString(),
    sla_deadline: addHours(new Date(), 18).toISOString(),
    sla_status: 'within',
    tags: ['website', 'performance'],
    attachments: [],
    responses: [],
    time_spent: 0
  },
  {
    id: '3',
    ticket_number: 'DCK-2024-003',
    subject: 'Password reset request',
    description: 'I forgot my password and need to reset it. The reset email is not coming through.',
    priority: 'low',
    status: 'resolved',
    customer_name: 'Peter Kamau',
    customer_email: 'peter@retailplus.co.tz',
    customer_company: 'Retail Plus',
    assigned_to: '3',
    created_at: subDays(new Date(), 1).toISOString(),
    updated_at: subHours(new Date(), 2).toISOString(),
    resolved_at: subHours(new Date(), 2).toISOString(),
    sla_deadline: addHours(new Date(), 66).toISOString(),
    sla_status: 'within',
    tags: ['password', 'account'],
    attachments: [],
    responses: [
      {
        id: '3',
        ticket_id: '3',
        message:
          'I have manually reset your password and sent you a new temporary password via email. Please check your inbox.',
        author: 'David Mwangi',
        author_type: 'agent',
        created_at: subHours(new Date(), 2).toISOString(),
        is_internal: false
      }
    ],
    time_spent: 15,
    customer_satisfaction: 5,
    feedback_comment: 'Quick and efficient service. Thank you!'
  },
  {
    id: '4',
    ticket_number: 'DCK-2024-004',
    subject: 'HIGH PRIORITY: Database connection issues',
    description: 'Our application cannot connect to the database. Getting connection timeout errors.',
    priority: 'high',
    status: 'open',
    customer_name: 'Alice Wanjiku',
    customer_email: 'alice@financetech.co.tz',
    customer_company: 'FinanceTech Solutions',
    assigned_to: '1',
    created_at: subHours(new Date(), 1).toISOString(),
    updated_at: subHours(new Date(), 1).toISOString(),
    sla_deadline: addHours(new Date(), 3).toISOString(),
    sla_status: 'within',
    tags: ['database', 'connection', 'critical'],
    attachments: [],
    responses: [],
    time_spent: 0
  },
  {
    id: '5',
    ticket_number: 'DCK-2024-005',
    subject: 'Software license renewal',
    description: 'Our software license is expiring next week. Please help us with the renewal process.',
    priority: 'medium',
    status: 'closed',
    customer_name: 'Robert Kiprotich',
    customer_email: 'robert@agribusiness.co.tz',
    customer_company: 'AgriBusiness Kenya',
    assigned_to: '2',
    created_at: subDays(new Date(), 3).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    resolved_at: subDays(new Date(), 1).toISOString(),
    closed_at: subDays(new Date(), 1).toISOString(),
    sla_deadline: addHours(new Date(), 45).toISOString(),
    sla_status: 'within',
    tags: ['license', 'renewal'],
    attachments: [],
    responses: [
      {
        id: '4',
        ticket_id: '5',
        message: 'I have processed your license renewal. You should receive the new license key within 24 hours.',
        author: 'Sarah Kimani',
        author_type: 'agent',
        created_at: subDays(new Date(), 1).toISOString(),
        is_internal: false
      }
    ],
    time_spent: 45,
    customer_satisfaction: 4,
    feedback_comment: 'Good service, but took a bit longer than expected.'
  }
];
