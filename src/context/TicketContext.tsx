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
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    slaBreached: 0,
    avgResolutionTime: 0,
    customerSatisfaction: 0,
    firstResponseTime: 0,
    avgResponseTime: 0,
    escalatedTickets: 0
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
    const slaBreached = tickets.filter(t => t.slaStatus === 'breached').length;

    const resolvedTicketsWithTime = tickets.filter(t => t.resolvedAt && t.createdAt);
    const avgResolutionTime =
      resolvedTicketsWithTime.length > 0
        ? resolvedTicketsWithTime.reduce((acc, ticket) => {
            const created = new Date(ticket.createdAt).getTime();
            const resolved = new Date(ticket.resolvedAt!).getTime();
            return acc + (resolved - created) / (1000 * 60 * 60); // hours
          }, 0) / resolvedTicketsWithTime.length
        : 0;

    const ticketsWithRating = tickets.filter(t => t.customerSatisfaction);
    const customerSatisfaction =
      ticketsWithRating.length > 0
        ? ticketsWithRating.reduce((acc, t) => acc + (t.customerSatisfaction || 0), 0) / ticketsWithRating.length
        : 0;

    const stats: DashboardStats = {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      slaBreached,
      avgResolutionTime,
      customerSatisfaction,
      firstResponseTime: 0,
      avgResponseTime: 0,
      escalatedTickets: 0
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
