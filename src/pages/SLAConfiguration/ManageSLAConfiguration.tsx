import { Button, Input, Modal, ModalDialog, Option, Select, Stack, Switch, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { upsertSLAFn } from 'services/SLAConfiguration';
import { SLAConfiguration } from 'types';

type ManageSLAProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  selected: SLAConfiguration | null;
  setSelected: (v: SLAConfiguration | null) => void;
};

const ManageSLA = ({ open, setOpen, selected, setSelected }: ManageSLAProps) => {
  const [form, setForm] = useState<Partial<SLAConfiguration>>({
    priority: 'low',
    response_time_hours: 1,
    resolution_time_hours: 4,
    business_hours_only: false,
    business_start_time: '09:00:00',
    business_end_time: '17:00:00',
    include_weekends: false,
    is_active: true
  });

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: upsertSLAFn,
    onSuccess: () => {
      toast.success('SLA Configuration saved successfully!');
      client.refetchQueries({ queryKey: ['sla-configs'] });
      setOpen(false);
      setSelected(null);
    },
    onError: () => toast.error('Failed to save SLA configuration')
  });

  const handleSave = () => {
    mutate(form as SLAConfiguration);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <Typography level="title-lg">{selected ? 'Edit SLA' : 'Add SLA'}</Typography>
        <Stack spacing={2} mt={2}>
          <Select
            value={form.priority}
            onChange={(_, value) => setForm({ ...form, priority: value as 'low' | 'medium' | 'high' })}
          >
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
          <Input
            type="number"
            placeholder="Response Time (hours)"
            value={form.response_time_hours}
            onChange={e => setForm({ ...form, response_time_hours: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Resolution Time (hours)"
            value={form.resolution_time_hours}
            onChange={e => setForm({ ...form, resolution_time_hours: Number(e.target.value) })}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Business Hours Only</Typography>
            <Switch
              checked={form.business_hours_only || false}
              onChange={e => setForm({ ...form, business_hours_only: e.target.checked })}
            />
          </Stack>
          <Input
            type="time"
            value={form.business_start_time || '09:00:00'}
            onChange={e => setForm({ ...form, business_start_time: e.target.value })}
          />
          <Input
            type="time"
            value={form.business_end_time || '17:00:00'}
            onChange={e => setForm({ ...form, business_end_time: e.target.value })}
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Include Weekends</Typography>
            <Switch
              checked={form.include_weekends || false}
              onChange={e => setForm({ ...form, include_weekends: e.target.checked })}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Active</Typography>
            <Switch
              checked={form.is_active || false}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
            />
          </Stack>
          <Button onClick={handleSave} loading={isPending}>
            Save
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default ManageSLA;
