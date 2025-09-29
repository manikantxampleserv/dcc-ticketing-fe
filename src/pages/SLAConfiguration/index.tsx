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

const initialSLA = {
  priority: 'Low',
  response_time_hours: 1,
  resolution_time_hours: 4,
  business_hours_only: false,
  business_start_time: '09:00:00',
  business_end_time: '17:00:00',
  include_weekends: false,
  is_active: true
};
const SLAConfigurations = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SLAConfiguration | null>(null);
  const [form, setForm] = useState<Partial<SLAConfiguration>>(initialSLA as Partial<SLAConfiguration>);

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
    { key: 'response_time_hours', dataIndex: 'response_time_hours', title: 'First Response Time (Hrs)' },
    { key: 'resolution_time_hours', dataIndex: 'resolution_time_hours', title: 'Resolution Time (Hrs)' },
    { key: 'business_start_time', dataIndex: 'business_start_time', title: 'Bussiness Start Time' },
    { key: 'business_end_time', dataIndex: 'business_end_time', title: 'Bussiness End Time' },
    // { key: 'include_weekends', dataIndex: 'include_weekends', title: 'Weekend Inclued' },
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
            setForm(initialSLA as Partial<SLAConfiguration>);
            setOpen(true);
          }}
          startDecorator={<Plus size={16} />}
        >
          Add SLA
        </Button>
      </div>
      <CustomTable columns={columns} dataSource={data?.data || []} rowKey="id" loading={isLoading} />
      <ManageSLA
        open={open}
        setOpen={setOpen}
        selected={selected}
        setSelected={setSelected}
        form={form}
        setForm={setForm}
      />
    </div>
  );
};

export default SLAConfigurations;
