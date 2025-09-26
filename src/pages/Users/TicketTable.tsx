import { Button, Stack, Typography } from '@mui/joy';
import { IconButton } from '@mui/joy';
import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PopConfirm from 'components/PopConfirm';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import { Ticket } from 'types';

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
  pagination: any;
  selectedTicketKeys: React.Key[];
  setSelectedTicketKeys: (keys: React.Key[]) => void;
  handleDeleteTicket: (ticket: Ticket) => void;
  handleDeleteSelected: (keys: React.Key[]) => void;
  setSelected: (ticket: Ticket | null) => void;
  setOpen: (open: boolean) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
}

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
    key: 'customer',
    dataIndex: 'customers',
    title: 'Customer',
    render: (text: any) => (
      <Typography level="body-sm">
        {text?.first_name && text?.last_name ? `${text.first_name} ${text.last_name}` : '-'}
      </Typography>
    )
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
    render: (status: string) => (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>{status}</span>
    )
  },
  {
    key: 'priority',
    dataIndex: 'priority',
    title: 'PRIORITY',
    render: (priority: string) => (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority}`}>{priority}</span>
    )
  },
  {
    key: 'actions',
    dataIndex: 'id',
    title: 'ACTIONS',
    render: (_: any, record: Ticket, { handleDeleteTicket, setSelected, setOpen }) => (
      <Stack direction="row" spacing={0.5}>
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

const TicketTable = ({
  tickets,
  loading,
  pagination,
  selectedTicketKeys,
  setSelectedTicketKeys,
  handleDeleteSelected,
  handleDeleteTicket,
  setSelected,
  setOpen,
  pageSize,
  setPageSize,
  setCurrentPage
}: TicketTableProps) => {
  return (
    <CustomTable
      columns={columns.map(col =>
        col.key === 'actions'
          ? { ...col, render: (val, rec) => col.render?.(val, rec, { handleDeleteTicket, setSelected, setOpen }) }
          : col
      )}
      dataSource={tickets}
      rowKey="id"
      loading={loading}
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
  );
};

export default TicketTable;
