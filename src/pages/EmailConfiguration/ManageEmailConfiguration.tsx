import {
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  Switch,
  Textarea,
  Stack
} from '@mui/joy';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createEmailConfigurationFn, updateEmailConfigurationFn } from 'services/EmailConfiguration';
import { EmailConfiguration } from 'types';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: EmailConfiguration | null;
  setSelected: (val: EmailConfiguration | null) => void;
}

const ManageEmailConfiguration = ({ open, setOpen, selected, setSelected }: Props) => {
  const [form, setForm] = useState<Partial<EmailConfiguration>>({});

  const client = useQueryClient();

  // Mutations
  const createMutation = useMutation({
    mutationFn: createEmailConfigurationFn,
    onSuccess: res => {
      toast.success(res.message || 'Created successfully');
      client.invalidateQueries({ queryKey: ['email-configurations'] });
      setOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateEmailConfigurationFn,
    onSuccess: res => {
      toast.success(res.message || 'Updated successfully');
      client.invalidateQueries({ queryKey: ['email-configurations'] });
      setOpen(false);
    }
  });

  // Initialize form on edit
  useEffect(() => {
    if (selected) {
      setForm(selected);
    } else {
      setForm({
        smtp_port: 587,
        enable_tls: true,
        auto_reply_enabled: true,
        is_active: true
      });
    }
  }, [selected]);

  const handleChange = (key: keyof EmailConfiguration, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (selected) {
      updateMutation.mutate({ id: selected.id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ maxWidth: 600, width: '100%' }}>
        <ModalClose onClick={() => setOpen(false)} />
        <DialogTitle>{selected ? 'Edit Configuration' : 'Add Configuration'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Input
              placeholder="SMTP Server"
              value={form.smtp_server || ''}
              onChange={e => handleChange('smtp_server', e.target.value)}
            />
            <Input
              placeholder="SMTP Port"
              type="number"
              value={form.smtp_port || 587}
              onChange={e => handleChange('smtp_port', Number(e.target.value))}
            />
            <Input
              placeholder="Username"
              value={form.username || ''}
              onChange={e => handleChange('username', e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password || ''}
              onChange={e => handleChange('password', e.target.value)}
            />
            <Input
              placeholder="From Email"
              value={form.from_email || ''}
              onChange={e => handleChange('from_email', e.target.value)}
            />
            <Input
              placeholder="From Name"
              value={form.from_name || ''}
              onChange={e => handleChange('from_name', e.target.value)}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <span>Enable TLS</span>
              <Switch checked={form.enable_tls || false} onChange={e => handleChange('enable_tls', e.target.checked)} />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <span>Auto Reply Enabled</span>
              <Switch
                checked={form.auto_reply_enabled || false}
                onChange={e => handleChange('auto_reply_enabled', e.target.checked)}
              />
            </Stack>

            {form.auto_reply_enabled && (
              <Textarea
                placeholder="Auto reply message"
                value={form.auto_reply_message || ''}
                onChange={e => handleChange('auto_reply_message', e.target.value)}
              />
            )}

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <span>Is Active</span>
              <Switch checked={form.is_active || false} onChange={e => handleChange('is_active', e.target.checked)} />
            </Stack>

            <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending}>
              {selected ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default ManageEmailConfiguration;
