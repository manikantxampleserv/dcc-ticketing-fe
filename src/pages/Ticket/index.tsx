import { Button, Chip, IconButton, Input, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ticketsFn, deleteTicketFn } from 'services/Ticket';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageTicket from './ManageTicket';
import { Ticket } from 'types/Tickets';

const TicketManagement = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [selectedTicketsKeys, setSelectedTicketsKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets', currentPage, pageSize, search],
    queryFn: () =>
      ticketsFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined
      })
  });

  const tickets = ticketsData?.data || [];
  const pagination = ticketsData?.pagination;

  const client = useQueryClient();
  const { mutate: deleteTickets } = useMutation({
    mutationFn: deleteTicketFn,
    onSuccess: response => {
      toast.success(response.message);
      setSelected(null);
      client.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  const handleDeleteTicket = (ticket: Ticket) => {
    if (window.confirm(`Delete ticket "${ticket.ticket_number}"?`)) {
      deleteTickets({ ids: [Number(ticket.id)] });
    }
  };

  const handleDeleteSelected = (selectedKeys: React.Key[]) => {
    if (window.confirm(`Delete ${selectedKeys.length} selected tickets?`)) {
      deleteTickets({ ids: selectedKeys.map(key => Number(key)) });
      setSelectedTicketsKeys([]);
    }
  };

  const columns: CustomTableColumn<Ticket>[] = [
    {
      key: 'ticket_number',
      dataIndex: 'ticket_number',
      title: 'TICKET NO',
      sortable: true,
      render: (ticket_number: string) => (
        <Typography level="body-sm" fontWeight="md">
          {ticket_number}
        </Typography>
      )
    },
    {
      key: 'subject',
      dataIndex: 'subject',
      title: 'SUBJECT',
      sortable: true,
      render: (subject: string) => (
        <Typography level="body-sm" sx={{ textTransform: 'capitalize' }}>
          {subject}
        </Typography>
      )
    },
    {
      key: 'priority',
      dataIndex: 'priority',
      title: 'PRIORITY',
      align: 'center',
      render: (priority: string) => (
        <Chip
          size="sm"
          variant="soft"
          color={priority === 'High' ? 'danger' : priority === 'Low' ? 'neutral' : 'warning'}
        >
          {priority}
        </Chip>
      )
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'STATUS',
      align: 'center',
      render: (status: string) => (
        <Chip
          size="sm"
          variant="soft"
          color={status === 'Open' ? 'primary' : status === 'Closed' ? 'neutral' : 'warning'}
        >
          {status}
        </Chip>
      )
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'CREATED AT',
      sortable: true,
      render: (createdAt: string) => <Typography level="body-sm">{new Date(createdAt).toLocaleDateString()}</Typography>
    },
    {
      key: 'actions',
      fixed: 'right',
      dataIndex: 'id',
      title: 'ACTIONS',
      align: 'right',
      render: (_: any, record: Ticket) => (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            onClick={e => {
              e.stopPropagation();
              setSelected(record);
              setOpen(true);
            }}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="sm"
            variant="plain"
            color="danger"
            onClick={e => {
              e.stopPropagation();
              handleDeleteTicket(record);
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600">Manage support tickets and their statuses</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
          size="md"
        >
          Add Ticket
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Input
          type="text"
          placeholder="Search Tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          startDecorator={<Search size={16} />}
          sx={{ width: '320px' }}
        />
      </div>

      {/* Tickets Table */}
      <CustomTable
        columns={columns}
        dataSource={tickets}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedTicketsKeys,
          onChange: selectedKeys => setSelectedTicketsKeys(selectedKeys)
        }}
        toolbar={{
          title: `Tickets (${pagination?.total_count || 0})`,
          showFilter: true,
          onDelete: handleDeleteSelected
        }}
        pagination={{
          current: pagination?.current_page || 1,
          pageSize: pageSize,
          total: pagination?.total_count || 0,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 15, 20, 25, 30],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
        size="md"
      />

      {/* Empty State */}
      {!isLoading && tickets.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search.' : 'Click "Add Ticket" to create one.'}
          </p>
        </div>
      )}

      {/* Drawer / Dialog for Create & Edit */}
      <ManageTicket open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default TicketManagement;
