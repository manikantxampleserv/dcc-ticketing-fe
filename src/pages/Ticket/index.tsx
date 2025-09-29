import { Button, IconButton, Input, Option, Select, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteTicketFn, ticketsFn } from '../../services/Ticket';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import PopConfirm from 'components/PopConfirm';
import { Ticket } from 'types';

const statuses = ['Open', 'In Progress', 'Closed', 'Merged', 'Resolved'];
import { Link } from 'react-router-dom';
import ManageTickets from './ManageTickets.tsx';

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
        status: statusFilter !== 'all' ? statusFilter : '',
        priority: ''
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
  console.log('IIII : ', selectedTicketKeys);
  const handleDeleteSelected = async (keys: React.Key[]) => {
    await deleteTicket({ ids: keys.map(key => Number(key)) });
    setSelectedTicketKeys([]);
  };
  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case 'Low':
  //       return 'bg-green-200 text-green-800'; // soft green background, strong green text
  //     case 'Medium':
  //       return 'bg-yellow-200 text-yellow-800'; // soft yellow background, strong yellow text
  //     case 'High':
  //       return 'bg-red-200 text-red-800'; // soft red background, strong red text
  //     default:
  //       return 'bg-gray-200 text-gray-800';
  //   }
  // };

  // Better colors for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-700'; // ✅ Green for active/open
      case 'In Progress':
        return 'bg-blue-100 text-blue-700'; // ✅ Amber/Yellow for pending
      case 'Merged':
        return 'bg-purple-100 text-purple-700'; // ✅ Amber/Yellow for pending
      case 'Closed':
        return 'bg-slate-200 text-slate-800'; // ✅ Better subtle gray for closed
      default:
        return 'bg-gray-100 text-gray-700'; // ✅ Clean neutral fallback
    }
  };

  const columns: CustomTableColumn<Ticket>[] = [
    {
      key: 'ticket_number',
      dataIndex: 'ticket_number',
      title: 'TICKET NO',
      sortable: true,
      render: (ticket_number: string, record: Ticket) => (
        <Link
          className="hover:text-red-600  hover:underline underline-offset-2 hover:cursor-pointer"
          to={`/tickets/${record?.id}`}
        >
          <Typography className="hover:text-red-600 " level="body-sm" fontWeight="md">
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
      render: (_, record) => <Typography className="capitalize">{record.subject}</Typography>
    },
    {
      key: 'customer',
      dataIndex: 'customers', // optional, used for reference
      title: 'Customer',
      render: (text: any) => (
        <Typography level="body-sm">
          {text?.first_name && text?.last_name ? `${text.first_name} ${text.last_name}` : '-'}
        </Typography>
      )
    },

    {
      key: 'assigned_agent_id',
      dataIndex: 'agents_user',
      title: 'ASSIGNED AGENT',
      render: agentId => <Typography>{agentId?.first_name + ' ' + agentId?.last_name || '-'}</Typography>
      // render: text => <Typography level="body-sm">{text?.first_name || '-'}</Typography>
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'STATUS',
      sortable: true,
      render: (status: string) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>{status}</span>
      )
    },
    {
      key: 'priority',
      dataIndex: 'sla_priority',
      title: 'PRIORITY',
      render: (priority: any) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority?.priority}`}>{priority?.priority}</span>
      )
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
        <Select
          value={statusFilter}
          placeholder="Select Status"
          onChange={(_, value) => setStatusFilter(value || 'all')}
          sx={{ width: '220px' }}
        >
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
          onDelete: selectedTicketKeys.length > 0 ? () => handleDeleteSelected(selectedTicketKeys) : undefined
          // onDelete:
          //   selectedTicketKeys.length > 0
          //     ? () => (
          //         <PopConfirm
          //           title="Delete Selected Tickets"
          //           description={`Are you sure you want to delete ${selectedTicketKeys.length} selected tickets?`}
          //           okText="Delete"
          //           cancelText="Cancel"
          //           placement="top"
          //           onConfirm={() => {
          //             handleDeleteSelected(selectedTicketKeys);
          //           }}
          //         >
          //           <Button color="danger" size="sm">
          //             Delete Selected
          //           </Button>
          //         </PopConfirm>
          //       )
          //     : undefined
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
