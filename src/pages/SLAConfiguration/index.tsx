// src/pages/SLAConfigurations.tsx
import { Button, Chip, IconButton, Stack, Typography } from '@mui/joy';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import CustomTable, { CustomTableColumn } from 'shared/CustomTable';
import { SLAConfiguration } from 'types';
import ManageSLA from './ManageSLAConfiguration';
import { deleteSLAFn, slaFn } from 'services/SLAConfiguration';

const SLAConfigurations = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SLAConfiguration | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['sla-configs'],
    queryFn: slaFn
  });

  const client = useQueryClient();
  const { mutate: deleteSLA } = useMutation({
    mutationFn: deleteSLAFn,
    onSuccess: () => {
      toast.success('SLA deleted');
      client.refetchQueries({ queryKey: ['sla-configs'] });
    }
  });

  const columns: CustomTableColumn<SLAConfiguration>[] = [
    { key: 'priority', dataIndex: 'priority', title: 'PRIORITY' },
    { key: 'response_time_hours', dataIndex: 'response_time_hours', title: 'Response (Hrs)' },
    { key: 'resolution_time_hours', dataIndex: 'resolution_time_hours', title: 'Resolution (Hrs)' },
    {
      key: 'is_active',
      dataIndex: 'is_active',
      title: 'STATUS',
      render: val => (
        <Chip size="sm" color={val ? 'success' : 'danger'}>
          {val ? 'Active' : 'Inactive'}
        </Chip>
      )
    },
    {
      key: 'actions',
      dataIndex: 'id',
      title: 'ACTIONS',
      render: (_, record) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="sm"
            onClick={() => {
              setSelected(record);
              setOpen(true);
            }}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton size="sm" color="danger" onClick={() => deleteSLA(record.id)}>
            <Trash2 size={16} />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">SLA Configurations</h1>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
        >
          Add SLA
        </Button>
      </div>
      <CustomTable columns={columns} dataSource={data || []} rowKey="id" loading={isLoading} />
      <ManageSLA open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
    </div>
  );
};

export default SLAConfigurations;
