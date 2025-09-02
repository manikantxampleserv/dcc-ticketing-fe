import { useState } from 'react';
import { Button, Input, Stack, IconButton, Typography } from '@mui/joy';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { systemSettingsFn, deleteSystemSettingFn } from 'services/SystemSetting';
import { SystemSetting } from 'types';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageSetting from './ManageSetting';

const SystemSettingsManagement = () => {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SystemSetting | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);

  const client = useQueryClient();

  // Fetch settings
  const { data, isLoading } = useQuery({
    queryKey: ['system-settings', page, limit, search],
    queryFn: () => systemSettingsFn({ page, limit, search })
  });

  const settings: SystemSetting[] = data?.data || [];
  const pagination = data?.pagination;

  // Delete mutation
  const { mutate: deleteSetting } = useMutation({
    mutationFn: deleteSystemSettingFn,
    onSuccess: res => {
      toast.success(res.message || 'Deleted successfully');
      setSelected(null);
      setOpen(false);
      client.invalidateQueries({ queryKey: ['system-settings'] });
    }
  });

  const handleDelete = async (ids: number[]) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} setting(s)?`)) {
      try {
        // Delete each ID sequentially
        for (const id of ids) {
          await deleteSetting(id);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const columns: CustomTableColumn<SystemSetting>[] = [
    { key: 'key', dataIndex: 'setting_key', title: 'Key', sortable: true },
    { key: 'value', dataIndex: 'setting_value', title: 'Value', sortable: true },
    { key: 'desc', dataIndex: 'description', title: 'Description' },
    { key: 'type', dataIndex: 'data_type', title: 'Type', sortable: true },

    // {
    //   key: 'actions',
    //   dataIndex: 'id',
    //   title: 'Actions',
    //   align: 'right',
    //   render: (_: any, record: SystemSetting) => (
    //     <Stack direction="row" spacing={1}>
    //       {/* buttons */}
    //     </Stack>
    //   )
    // }
    {
      key: 'actions',
      dataIndex: 'id',
      title: 'Actions',
      align: 'right',
      render: (_: any, record: SystemSetting) => (
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

          {/* Delete Button */}
          <IconButton
            size="sm"
            variant="plain"
            color="danger"
            onClick={e => {
              e.stopPropagation();
              handleDelete([record.id]);
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
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-gray-600">Manage key/value settings for the system</p>
        </div>
        <Button
          startDecorator={<Plus size={16} />}
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add Setting
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-lg border">
        <Input
          placeholder="Search settings..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          startDecorator={<Search size={16} />}
          sx={{ width: '300px' }}
        />
      </div>

      {/* Table */}
      <CustomTable
        columns={columns}
        dataSource={settings}
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
      {!isLoading && settings.length === 0 && (
        <div className="text-center py-12">
          <Typography>No system settings found</Typography>
        </div>
      )}

      {/* Add/Edit Modal */}
      <ManageSetting open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default SystemSettingsManagement;
