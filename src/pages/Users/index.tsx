import { Avatar, Button, Chip, IconButton, Input, Option, Select, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2, UserCheck, Users, UserX } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
// import { deleteUserFn, usersFn } from './services/Users';
import { deleteUserFn, usersFn } from 'services/users';
import { User } from 'types';
import { CustomTable, CustomTableColumn } from '@manikantsharma/react-table';
import ManageUsers from './ManageUsers';

const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [selectedUserKeys, setSelectedUserKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', currentPage, pageSize, search, roleFilter],
    queryFn: () =>
      usersFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      })
  });

  const users = usersData?.data || [];
  const pagination = usersData?.pagination;

  const getRoleColorJoy = (role: string): 'primary' | 'neutral' | 'danger' | 'success' | 'warning' => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'supervisor':
        return 'primary';
      case 'agent':
        return 'success';
      case 'customer':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      console.log('Toggle status for user:', user.id);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };
  const client = useQueryClient();
  const { mutate: deleteUser } = useMutation({
    mutationFn: deleteUserFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['users'] });
    }
  });

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      try {
        deleteUser({ ids: [Number(user.id)] });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeleteSelected = async (selectedKeys: React.Key[]) => {
    if (window.confirm(`Are you sure you want to delete ${selectedKeys.length} selected users?`)) {
      try {
        deleteUser({ ids: selectedKeys.map(key => Number(key)) });
        setSelectedUserKeys([]);
      } catch (error) {
        console.error('Error deleting selected users:', error);
      }
    }
  };

  const columns: CustomTableColumn<User>[] = [
    {
      key: 'user',
      dataIndex: 'first_name',
      title: 'USER',
      width: 250,
      sortable: true,
      render: (_: any, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            alt={`${record.first_name} ${record.last_name}`}
            src={record.avatar}
            size="md"
            sx={{ '--Avatar-size': '40px' }}
          >
            {!record.avatar && (record.first_name?.[0]?.toUpperCase() || 'U')}
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
      key: 'role',
      dataIndex: 'user_role',
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
      dataIndex: 'user_department',
      render: text => <Typography level="body-sm">{text?.department_name || '-'}</Typography>,
      title: 'DEPARTMENT',
      sortable: true
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
      key: 'lastLogin',
      dataIndex: 'last_login_at',
      title: 'LAST LOGIN',
      sortable: true,
      render: lastLogin => (
        <Typography level="body-sm">{lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never'}</Typography>
      )
    },
    {
      key: 'created',
      dataIndex: 'created_at',
      title: 'CREATED',
      sortable: true,
      render: createdAt => <Typography level="body-sm">{new Date(createdAt).toLocaleDateString()}</Typography>
    },
    {
      key: 'actions',
      fixed: 'right',
      dataIndex: 'id',
      title: 'ACTIONS',
      align: 'right',
      render: (_: any, record: User) => (
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
            color={record.is_active ? 'danger' : 'success'}
            onClick={e => {
              e.stopPropagation();
              handleToggleUserStatus(record);
            }}
          >
            {record.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
          </IconButton>
          <IconButton
            size="sm"
            variant="plain"
            color="danger"
            onClick={e => {
              e.stopPropagation();
              handleDeleteUser(record);
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
          size="md"
        >
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          {/* Search */}
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search Users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              startDecorator={<Search size={16} />}
              sx={{ width: '320px' }}
            />

            {/* Role Filter */}
            <Select
              value={roleFilter}
              onChange={(_, value) => setRoleFilter(value || 'all')}
              placeholder="Filter by role"
              sx={{ width: '220px' }}
            >
              <Option value="all">All Roles</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Agent">Agent</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Users Table using CustomTable */}
      <CustomTable
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedUserKeys,
          onChange: selectedKeys => {
            setSelectedUserKeys(selectedKeys);
          },
          getCheckboxProps: record => ({
            disabled: record.user_role?.name?.toLowerCase() === 'admin'
          })
        }}
        toolbar={{
          title: `Users (${pagination?.total_count || 0})`,
          showFilter: true,
          onDelete: handleDeleteSelected
        }}
        pagination={{
          current: pagination?.current_page || 1,
          pageSize: pageSize,
          total: pagination?.total_count || 0,
          showSizeChanger: true,
          pageSizeOptions: [7, 14, 21, 28, 35, 42, 49, 56, 63, 70],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
        size="md"
        onRow={record => ({
          onClick: () => {
            console.log('Row clicked:', record);
          }
        })}
      />

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || roleFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first user.'}
          </p>
        </div>
      )}

      <ManageUsers open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default UserManagement;
