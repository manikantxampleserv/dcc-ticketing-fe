import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Ticket as TicketType } from 'types';
import { useQuery } from '@tanstack/react-query';
import { ticketsFn } from '../../services/Ticket';
import Loader from '../../components/Loader';

interface UrgentTicketCardProps {
  limit?: number;
  emptyIllustration?: string;
}

const UrgentTicketCard = ({ limit = 3, emptyIllustration }: UrgentTicketCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tickets
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketsFn({ page: 1, limit: 1000, priority: 'Critical' })
  });

  const tickets: TicketType[] = ticketsData?.data || [];
  const displayedTickets = tickets.slice(0, limit);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'closed':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderTickets = (ticketsToRender: TicketType[]) => {
    return ticketsToRender.map(ticket => (
      <div
        key={ticket.id}
        className="p-4 border rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
      >
        <p className="text-sm font-semibold text-gray-900">{ticket.ticket_number}</p>
        <p className="text-sm text-gray-600 truncate">{ticket.subject}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
            {ticket.status}
          </span>
          {ticket.sla_status && <span className="text-red-600 font-medium">SLA: {ticket.sla_status}</span>}
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Compact Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-5 flex items-center justify-between bg-red-50 border-b border-red-100">
          <h2 className="text-lg font-semibold text-red-600 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Urgent Tickets
          </h2>
          <button onClick={() => setIsModalOpen(true)} className="text-sm text-red-500 hover:underline">
            View All
          </button>
        </div>

        {/* Card Content */}
        <div className="relative min-h-[500px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader />
            </div>
          ) : displayedTickets.length === 0 ? (
            <div className="text-center py-6">
              {emptyIllustration && <img src={emptyIllustration} alt="No tickets" className="mx-auto mb-4 w-32" />}
              <p className="text-gray-500">No tickets</p>
            </div>
          ) : (
            <div className="space-y-3">{renderTickets(displayedTickets)}</div>
          )}
        </div>
      </div>

      {/* Modal: Full Ticket List */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Urgent Tickets</h2>

            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader />
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No tickets found</p>
            ) : (
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <a key={ticket.id} href={`/tickets/${ticket.id}`} className="block cursor-pointer">
                    {renderTickets([ticket])}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UrgentTicketCard;
