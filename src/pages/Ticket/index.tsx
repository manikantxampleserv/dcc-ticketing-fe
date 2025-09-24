import { Button, IconButton, Input, Option, Select, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteTicketFn, ticketsFn } from '../../services/Ticket';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageTickets from './ManageTicket';
import PopConfirm from 'components/PopConfirm';
import { Ticket } from 'types';

const statuses = ['open', 'pending', 'closed'];
import { Link } from 'react-router-dom';

const TicketManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [selectedTicketKeys, setSelectedTicketKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const client = useQueryClient();

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['ticket', currentPage, pageSize, search, statusFilter],
    queryFn: () =>
      ticketsFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      })
  });

  const tickets = ticketsData?.data || [];
  const pagination = ticketsData?.pagination;

  const { mutate: deleteTicket, isPending: deleting } = useMutation({
    mutationFn: deleteTicketFn,
    onSuccess: response => {
      toast.success(response.message);
      setSelectedTicketKeys([]);
      client.refetchQueries({ queryKey: ['ticket'] });
    }
  });

  const handleDeleteTicket = (ticket: Ticket) => deleteTicket({ ids: [Number(ticket.id)] });
  const handleDeleteSelected = (keys: React.Key[]) => {
    deleteTicket({ ids: keys.map(key => Number(key)) });
    setSelectedTicketKeys([]);
  };

  const columns: CustomTableColumn<Ticket>[] = [
    {
      key: 'ticket_number',
      dataIndex: 'ticket_number',
      title: 'TICKET NO',
      sortable: true,
      render: (ticket_number: string, record: Ticket) => (
        <Link to={`/tickets/${record?.id}`}>
          <Typography level="body-sm" fontWeight="md">
            {ticket_number}
          </Typography>
        </Link>
      )
    },
    {
      key: 'subject',
      dataIndex: 'subject',
      title: 'SUBJECT',
      sortable: true,
      render: (_, record) => <Typography>{record.subject}</Typography>
    },
    {
      key: 'customer_id',
      dataIndex: 'customer_id',
      title: 'CUSTOMER ID',
      render: customerId => <Typography>{customerId}</Typography>
    },
    {
      key: 'assigned_agent_id',
      dataIndex: 'assigned_agent_id',
      title: 'ASSIGNED AGENT',
      render: agentId => <Typography>{agentId || '-'}</Typography>
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'STATUS',
      sortable: true,
      render: status => <Typography>{status}</Typography>
    },
    {
      key: 'priority',
      dataIndex: 'priority',
      title: 'PRIORITY',
      render: priority => <Typography>{priority}</Typography>
    },
    {
      key: 'actions',
      dataIndex: 'id',
      title: 'ACTIONS',
      render: (_: any, record: Ticket) => (
        <Stack direction="row" spacing={0.5}>
          {/* Edit Ticket */}
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

          {/* Delete Ticket */}
          <PopConfirm
            title="Delete Ticket"
            description={`Are you sure you want to delete ticket "${record.subject}"?`}
            okText="Delete"
            cancelText="Cancel"
            placement="top"
            onConfirm={() => handleDeleteTicket(record)}
          >
            <IconButton size="sm" variant="plain" color="danger">
              <Trash2 size={16} />
            </IconButton>
          </PopConfirm>
        </Stack>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
          <p className="text-gray-600">Manage system tickets and their status</p>
        </div>
        <Button
          startDecorator={<Plus size={16} />}
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add Ticket
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-3">
        <Input
          placeholder="Search Tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: '320px' }}
        />
        <Select value={statusFilter} onChange={(_, value) => setStatusFilter(value || 'all')} sx={{ width: '220px' }}>
          <Option value="all">All Statuses</Option>
          {statuses.map(s => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>
      </div>

      <CustomTable
        columns={columns}
        dataSource={tickets}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedTicketKeys,
          onChange: setSelectedTicketKeys
        }}
        toolbar={{
          title: `Tickets (${pagination?.total_count || 0})`,
          showFilter: true,
          onDelete:
            selectedTicketKeys.length > 0
              ? () => (
                  <PopConfirm
                    title="Delete Selected Tickets"
                    description={`Are you sure you want to delete ${selectedTicketKeys.length} selected tickets?`}
                    okText="Delete"
                    cancelText="Cancel"
                    placement="top"
                    onConfirm={() => handleDeleteSelected(selectedTicketKeys)}
                  >
                    <Button color="danger" size="sm">
                      Delete Selected
                    </Button>
                  </PopConfirm>
                )
              : undefined
        }}
        pagination={{
          current: pagination?.current_page || 1,
          pageSize: pageSize,
          total: pagination?.total_count || 0,
          showSizeChanger: true,
          pageSizeOptions: [7, 14, 21, 28],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
        size="md"
      />

      {!isLoading && tickets.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first ticket.'}
          </p>
        </div>
      )}

      <ManageTickets open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default TicketManagement;
