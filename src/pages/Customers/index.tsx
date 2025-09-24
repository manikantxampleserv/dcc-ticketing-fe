import { Avatar, Button, Chip, IconButton, Input, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2, UserCheck, Users, UserX } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { customersFn, deleteCustomerFn } from 'services/Customers';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import { Customer } from 'types/Customers';
import ManageCustomers from './ManageCustomers';
import PopConfirm from 'components/PopConfirm';

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

  const client = useQueryClient();
  const { mutate: deleteCustomers, isPending: deleting } = useMutation({
    mutationFn: deleteCustomerFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['customers'] });
    }
  });

  const handleDeleteCustomer = (user: Customer) => {
    deleteCustomers({ ids: [Number(user.id)] });
  };

  const handleDeleteSelected = (selectedKeys: React.Key[]) => {
    deleteCustomers({ ids: selectedKeys.map(key => Number(key)) });
    setSelectedCustomersKeys([]);
  };

  const handleToggleCustomerStatus = async (user: Customer) => {
    try {
      console.log('Toggle status for customer:', user.id);
    } catch (error) {
      console.error('Error toggling customer status:', error);
    }
  };

  const columns: CustomTableColumn<Customer>[] = [
    {
      key: 'customer',
      dataIndex: 'first_name',
      title: 'CUSTOMER',
      width: 320,
      sortable: true,
      render: (_: any, record: Customer) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar alt={`${record.first_name} ${record.last_name}`} size="md" sx={{ '--Avatar-size': '40px' }}>
            {record.first_name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Typography level="body-sm" fontWeight="md" sx={{ textTransform: 'capitalize' }}>
              {`${record.first_name || ''} ${record.last_name || ''}`.trim()}
            </Typography>
            <Typography
              level="body-xs"
              sx={{
                color: 'text.tertiary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '240px'
              }}
              title={record.email}
            >
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
      dataIndex: 'id',
      title: 'ACTIONS',
      render: (_: any, record: Customer) => (
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
              handleToggleCustomerStatus(record);
            }}
          >
            {record.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
          </IconButton>
          <PopConfirm
            title="Delete Customer"
            description={`Are you sure you want to delete ${record.first_name} ${record.last_name}?`}
            okText="Delete"
            cancelText="Cancel"
            placement="top"
            onConfirm={() => handleDeleteCustomer(record)}
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage system customers and their details</p>
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

      {/* Customers Table */}
      <CustomTable
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedCustomersKeys,
          onChange: selectedKeys => setSelectedCustomersKeys(selectedKeys),
          getCheckboxProps: record => ({
            disabled: record.is_active === true && Number(record.id) === 1
          })
        }}
        toolbar={{
          title: `Customers (${pagination?.total_count || 0})`,
          showFilter: true,
          onDelete:
            selectedCustomersKeys.length > 0
              ? () => (
                  <PopConfirm
                    title="Delete Selected Customers"
                    description={`Are you sure you want to delete ${selectedCustomersKeys.length} selected customers?`}
                    okText="Delete"
                    cancelText="Cancel"
                    placement="top"
                    onConfirm={() => handleDeleteSelected(selectedCustomersKeys)}
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
          pageSizeOptions: [5, 10, 15, 20, 25, 30],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
        size="md"
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
