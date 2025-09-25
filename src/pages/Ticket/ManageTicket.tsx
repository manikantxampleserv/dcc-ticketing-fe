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
interface ManageTicketsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Ticket | null;
  setSelected: (ticket: Ticket | null) => void;
}

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Open', 'Pending', 'Closed'];
const sources = ['Email', 'Phone', 'Chat', 'Web'];
const slaStatuses = ['met', 'breached', 'pending'];
const tagsList = ['Bug', 'Feature', 'Urgent', 'Customer', 'Backend', 'UI']; // example tags

const ManageTickets: React.FC<ManageTicketsProps> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  // API Calls
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersFn({ page: 1, limit: 1000 }) // fetch all users
  });
  console.log(usersData);
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersFn({ page: 1, limit: 1000 }) // fetch all customers
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesFn({ page: 1, limit: 1000 }) // fetch all categories
  });

  const agents = usersData?.data || [];
  const customers = customersData?.data || [];
  const categories = categoriesData?.data || [];

  // Mutations
  const { mutate: createTicket, isPending: isCreating } = useMutation({
    mutationFn: createTicketFn,
    onSuccess: res => {
      toast.success(res.message);
      handleClose();
      client.refetchQueries({ queryKey: ['ticket'] });
    }
  });

  const { mutate: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateTicketFn({ id: selected?.id, ...data }),
    onSuccess: res => {
      toast.success(res.message);
      handleClose();
      client.refetchQueries({ queryKey: ['ticket'] });
    }
  });

  const initialValues = {
    customer_id: selected?.customer_id || '',
    assigned_agent_id: selected?.assigned_agent_id || '',
    category_id: selected?.category_id || '',
    subject: selected?.subject || '',
    description: selected?.description || '',
    priority: selected?.priority || 'medium',
    status: selected?.status || 'open',
    source: selected?.source || 'email',
    sla_deadline: selected?.sla_deadline || '',
    sla_status: selected?.sla_status || 'pending',
    assigned_by: selected?.assigned_by || '',
    time_spent_minutes: selected?.time_spent_minutes || 0,
    tags: selected?.tags || [],
    merged_into_ticket_id: selected?.merged_into_ticket_id || ''
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      const payload = {
        ...values
      };
      if (isEdit) updateTicket(payload);
      else createTicket(payload);
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        size="lg"
        sx={{ padding: '1rem' }}
        component={Sheet}
        className="lg:!w-[60%] !w-[90%] max-h-[80%] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Ticket' : 'Create Ticket'}</p>
            <p className="text-sm text-gray-500">Fill in the information of the ticket.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-4">
            <CustomFilePicker label="Avatar" name="avatar" accept="image/*" formik={formik} />

            {/* Customer Dropdown */}
            <CustomSelect label="Customer" name="customer_id" formik={formik}>
              {customers.map((c: any) => (
                <Option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </Option>
              ))}
            </CustomSelect>

            {/* Agent Dropdown */}
            <CustomSelect label="Assigned Agent" name="assigned_agent_id" formik={formik}>
              {(agents ?? []).map((a: any) => (
                <Option key={a.id} value={a.id}>
                  {a.first_name} {a.last_name}
                </Option>
              ))}
            </CustomSelect>

            {/* Category Dropdown */}
            <CustomSelect label="Category" name="category_id" formik={formik}>
              {categories.map((cat: any) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </Option>
              ))}
            </CustomSelect>

            <CustomInput label="Subject" name="subject" formik={formik} />

            {/* Priority */}
            <CustomSelect label="Priority" name="priority" formik={formik}>
              {priorities.map(p => (
                <Option key={p} value={p}>
                  {p}
                </Option>
              ))}
            </CustomSelect>

            {/* Status */}
            <CustomSelect label="Status" name="status" formik={formik}>
              {statuses.map(s => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </CustomSelect>

            {/* Source */}
            <CustomSelect label="Source" name="source" formik={formik}>
              {sources.map(s => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </CustomSelect>

            {/* SLA Deadline */}
            <FormControl>
              <FormLabel>SLA Deadline</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={formik.values.sla_deadline ? dayjs(formik.values.sla_deadline) : null}
                  onChange={newValue => formik.setFieldValue('sla_deadline', newValue ? newValue.toISOString() : '')}
                />
              </LocalizationProvider>
            </FormControl>

            {/* SLA Status */}
            <CustomSelect label="SLA Status" name="sla_status" formik={formik}>
              {slaStatuses.map(s => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </CustomSelect>

            <CustomInput label="Assigned By" name="assigned_by" formik={formik} />
            <CustomInput label="Time Spent (minutes)" type="number" name="time_spent_minutes" formik={formik} />

            {/* Tags Multi Select */}
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

            {/* Merge Into Ticket */}
            <CustomSelect label="Merge Into Ticket" name="merged_into_ticket_id" formik={formik}>
              {/* You can fetch tickets API and list here */}
              <Option value="">None</Option>
            </CustomSelect>
          </div>

          {/* Description */}
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5">
            <Button color="neutral" onClick={handleClose}>
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
