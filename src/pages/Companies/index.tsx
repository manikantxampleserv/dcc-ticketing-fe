import { Button, Chip, IconButton, Input, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { companiesFn, deleteCompanyFn } from 'services/Companies';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageCompany from './ManageCompany';
import { Company } from 'types/Companies';
import PopConfirm from 'components/PopConfirm';
const CompanyManagement = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Company | null>(null);
  const [selectedCompanyKeys, setSelectedCompanyKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ['companies', currentPage, pageSize, search],
    queryFn: () =>
      companiesFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined
      })
  });

  const companies = companiesData?.data || [];
  const pagination = companiesData?.pagination;

  const client = useQueryClient();
  const { mutateAsync: deleteCompanies, isPending: isDeleting } = useMutation({
    mutationFn: deleteCompanyFn,
    onSuccess: response => {
      toast.success(response.message);
      setSelected(null);
      client.refetchQueries({ queryKey: ['companies'] });
    }
  });

  const columns: CustomTableColumn<Company>[] = [
    {
      key: 'company_name',
      dataIndex: 'company_name',
      title: 'COMPANY NAME',
      sortable: true,
      render: (name: string) => (
        <Typography level="body-sm" fontWeight="md" sx={{ textTransform: 'capitalize' }}>
          {name}
        </Typography>
      )
    },
    {
      key: 'domain',
      dataIndex: 'domain',
      title: 'DOMAIN',
      render: (domain: string) => (
        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
          {domain || '--'}
        </Typography>
      )
    },
    {
      key: 'contact_email',
      dataIndex: 'contact_email',
      title: 'EMAIL',
      render: (email: string) => <Typography level="body-sm">{email || '--'}</Typography>
    },
    {
      key: 'contact_phone',
      dataIndex: 'contact_phone',
      title: 'PHONE',
      render: (phone: string) => <Typography level="body-sm">{phone || '--'}</Typography>
    },
    {
      key: 'is_active',
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
      render: (_: any, record: Company) => (
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

          {/* ✅ PopConfirm wrapping delete button */}
          <PopConfirm
            title="Delete Company"
            description="Are you sure you want to delete this company? This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            placement="top"
            onConfirm={() => deleteCompanies({ ids: [Number(record.id)] })}
          >
            <IconButton size="sm" variant="plain" color="danger" onClick={e => e.stopPropagation()}>
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
          <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-gray-600">Manage companies and their details</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
          size="md"
        >
          Add Company
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search Companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              startDecorator={<Search size={16} />}
              sx={{ width: '320px' }}
            />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <CustomTable
        columns={columns}
        dataSource={companies}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedCompanyKeys,
          onChange: selectedKeys => {
            setSelectedCompanyKeys(selectedKeys);
          }
        }}
        toolbar={{
          title: `Companies (${pagination?.total_count || 0})`,
          showFilter: true
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
        onRow={record => ({
          onClick: () => {
            console.log('Company clicked:', record);
          }
        })}
      />

      {/* Empty State */}
      {!isLoading && companies.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search.' : 'Click "Add Company" to create one.'}
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <ManageCompany open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default CompanyManagement;
