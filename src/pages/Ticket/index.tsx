import { useState } from 'react';
import { Button, Input, Stack, Typography } from '@mui/joy';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import { Ticket } from 'types';
import { ticketsFn, deleteTicketFn } from 'services/Tickets';
import ManageTicket from './ManageTicket';

const TicketsManagement = () => {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryClient = useQueryClient();

  // Fetch tickets
  const { data, isLoading } = useQuery({
    queryKey: ['tickets', page, limit, search],
    queryFn: () => ticketsFn({ page, limit, search })
  });

  const tickets: Ticket[] = data?.data || [];
  const pagination = data?.pagination;

  const deleteTicketMutation = useMutation<
    { success: boolean }, 
    Error,
    number 
  >({
    mutationFn: deleteTicketFn,
    onSuccess: () => {
      toast.success('Ticket deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  const handleDelete = (ids: number[]) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} ticket(s)?`)) {
      ids.forEach(id => deleteTicketMutation.mutate(id));
    }
  };

  const columns: CustomTableColumn<Ticket>[] = [
    { key: 'ticket_number', dataIndex: 'ticket_number', title: 'Ticket #', sortable: true },
    { key: 'subject', dataIndex: 'subject', title: 'Subject', sortable: true },
    { key: 'priority', dataIndex: 'priority', title: 'Priority', sortable: true },
    { key: 'status', dataIndex: 'status', title: 'Status', sortable: true },
    // {
    //   key: 'assignee',
    //   title: 'Assignee',
    //   render: (_, record) => record.users?.name || 'Unassigned'
    // },
    {
      key: 'actions',
      dataIndex: 'id',
      title: 'Actions',
      align: 'right',
      render: (_: any, record: Ticket) => (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
          <Button
            size="sm"
            variant="plain"
            color="primary"
            onClick={() => {
              setSelected(record);
              setOpen(true);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="plain" color="danger" onClick={() => handleDelete([record.id])}>
            <Trash2 size={16} />
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-gray-600">Manage all support tickets</p>
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

      {/* Search */}
      <div className="bg-white p-3 rounded-lg border">
        <Input
          placeholder="Search tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          startDecorator={<Search size={16} />}
          sx={{ width: '300px' }}
        />
      </div>

      {/* Table */}
      <CustomTable
        columns={columns}
        dataSource={tickets}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedKeys,
          onChange: (keys: React.Key[]) => setSelectedKeys(keys as number[])
        }}
        pagination={{
          current: pagination?.current_page || 1,
          pageSize: limit,
          total: pagination?.total_count || 0,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          }
        }}
      />

      {/* Empty State */}
      {!isLoading && tickets.length === 0 && (
        <div className="text-center py-12">
          <Typography>No tickets found</Typography>
        </div>
      )}

      {/* Create/Edit Modal */}
      <ManageTicket open={open} setOpen={setOpen} ticket={selected} />
    </div>
  );
};

export default TicketsManagement;
