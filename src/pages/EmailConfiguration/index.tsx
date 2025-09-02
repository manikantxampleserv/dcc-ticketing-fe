import { useState } from 'react';
import { Button, Input, Stack, IconButton, Typography } from '@mui/joy';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { emailConfigurationFn, deleteEmailConfigurationFn } from 'services/EmailConfiguration';
import { EmailConfiguration } from 'types';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import ManageEmailConfiguration from './ManageEmailConfiguration';

const EmailConfigurationsManagement = () => {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<EmailConfiguration | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);

  const client = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['email-configurations', page, limit, search],
    queryFn: () => emailConfigurationFn({ page, limit, search })
  });

  const emailConfigs: EmailConfiguration[] = data?.data || [];
  const pagination = data?.pagination;

  // Delete mutation
  const { mutate: deleteConfig } = useMutation({
    mutationFn: deleteEmailConfigurationFn,
    onSuccess: res => {
      toast.success(res.message || 'Deleted successfully');
      setSelected(null);
      setOpen(false);
      client.invalidateQueries({ queryKey: ['email-configurations'] });
    }
  });

  const handleDelete = async (ids: number[]) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} configuration(s)?`)) {
      try {
        for (const id of ids) {
          await deleteConfig(id);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const columns: CustomTableColumn<EmailConfiguration>[] = [
    { key: 'smtp_server', dataIndex: 'smtp_server', title: 'SMTP Server', sortable: true },
    { key: 'smtp_port', dataIndex: 'smtp_port', title: 'Port', sortable: true },
    { key: 'username', dataIndex: 'username', title: 'Username' },
    { key: 'from_email', dataIndex: 'from_email', title: 'From Email' },
    { key: 'from_name', dataIndex: 'from_name', title: 'From Name' },
    { key: 'is_active', dataIndex: 'is_active', title: 'Active', render: val => (val ? 'Yes' : 'No') },
    {
      key: 'actions',
      dataIndex: 'id',
      title: 'Actions',
      align: 'right',
      render: (_: any, record: EmailConfiguration) => (
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
          <h1 className="text-2xl font-bold">Email Configurations</h1>
          <p className="text-gray-600">Manage SMTP email settings for the system</p>
        </div>
        <Button
          startDecorator={<Plus size={16} />}
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add Configuration
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-lg border">
        <Input
          placeholder="Search email configs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          startDecorator={<Search size={16} />}
          sx={{ width: '300px' }}
        />
      </div>

      {/* Table */}
      <CustomTable
        columns={columns}
        dataSource={emailConfigs}
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
      {!isLoading && emailConfigs.length === 0 && (
        <div className="text-center py-12">
          <Typography>No email configurations found</Typography>
        </div>
      )}

      {/* Add/Edit Modal */}
      <ManageEmailConfiguration open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default EmailConfigurationsManagement;
