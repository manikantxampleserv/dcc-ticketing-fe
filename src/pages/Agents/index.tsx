// AgentsManagement.tsx
import { Avatar, Button, Chip, IconButton, Input, Option, Select, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2, UserCheck, Users, UserX } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteAgentFn, agentsFn } from 'services/Agents';
import { Agent } from 'types';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageAgents from './AgentsManagement';
import PopConfirm from 'components/PopConfirm';

const AgentsManagement = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [selectedAgentKeys, setSelectedAgentKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents', currentPage, pageSize, search, roleFilter],
    queryFn: () =>
      agentsFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        role_id: roleFilter !== 'all' ? roleFilter : undefined
      })
  });

  const agents = agentsData?.data || [];
  const pagination = agentsData?.pagination;

  const getRoleColorJoy = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'supervisor':
        return 'primary';
      case 'agent':
        return 'success';
      default:
        return 'neutral';
    }
  };

  const client = useQueryClient();
  const { mutate: deleteAgent, isPending: deleting } = useMutation({
    mutationFn: deleteAgentFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['agents'] });
    }
  });

  const handleDeleteAgent = (agent: Agent) => deleteAgent({ ids: [Number(agent.id)] });

  const handleDeleteSelected = (selectedKeys: React.Key[]) => {
    deleteAgent({ ids: selectedKeys.map(key => Number(key)) });
    setSelectedAgentKeys([]);
  };

  const handleToggleAgentStatus = async (agent: Agent) => {
    try {
      console.log('Toggle status for agent:', agent.id);
    } catch (error) {
      console.error('Error toggling agent status:', error);
    }
  };

  const columns: CustomTableColumn<Agent>[] = [
    {
      key: 'agent',
      dataIndex: 'first_name',
      title: 'AGENT',
      width: 250,
      sortable: true,
      render: (_: any, record: Agent) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            alt={`${record.first_name} ${record.last_name}`}
            src={record.avatar}
            size="md"
            sx={{ '--Avatar-size': '40px' }}
          >
            {!record.avatar && (record.first_name?.[0]?.toUpperCase() || 'A')}
          </Avatar>
          <div>
            <Typography level="body-sm" fontWeight="md" sx={{ textTransform: 'capitalize' }}>
              {`${record.first_name || ''} ${record.last_name || ''}`.trim()}
            </Typography>
            <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
              {record.email}
            </Typography>
          </div>
        </div>
      )
    },
    {
      key: 'user_id',
      dataIndex: 'user_id',
      title: 'AGENT ID',
      sortable: true,
      render: id => <Typography level="body-sm">{id || '-'}</Typography>
    },
    {
      key: 'hire_date',
      dataIndex: 'hire_date',
      title: 'HIRE DATE',
      sortable: true,
      render: date => <Typography level="body-sm">{date ? new Date(date).toLocaleDateString() : '-'}</Typography>
    },
    {
      key: 'role',
      dataIndex: 'role',
      title: 'ROLE',
      sortable: true,
      render: text => (
        <Chip size="sm" variant="soft" color={getRoleColorJoy(text?.name)}>
          {text?.name}
        </Chip>
      )
    },
    {
      key: 'department',
      dataIndex: 'department',
      title: 'DEPARTMENT',
      sortable: true,
      render: text => <Typography level="body-sm">{text?.department_name || '-'}</Typography>
    },
    {
      key: 'phone',
      dataIndex: 'phone',
      title: 'PHONE',
      render: phone => (
        <Typography level="body-sm" sx={{ fontFamily: 'monospace' }}>
          {phone || '-'}
        </Typography>
      )
    },
    {
      key: 'status',
      dataIndex: 'is_active',
      title: 'STATUS',
      align: 'center',
      sortable: true,
      render: isActive => (
        <Chip size="sm" variant="soft" color={isActive ? 'success' : 'danger'}>
          {isActive ? 'Active' : 'Inactive'}
        </Chip>
      )
    },
    {
      key: 'actions',
      dataIndex: 'id',
      title: 'ACTIONS',
      render: (_: any, record: Agent) => (
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
          <IconButton
            size="sm"
            variant="plain"
            color={record.is_active ? 'danger' : 'success'}
            onClick={e => {
              e.stopPropagation();
              handleToggleAgentStatus(record);
            }}
          >
            {record.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
          </IconButton>
          <PopConfirm
            title="Delete Agent"
            description={`Are you sure you want to delete ${record.first_name} ${record.last_name}?`}
            okText="Delete"
            cancelText="Cancel"
            placement="top"
            onConfirm={() => handleDeleteAgent(record)}
          >
            <IconButton size="sm" variant="plain" color="danger" loading={deleting}>
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
          <h1 className="text-2xl font-bold text-gray-900">Agents Management</h1>
          <p className="text-gray-600">Manage system agents and their information</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
          size="md"
        >
          Add Agent
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search Agents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              startDecorator={<Search size={16} />}
              sx={{ width: '320px' }}
            />
            <Select
              value={roleFilter}
              onChange={(_, value) => setRoleFilter(value || 'all')}
              placeholder="Filter by role"
              sx={{ width: '220px' }}
            >
              <Option value="all">All Roles</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Supervisor">Supervisor</Option>
              <Option value="Agent">Agent</Option>
            </Select>
          </div>
        </div>
      </div>

      <CustomTable
        columns={columns}
        dataSource={agents}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedAgentKeys,
          onChange: selectedKeys => setSelectedAgentKeys(selectedKeys)
        }}
        toolbar={{
          title: `Agents (${pagination?.total_count || 0})`,
          onDelete:
            selectedAgentKeys.length > 0
              ? () => (
                  <PopConfirm
                    title="Delete Selected Agents"
                    description={`Are you sure you want to delete ${selectedAgentKeys.length} selected agents?`}
                    okText="Delete"
                    cancelText="Cancel"
                    placement="top"
                    onConfirm={() => handleDeleteSelected(selectedAgentKeys)}
                  >
                    <Button color="danger" size="sm" loading={deleting}>
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
          pageSizeOptions: [7, 14, 21, 28, 35],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
      />

      {!isLoading && agents.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || roleFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first agent.'}
          </p>
        </div>
      )}

      <ManageAgents open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default AgentsManagement;
