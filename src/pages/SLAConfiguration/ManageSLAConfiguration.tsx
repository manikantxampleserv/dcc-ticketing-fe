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
  form: Partial<SLAConfiguration>;
  setForm: (v: Partial<SLAConfiguration>) => void;
};

const ManageSLA = ({ open, setOpen, selected, setSelected, form, setForm }: ManageSLAProps) => {
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
            onChange={(_, value) => setForm({ ...form, priority: value as 'Low' | 'Medium' | 'High' | 'Critical' })}
          >
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
            <Option value="Critical">Critical</Option>
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
