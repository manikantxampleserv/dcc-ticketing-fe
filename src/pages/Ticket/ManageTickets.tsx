import React, { useRef, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Textarea
} from '@mui/joy';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { createTicketFn, updateTicketFn } from 'services/Ticket';
import CustomInput from 'shared/CustomInput';
import CustomSelect from 'shared/CustomSelect';
import dayjs from 'dayjs';
import { Ticket } from 'types';
import { customersFn } from 'services/Customers';
import { categoriesFn } from 'services/Category';
import { usersFn } from 'services/users';
import CustomFilePicker from 'shared/CustomFilePicker';

const validationSchema = Yup.object({
  customer_id: Yup.string().required('Customer is required'),
  subject: Yup.string().required('Subject is required'),
  category_id: Yup.string().required('Category is required'),
  assigned_agent_id: Yup.string().required('Assigned Agent is required'),
  status: Yup.string().required('Status is required'),
  priority: Yup.string().required('Priority is required')
});

interface ManageTicketsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Ticket | null;
  setSelected: (ticket: Ticket | null) => void;
}

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
const sources = ['Email', 'Phone', 'Chat', 'Web'];
const slaStatuses = ['met', 'breached', 'pending'];
const tagsList = ['Bug', 'Feature', 'Urgent', 'Customer', 'Backend', 'UI']; // example tags

const ManageTickets: React.FC<ManageTicketsProps> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();
  // Used to force resetting file input when form is reset
  const fileInputKey = useRef(0);

  // Data fetching
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersFn({ page: 1, limit: 1000 })
  });
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersFn({ page: 1, limit: 1000 })
  });
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesFn({ page: 1, limit: 1000 })
  });

  const agents = usersData?.data || [];
  const customers = customersData?.data || [];
  const categories = categoriesData?.data || [];

  // Mutations
  const { mutate: createTicket, isPending: isCreating } = useMutation({
    mutationFn: createTicketFn,
    onSuccess: res => {
      toast.success(res.message);
      handleModalClose();
      client.refetchQueries({ queryKey: ['ticket'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create ticket');
    }
  });
  const { mutate: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateTicketFn({ id: selected?.id, ...data }),
    onSuccess: res => {
      toast.success(res.message);
      handleModalClose();
      client.refetchQueries({ queryKey: ['ticket'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update ticket');
    }
  });

  // Always use a fresh object for initialValues, using selected
  const getInitialValues = React.useCallback(
    () => ({
      attachment_urls: selected?.attachment_urls || null,
      customer_id: selected?.customer_id || '',
      assigned_agent_id: selected?.assigned_agent_id || null,
      category_id: selected?.category_id || '',
      subject: selected?.subject || '',
      description: selected?.description || '',
      priority: selected?.priority || 'Medium',
      status: selected?.status || 'Open',
      source: selected?.source || 'Email',
      sla_deadline: selected?.sla_deadline || null,
      sla_status: selected?.sla_status || 'pending',
      time_spent_minutes: selected?.time_spent_minutes || 0,
      tags: selected?.tags ? JSON.parse(selected?.tags) : [],
      merged_into_ticket_id: selected?.merged_into_ticket_id || null
    }),
    [selected]
  );

  // Formik
  const formik = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema,
    onSubmit: values => {
      const payload = {
        customer_id: Number(values.customer_id),
        subject: values.subject,
        category_id: Number(values.category_id),
        assigned_agent_id: Number(values.assigned_agent_id) || null,
        status: values.status,
        priority: values.priority,
        source: values.source,
        sla_deadline: values.sla_deadline || null,
        sla_status: values.sla_status,
        time_spent_minutes: values.time_spent_minutes,
        tags: Array.isArray(values.tags) ? JSON.stringify(values.tags) : values.tags,
        merged_into_ticket_id: Number(values.merged_into_ticket_id) || null,
        attachment_urls: values.attachment_urls,
        description: values.description
      };
      if (isEdit) updateTicket(payload);
      else createTicket(payload);
    }
  });
  console.log('Valuessss : ', typeof formik.values['tags'], formik.values['tags']);

  // Properly reset on modal close
  const handleModalClose = () => {
    setOpen(false);
    setSelected(null);
    formik.resetForm();
    fileInputKey.current += 1; // force reset file picker[web:31][web:32]
  };

  // Reset form when modal closes from the parent
  useEffect(() => {
    if (!open) {
      formik.resetForm();
      fileInputKey.current += 1;
    }
  }, [open]);

  return (
    <Modal open={open} onClose={handleModalClose}>
      <ModalDialog
        size="lg"
        sx={{ padding: '1rem' }}
        component={Sheet}
        className="lg:!w-[60%] !w-[70%] max-h-[80%] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Ticket' : 'Create Ticket'}</p>
            <p className="text-sm text-gray-500">Fill in the information of the ticket.</p>
          </div>
          <ModalClose onClick={handleModalClose} />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-4">
            <CustomSelect label="Customer" name="customer_id" formik={formik} placeholder="Select a customer">
              {customers.map((c: any) => (
                <Option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </Option>
              ))}
            </CustomSelect>
            <CustomSelect label="Category" name="category_id" formik={formik} placeholder="Select a category">
              {categories.map((cat: any) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </Option>
              ))}
            </CustomSelect>
            <CustomInput label="Subject" name="subject" formik={formik} placeholder="Enter ticket subject" />
            <CustomSelect label="Assigned Agent" name="assigned_agent_id" formik={formik} placeholder="Select an agent">
              {agents.map((a: any) => (
                <Option key={a.id} value={a.id}>
                  {a.first_name} {a.last_name}
                </Option>
              ))}
            </CustomSelect>
            <CustomSelect label="Priority" name="priority" formik={formik} placeholder="Select priority">
              {priorities.map(p => (
                <Option key={p} value={p}>
                  {p}
                </Option>
              ))}
            </CustomSelect>
            <CustomSelect label="Status" name="status" formik={formik} placeholder="Select status">
              {statuses.map(s => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </CustomSelect>
            <CustomSelect label="Source" name="source" formik={formik} placeholder="Select source">
              {sources.map(s => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </CustomSelect>
            {/* File Picker: reset with key */}
            <CustomFilePicker
              key={fileInputKey.current}
              label="Attachment"
              name="attachment_urls"
              accept="image/*"
              formik={formik}
            />
            <FormControl>
              <FormLabel>SLA Deadline</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={formik.values.sla_deadline ? dayjs(formik.values.sla_deadline) : null}
                  onChange={newValue => formik.setFieldValue('sla_deadline', newValue ? newValue.toISOString() : '')}
                />
              </LocalizationProvider>
            </FormControl>
            <CustomSelect label="SLA Status" name="sla_status" formik={formik} placeholder="Select SLA status">
              {slaStatuses.map(s => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </CustomSelect>
            <CustomInput
              disabled={true}
              value={formik.values.time_spent_minutes / 60}
              label="Time Spent (minutes)"
              type="number"
              name="time_spent_minutes"
              formik={formik}
            />
            {/* Tags multi-select */}
            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Select
                multiple
                value={formik.values.tags}
                onChange={(_, val) => formik.setFieldValue('tags', val)}
                placeholder="Select tags"
              >
                {tagsList.map(tag => (
                  <Option key={tag} value={tag}>
                    {tag}
                  </Option>
                ))}
              </Select>
            </FormControl>
            {/* <CustomSelect
              label="Merge Into Ticket"
              name="merged_into_ticket_id"
              formik={formik}
              placeholder="Select ticket"
            >
              <Option value="">None</Option>
            </CustomSelect> */}
          </div>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              minRows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder="Enter ticket description..."
            />
          </FormControl>
          <div className="flex justify-end gap-3 pt-5">
            <Button color="neutral" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button disabled={isEdit ? isUpdating : isCreating} color="primary" type="submit">
              {isEdit ? (isUpdating ? 'Updating...' : 'Update') : isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ManageTickets;
