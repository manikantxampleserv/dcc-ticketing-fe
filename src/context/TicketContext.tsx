import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Ticket, Agent, DashboardStats, SLAConfig } from '../types';
import { mockTickets, mockAgents } from '../data/mockData';

interface TicketState {
  tickets: Ticket[];
  agents: Agent[];
  currentUser: Agent | null;
  stats: DashboardStats;
  slaConfig: SLAConfig;
  loading: boolean;
}

type TicketAction =
  | { type: 'SET_TICKETS'; payload: Ticket[] }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: Ticket }
  | { type: 'DELETE_TICKET'; payload: string }
  | { type: 'SET_AGENTS'; payload: Agent[] }
  | { type: 'SET_CURRENT_USER'; payload: Agent }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: TicketState = {
  tickets: [],
  agents: [],
  currentUser: null,
  stats: {
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    resolved_tickets: 0,
    closed_tickets: 0,
    sla_breached: 0,
    avg_resolution_time: 0,
    customer_satisfaction: 0,
    first_response_time: 0,
    avg_response_time: 0,
    escalated_tickets: 0
  },
  slaConfig: {
    high: 4,
    medium: 24,
    low: 72
  },
  loading: false
};

const TicketContext = createContext<{
  state: TicketState;
  dispatch: React.Dispatch<TicketAction>;
  updateTicket: (ticket: Ticket) => void;
  calculateStats: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  updateTicket: () => null,
  calculateStats: () => null
});

function ticketReducer(state: TicketState, action: TicketAction): TicketState {
  switch (action.type) {
    case 'SET_TICKETS':
      return { ...state, tickets: action.payload };
    case 'ADD_TICKET':
      return { ...state, tickets: [...state.tickets, action.payload] };
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(ticket => (ticket.id === action.payload.id ? action.payload : ticket))
      };
    case 'DELETE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter(ticket => ticket.id !== action.payload)
      };
    case 'SET_AGENTS':
      return { ...state, agents: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const updateTicket = (ticket: Ticket) => {
    dispatch({ type: 'UPDATE_TICKET', payload: ticket });
  };

  const calculateStats = () => {
    const tickets = state.tickets;
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'closed').length;
    const slaBreached = tickets.filter(t => t.sla_status === 'breached').length;

    const resolvedTicketsWithTime = tickets.filter(t => t.resolved_at && t.created_at);
    const avgResolutionTime =
      resolvedTicketsWithTime.length > 0
        ? resolvedTicketsWithTime.reduce((acc, ticket) => {
            const created = new Date(ticket.created_at).getTime();
            const resolved = new Date(ticket.resolved_at!).getTime();
            return acc + (resolved - created) / (1000 * 60 * 60); // hours
          }, 0) / resolvedTicketsWithTime.length
        : 0;

    const ticketsWithRating = tickets.filter(t => t.customer_satisfaction);
    const customerSatisfaction =
      ticketsWithRating.length > 0
        ? ticketsWithRating.reduce((acc, t) => acc + (t.customer_satisfaction || 0), 0) / ticketsWithRating.length
        : 0;

    const stats: DashboardStats = {
      total_tickets: totalTickets,
      open_tickets: openTickets,
      in_progress_tickets: inProgressTickets,
      resolved_tickets: resolvedTickets,
      closed_tickets: closedTickets,
      sla_breached: slaBreached,
      avg_resolution_time: avgResolutionTime,
      customer_satisfaction: customerSatisfaction,
      first_response_time: 0,
      avg_response_time: 0,
      escalated_tickets: 0
    };

    dispatch({ type: 'SET_STATS', payload: stats });
  };

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_TICKETS', payload: mockTickets });
    dispatch({ type: 'SET_AGENTS', payload: mockAgents });
    dispatch({ type: 'SET_CURRENT_USER', payload: mockAgents[0] });
  }, []);

  useEffect(() => {
    calculateStats();
  }, [state.tickets]);

  return (
    <TicketContext.Provider value={{ state, dispatch, updateTicket, calculateStats }}>
      {children}
    </TicketContext.Provider>
  );
}

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
