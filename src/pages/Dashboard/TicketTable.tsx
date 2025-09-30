import { Input, Select, Option } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import { ticketsFn } from '../../services/Ticket';
import { Ticket, Ticket as TicketType } from 'types';
import { useState } from 'react';
import Loader from '../../components/Loader';

interface TicketTableProps {
  tickets?: TicketType[];
  loading?: boolean;
  fetchTickets?: boolean;
}

const statuses = ['open', 'pending', 'closed'];

const TicketTable = ({ tickets, loading, fetchTickets = true }: TicketTableProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch tickets using React Query
  const { data: fetchedTicketsData, isLoading: tableLoading } = useQuery({
    queryKey: ['ticket', search, statusFilter],
    queryFn: () =>
      ticketsFn({
        page: 1,
        limit: 1000,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      }),
    enabled: fetchTickets
  });

  const displayedTickets = tickets || fetchedTicketsData?.data || [];
  const loadingState = loading ?? tableLoading;

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'closed':
        return 'bg-slate-200 text-slate-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-3">
        <Input
          placeholder="Search Tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: '300px' }}
        />
        <Select value={statusFilter} onChange={(_, v) => setStatusFilter(v || 'all')} sx={{ width: '200px' }}>
          <Option value="all">All Statuses</Option>
          {statuses.map(s => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-4 py-2 font-medium flex text-sm">
          <div className="flex-[1]">TICKET NO</div>
          <div className="flex-[3] pl-12">SUBJECT</div>
          <div className="flex-[2]">CUSTOMER</div>
          <div className="flex-[1]">PRIORITY</div>
          <div className="flex-[1]">STATUS</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
          {loadingState ? (
            <div className="flex justify-center items-center h-32">
              <Loader text="Loading tickets..." color="bg-blue-500" />
            </div>
          ) : displayedTickets.length > 0 ? (
            displayedTickets.map((row: Partial<Ticket>) => (
              <div key={row.id} className="flex border-b border-gray-100 px-4 py-2 text-sm">
                <div className="flex-[1]">{row.ticket_number}</div>
                <div className="flex-[3] pl-12">{row.subject}</div>
                <div className="flex-[2]">
                  {row.customers?.first_name && row.customers?.last_name
                    ? `${row.customers.first_name} ${row.customers.last_name}`
                    : '-'}
                </div>
                <div className="flex-[1]">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      row.sla_priority.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : row.sla_priority.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {row?.sla_priority?.priority}
                  </span>
                </div>
                <div className="flex-[1]">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-32 text-gray-500 text-sm">No tickets found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
