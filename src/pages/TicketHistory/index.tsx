import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Loader from 'components/Loader';
import { getCurrentUserFn } from 'services/authentication';

interface TicketType {
  id: number;
  ticket_number: string;
  subject: string;
  priority: string;
  status: string;
  sla_status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

interface TicketHistoryProps {
  agentId?: number | null;
}

const TicketHistory: React.FC<TicketHistoryProps> = ({ agentId }) => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // ✅ Track if we already fetched

  useEffect(() => {
    if (!agentId || hasFetched.current) return; // Skip if no agentId or already fetched

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUserFn(agentId);
        setTickets(data?.user?.tickets || []);
        hasFetched.current = true; // Mark as fetched
      } catch (err: any) {
        toast.error(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [agentId]);

  if (loading) return <Loader text="Loading tickets..." color="bg-blue-500" />;

  if (tickets.length === 0) return <p className="text-center py-10 text-gray-500">No tickets found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map(ticket => (
        <div
          key={ticket.id}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-xl transition-all duration-200 relative"
        >
          <div
            className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-semibold ${
              ticket.status === 'Open'
                ? 'bg-green-500 text-white'
                : ticket.status === 'Closed'
                ? 'bg-gray-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}
          >
            {ticket.status}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Ticket No : {ticket.ticket_number}</span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                ticket.priority.toLowerCase() === 'High'
                  ? 'bg-red-100 text-red-800 mt-4'
                  : ticket.priority.toLowerCase() === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800 mt-4'
                  : 'bg-green-100 text-green-800 mt-4'
              }`}
            >
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{ticket.subject}</h3>

          <p className="text-sm text-gray-500 mb-1">
            SLA:{' '}
            <span className={`${ticket.sla_status === 'breached' ? 'text-red-600' : 'text-green-600'} font-medium`}>
              {ticket.sla_status}
            </span>
          </p>
          <p className="text-sm text-gray-500 mb-3">Source: {ticket.source}</p>

          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
            <span>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
          </div>

          <a
            href={`/tickets/${ticket.id}`}
            className="mt-4 block w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-700 font-medium text-sm text-center transition-colors"
          >
            View Details
          </a>
        </div>
      ))}
    </div>
  );
};

export default TicketHistory;
