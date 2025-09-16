import { Button, Chip, IconButton, Input, Stack, Typography } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { categoriesFn, deleteCategoryFn } from 'services/Category'; // 👈 Category APIs
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageCategory from './ManageCategory'; // 👈 Category modal
import { Category } from 'types/Category'; // 👈 Category type
import PopConfirm from 'components/PopConfirm'; // 👈 PopConfirm import

const CategoriesManagement = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);
  const [selectedCategoriesKeys, setSelectedCategoriesKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories', currentPage, pageSize, search],
    queryFn: () =>
      categoriesFn({
        page: currentPage,
        limit: pageSize,
        search: search || undefined
      })
  });

  const categories = categoriesData?.data || [];
  const pagination = categoriesData?.pagination;

  const client = useQueryClient();
  const { mutateAsync: deleteCategories, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategoryFn,
    onSuccess: response => {
      toast.success(response.message);
      setSelected(null);
      client.refetchQueries({ queryKey: ['categories'] });
    }
  });

  // ✅ Columns with PopConfirm in Delete Action
  const columns: CustomTableColumn<Category>[] = [
    {
      key: 'name',
      dataIndex: 'category_name',
      title: 'CATEGORY NAME',
      sortable: true,
      render: (name: string) => (
        <Typography level="body-sm" fontWeight="md" sx={{ textTransform: 'capitalize' }}>
          {name}
        </Typography>
      )
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'DESCRIPTION',
      render: (description: string) => (
        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
          {description || '--'}
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
      render: (_: any, record: Category) => (
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
            title="Delete Category"
            description={`Are you sure you want to delete category "${record.category_name}"? This action cannot be undone.`}
            okText="Delete"
            cancelText="Cancel"
            placement="top"
            onConfirm={() => deleteCategories({ ids: [Number(record.id)] })}
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
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600">Manage product categories and their statuses</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
          size="md"
        >
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Search Categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              startDecorator={<Search size={16} />}
              sx={{ width: '320px' }}
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <CustomTable
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedCategoriesKeys,
          onChange: selectedKeys => {
            setSelectedCategoriesKeys(selectedKeys);
          }
        }}
        toolbar={{
          title: `Categories (${pagination?.total_count || 0})`,
          showFilter: true,
          // ✅ Bulk Delete with PopConfirm
          onDelete: selectedKeys => {
            if (!selectedKeys.length) return;
          },
          renderExtraActions: () =>
            selectedCategoriesKeys.length > 0 && (
              <PopConfirm
                title="Delete Categories"
                description={`Are you sure you want to delete ${selectedCategoriesKeys.length} selected categories? This action cannot be undone.`}
                okText="Delete"
                cancelText="Cancel"
                placement="top"
                onConfirm={() => {
                  deleteCategories({ ids: selectedCategoriesKeys.map(key => Number(key)) });
                  setSelectedCategoriesKeys([]);
                }}
              >
                <Button size="sm" variant="soft" color="danger">
                  Delete Selected
                </Button>
              </PopConfirm>
            )
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
            console.log('Category clicked:', record);
          }
        })}
      />

      {/* Empty State */}
      {!isLoading && categories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try adjusting your search.' : 'Click "Add Category" to create one.'}
          </p>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <ManageCategory open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default CategoriesManagement;
