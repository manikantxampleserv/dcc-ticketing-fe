import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Loader from 'components/Loader';
import { getCurrentUserFn } from 'services/authentication';
import { Calendar, Clock } from 'lucide-react'; // ✅ Icons

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
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!agentId || hasFetched.current) return;

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUserFn(agentId);
        setTickets(data?.user?.tickets || []);
        hasFetched.current = true;
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
          className={`relative bg-white rounded-2xl border-l-4 shadow-sm transition-all duration-200 p-5
            ${
              ticket.priority.toLowerCase() === 'high'
                ? 'border-red-500'
                : ticket.priority.toLowerCase() === 'medium'
                ? 'border-yellow-500'
                : 'border-green-500'
            }`}
        >
          {/* Status Badge (always top right) */}
          <span
            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium 
              ${
                ticket.status.toLowerCase() === 'open'
                  ? 'bg-green-100 text-green-700'
                  : ticket.status.toLowerCase() === 'closed'
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
          >
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </span>

          {/* Ticket Number */}
          <p className="text-sm text-gray-500 font-medium mb-1">Ticket No: #{ticket.ticket_number}</p>

          {/* Priority Badge (separate row under ticket no) */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mb-3
              ${
                ticket.priority.toLowerCase() === 'high'
                  ? 'bg-red-100 text-red-700'
                  : ticket.priority.toLowerCase() === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </span>

          {/* Subject */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.subject}</h3>

          {/* SLA + Source */}
          <div className="text-sm text-gray-600 mb-3">
            <p>
              SLA:{' '}
              <span className={`font-medium ${ticket.sla_status === 'breached' ? 'text-red-600' : 'text-green-600'}`}>
                {ticket.sla_status}
              </span>
            </p>
            <p>Source: {ticket.source}</p>
          </div>

          {/* Dates with Icons */}
          <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(ticket.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(ticket.updated_at).toLocaleDateString()}
            </span>
          </div>

          {/* CTA */}
          <a
            href={`/tickets/${ticket.id}`}
            className="mt-4 block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-sm text-center transition-colors"
          >
            View Details
          </a>
        </div>
      ))}
    </div>
  );
};

export default TicketHistory;
