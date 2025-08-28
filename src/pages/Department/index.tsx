import { Button, Chip, IconButton, Input, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { departmentsFn, deleteDepartmentFn } from 'services/Department';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageDepartment from './ManageDepartment';
import { Department } from 'types/Departments';

const DepartmentsManagement = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Department | null>(null);
  const [selectedDepartmentsKeys, setSelectedDepartmentsKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: departmentsData, isLoading } = useQuery({
    queryKey: ['departments', currentPage, pageSize, search],
    queryFn: () =>
      departmentsFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined
      })
  });

  const departments = departmentsData?.data || [];
  const pagination = departmentsData?.pagination;

  const client = useQueryClient();
  const { mutate: deleteDepartments } = useMutation({
    mutationFn: deleteDepartmentFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['departments'] });
    }
  });

  const handleDeleteDepartment = async (department: Department) => {
    if (window.confirm(`Are you sure you want to delete department "${department.department_name}"?`)) {
      try {
        deleteDepartments({ ids: [Number(department.id)] });
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const handleDeleteSelected = async (selectedKeys: React.Key[]) => {
    if (window.confirm(`Are you sure you want to delete ${selectedKeys.length} selected departments?`)) {
      try {
        deleteDepartments({ ids: selectedKeys.map(key => Number(key)) });
        setSelectedDepartmentsKeys([]);
      } catch (error) {
        console.error('Error deleting selected departments:', error);
      }
    }
  };

  const columns: CustomTableColumn<Department>[] = [
    {
      key: 'department_name',
      dataIndex: 'department_name',
      title: 'DEPARTMENT NAME',
      sortable: true,
      render: (department_name: string) => (
        <Typography level="body-sm" fontWeight="md" sx={{ textTransform: 'capitalize' }}>
          {department_name}
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
      render: (_: any, record: Department) => (
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
            color="danger"
            onClick={e => {
              e.stopPropagation();
              handleDeleteDepartment(record);
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
          <h1 className="text-2xl font-bold text-gray-900">Departments Management</h1>
          <p className="text-gray-600">Manage system departments and their statuses</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
          size="md"
        >
          Add Department
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search Departments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              startDecorator={<Search size={16} />}
              sx={{ width: '320px' }}
            />
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <CustomTable
        columns={columns}
        dataSource={departments}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedDepartmentsKeys,
          onChange: selectedKeys => {
            setSelectedDepartmentsKeys(selectedKeys);
          }
        }}
        toolbar={{
          title: `Departments (${pagination?.total_count || 0})`,
          showFilter: true,
          onDelete: handleDeleteSelected
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
            console.log('Department clicked:', record);
          }
        })}
      />

      {/* Empty State */}
      {!isLoading && departments.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search.' : 'Click "Add Department" to create one.'}
          </p>
        </div>
      )}

      <ManageDepartment open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default DepartmentsManagement;
