import { Button, Chip, IconButton, Input, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { rolesFn, deleteRoleFn } from 'services/Roles';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageRole from './ManageRole';
import { Role } from 'types/Roles';
import PopConfirm from 'components/PopConfirm'; // ✅ Import PopConfirm

const RolesManagement = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Role | null>(null);
  const [selectedRolesKeys, setSelectedRolesKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ['roles', currentPage, pageSize, search],
    queryFn: () =>
      rolesFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined
      })
  });

  const roles = rolesData?.data || [];
  const pagination = rolesData?.pagination;

  const client = useQueryClient();
  const { mutate: deleteRoles } = useMutation({
    mutationFn: deleteRoleFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['roles'] });
    }
  });

  // ✅ Columns with PopConfirm in Delete Action
  const columns: CustomTableColumn<Role>[] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'ROLE NAME',
      sortable: true,
      render: (name: string) => (
        <Typography level="body-sm" fontWeight="md" sx={{ textTransform: 'capitalize' }}>
          {name}
        </Typography>
      )
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
      render: (_: any, record: Role) => (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
          {/* Edit Button */}
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

          {/* ✅ Delete with PopConfirm */}
          <PopConfirm
            title="Delete Role"
            description={`Are you sure you want to delete role "${record.name}"? This action cannot be undone.`}
            okText="Delete"
            cancelText="Cancel"
            placement="top"
            onConfirm={() => deleteRoles({ ids: [Number(record.id)] })}
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
          <h1 className="text-2xl font-bold text-gray-900">Roles Management</h1>
          <p className="text-gray-600">Manage system roles and their statuses</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
          size="md"
        >
          Add Role
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search Roles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              startDecorator={<Search size={16} />}
              sx={{ width: '320px' }}
            />
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <CustomTable
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRolesKeys,
          onChange: selectedKeys => {
            setSelectedRolesKeys(selectedKeys);
          }
        }}
        toolbar={{
          title: `Roles (${pagination?.total_count || 0})`,
          showFilter: true,
          // ✅ Bulk Delete with PopConfirm
          onDelete: selectedKeys => {
            if (!selectedKeys.length) return;
            if (window.confirm(`Are you sure you want to delete ${selectedKeys.length} roles?`)) {
              deleteRoles({ ids: selectedKeys.map(key => Number(key)) });
              setSelectedRolesKeys([]);
            }
          }
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
            console.log('Role clicked:', record);
          }
        })}
      />

      {/* Empty State */}
      {!isLoading && roles.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search.' : 'Click "Add Role" to create one.'}
          </p>
        </div>
      )}

      <ManageRole open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default RolesManagement;
