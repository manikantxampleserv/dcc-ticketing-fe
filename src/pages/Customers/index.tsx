import { Avatar, Button, Chip, IconButton, Input, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2, UserCheck, Users, UserX } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { customersFn, deleteCustomerFn } from 'services/Customers';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import { Customer } from 'types/Customers';
import ManageCustomers from './ManageCustomers';

const CustomersManagement = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [selectedCustomersKeys, setSelectedCustomersKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers', currentPage, pageSize, search],
    queryFn: () =>
      customersFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined
      })
  });

  const customers = customersData?.data || [];
  const pagination = customersData?.pagination;

  const handleToggleCustomerStatus = async (user: Customer) => {
    try {
      console.log('Toggle status for user:', user.id);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };
  const client = useQueryClient();
  const { mutate: deleteCustomers } = useMutation({
    mutationFn: deleteCustomerFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['customers'] });
    }
  });

  const handleDeleteCustomer = async (user: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      try {
        deleteCustomers({ ids: [Number(user.id)] });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeleteSelected = async (selectedKeys: React.Key[]) => {
    if (window.confirm(`Are you sure you want to delete ${selectedKeys.length} selected users?`)) {
      try {
        deleteCustomers({ ids: selectedKeys.map(key => Number(key)) });
        setSelectedCustomersKeys([]);
      } catch (error) {
        console.error('Error deleting selected users:', error);
      }
    }
  };

  const columns: CustomTableColumn<Customer>[] = [
    {
      key: 'customer',
      dataIndex: 'first_name',
      title: 'CUSTOMER',
      width: 250,
      sortable: true,
      render: (_: any, record: Customer) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar alt={`${record.first_name} ${record.last_name}`} size="md" sx={{ '--Avatar-size': '40px' }}>
            {record.first_name?.[0]?.toUpperCase() || 'U'}
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
      key: 'company',
      dataIndex: 'companies',
      title: 'COMPANY',
      sortable: true,
      render: (companies: Customer['companies']) => (
        <div>
          <Typography level="body-sm" fontWeight="md">
            {companies?.company_name || '-'}
          </Typography>
          <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
            {companies?.domain || '-'}
          </Typography>
        </div>
      )
    },
    {
      key: 'job_title',
      dataIndex: 'job_title',
      title: 'JOB TITLE',
      sortable: true,
      render: (jobTitle: string) => (
        <Typography level="body-sm" sx={{ textTransform: 'capitalize' }}>
          {jobTitle || '-'}
        </Typography>
      )
    },
    {
      key: 'phone',
      dataIndex: 'phone',
      title: 'PHONE',
      render: (phone: string) => (
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
      render: (isActive: boolean) => (
        <Chip size="sm" variant="soft" color={isActive ? 'success' : 'danger'}>
          {isActive ? 'Active' : 'Inactive'}
        </Chip>
      )
    },
    {
      key: 'created',
      dataIndex: 'created_at',
      title: 'CREATED',
      sortable: true,
      render: (createdAt: string) => <Typography level="body-sm">{new Date(createdAt).toLocaleDateString()}</Typography>
    },
    {
      key: 'actions',
      fixed: 'right',
      dataIndex: 'id',
      title: 'ACTIONS',
      align: 'right',
      render: (_: any, record: Customer) => (
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
              handleToggleCustomerStatus(record);
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
              handleDeleteCustomer(record);
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
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
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          {/* Search */}
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search Customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              startDecorator={<Search size={16} />}
              sx={{ width: '320px' }}
            />
          </div>
        </div>
      </div>

      {/* Customers Table using CustomTable */}
      <CustomTable
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedCustomersKeys,
          onChange: selectedKeys => {
            setSelectedCustomersKeys(selectedKeys);
          },
          getCheckboxProps: record => ({
            disabled: record.is_active === true && Number(record.id) === 1
          })
        }}
        toolbar={{
          title: `Customers (${pagination?.total_count || 0})`,
          showFilter: true,
          onDelete: handleDeleteSelected
        }}
        pagination={{
          current: pagination?.current_page || 1,
          pageSize: pageSize,
          total: pagination?.total_count || 0,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
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
      {!isLoading && customers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">{search || 'Try adjusting your search criteria.'}</p>
        </div>
      )}

      <ManageCustomers open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default CustomersManagement;
