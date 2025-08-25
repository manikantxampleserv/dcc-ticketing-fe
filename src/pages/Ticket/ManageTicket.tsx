// import { useState, useEffect } from 'react';
// import { Button, Input, Stack, Typography, Select, Option } from '@mui/joy';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { Ticket } from 'types';
// import { createTicketFn, updateTicketFn } from 'services/Tickets';

// interface ManageTicketProps {
//   ticket?: Ticket | null; // null for create
//   onClose: () => void;
// }

// const ManageTicket = ({ ticket, onClose }: ManageTicketProps) => {
//   const queryClient = useQueryClient();

//   const [formData, setFormData] = useState({
//     subject: '',
//     description: '',
//     priority: 'Low',
//     status: 'Open',
//     assignee_id: ''
//   });

//   // Pre-fill for edit
//   useEffect(() => {
//     if (ticket) {
//       setFormData({
//         subject: ticket.subject || '',
//         description: ticket.description || '',
//         priority: ticket.priority || 'Low',
//         status: ticket.status || 'Open',
//         assignee_id: ticket.assigned_agent_id ? String(ticket.assigned_agent_id) : ''
//       });
//     } else {
//       setFormData({
//         subject: '',
//         description: '',
//         priority: 'Low',
//         status: 'Open',
//         assignee_id: ''
//       });
//     }
//   }, [ticket]);

//   // Create mutation
//   const createMutation = useMutation<
//     Ticket,
//     Error,
//     Omit<Ticket, 'id' | 'ticket_number' | 'created_at' | 'updated_at'> // TVariables (mutate argument)
//   >(createTicketFn, {
//     onSuccess: () => {
//       toast.success('Ticket created successfully!');
//       queryClient.invalidateQueries({ queryKey: ['tickets'] });
//       onClose();
//     },
//     onError: (err: any) => toast.error(err?.message || 'Error creating ticket')
//   });

//   const updateMutation = useMutation<
//     Ticket,
//     Error,
//     Partial<Omit<Ticket, 'ticket_number' | 'created_at' | 'updated_at'>> & { id: number }
//   >(updateTicketFn, {
//     onSuccess: () => {
//       toast.success('Ticket updated successfully!');
//       queryClient.invalidateQueries({ queryKey: ['tickets'] });
//       onClose();
//     },
//     onError: (err: any) => toast.error(err?.message || 'Error updating ticket')
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     if (ticket) {
//       updateMutation.mutate({ ...formData, id: ticket.id });
//     } else {
//       createMutation.mutate(formData);
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg border shadow-md max-w-md mx-auto">
//       <Typography level="h6">{ticket ? 'Edit Ticket' : 'Create Ticket'}</Typography>

//       <Stack spacing={2} mt={2}>
//         <Input placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} />
//         <Input placeholder="Description" name="description" value={formData.description} onChange={handleChange} />
//         <Select
//           name="priority"
//           value={formData.priority}
//           onChange={value => setFormData(prev => ({ ...prev, priority: value }))}
//         >
//           <Option value="Low">Low</Option>
//           <Option value="Medium">Medium</Option>
//           <Option value="High">High</Option>
//         </Select>

//         <Select
//           name="status"
//           value={formData.status}
//           onChange={value => setFormData(prev => ({ ...prev, status: value }))}
//         >
//           <Option value="Open">Open</Option>
//           <Option value="In Progress">In Progress</Option>
//           <Option value="Closed">Closed</Option>
//         </Select>
//         <Select
//           name="status"
//           value={formData.status}
//           onChange={e => handleChange({ target: { name: 'status', value: e } } as any)}
//         >
//           <Option value="Open">Open</Option>
//           <Option value="In Progress">In Progress</Option>
//           <Option value="Closed">Closed</Option>
//         </Select>
//         <Input placeholder="Assignee ID" name="assignee_id" value={formData.assignee_id} onChange={handleChange} />
//       </Stack>

//       <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
//         <Button color="neutral" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} loading={createMutation.isLoading || updateMutation.isLoading}>
//           {ticket ? 'Update' : 'Create'}
//         </Button>
//       </Stack>
//     </div>
//   );
// };

// export default ManageTicket;
import { formControlClasses, Modal, ModalClose, ModalDialog, Sheet } from '@mui/joy';
import { Button, Input, Stack, Typography, Select, Option } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Ticket } from 'types';
import { createTicketFn, updateTicketFn } from 'services/Tickets';
import { useState, useEffect } from 'react';

interface ManageTicketProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  ticket?: Ticket | null;
}

type Priority = 'Low' | 'Medium' | 'High';
type Status = 'Open' | 'In Progress' | 'Closed';

const ManageTicket = ({ open, setOpen, ticket }: ManageTicketProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'Low' as Priority,
    status: 'Open' as Status,
    assignee_id: '',
    customer_id: '',
    category_id: ''
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        subject: ticket.subject || '',
        description: ticket.description || '',
        priority: (ticket.priority as Priority) || 'Low',
        status: (ticket.status as Status) || 'Open',
        assignee_id: ticket.assigned_agent_id ? String(ticket.assigned_agent_id) : '',
        customer_id: ticket.customer_id ? String(ticket.customer_id) : '',
        category_id: ticket.category_id ? String(ticket.category_id) : ''
      });
    } else {
      setFormData({
        subject: '',
        description: '',
        priority: 'Low',
        status: 'Open',
        assignee_id: '',
        customer_id: '',
        category_id: ''
      });
    }
  }, [ticket]);

  const createMutation = useMutation({
    mutationFn: (body: Omit<Ticket, 'id' | 'ticket_number' | 'created_at' | 'updated_at'>) => createTicketFn(body),
    onSuccess: () => {
      toast.success('Ticket created successfully');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setOpen(false);
    },
    onError: (err: any) => toast.error(err?.message || 'Error creating ticket')
  });

  const updateMutation = useMutation({
    mutationFn: (body: Partial<Omit<Ticket, 'ticket_number' | 'created_at' | 'updated_at'>> & { id: number }) =>
      updateTicketFn(body),
    onSuccess: () => {
      toast.success('Ticket updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setOpen(false);
    },
    onError: (err: any) => toast.error(err?.message || 'Error updating ticket')
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (ticket) {
      updateMutation.mutate({ ...formData, id: ticket.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        size="lg"
        component={Sheet}
        className="lg:!w-[50%] !w-[90%] max-h-[80%] overflow-y-auto"
        sx={{ padding: '1rem' }}
      >
        <div className="flex justify-between items-center mb-4">
          <Typography fontSize="lg" fontWeight="bold">
            {ticket ? 'Edit Ticket' : 'Create Ticket'}
          </Typography>
          <ModalClose onClick={() => setOpen(false)} />
        </div>

        <Stack spacing={2}>
          <Input placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} />
          <Input placeholder="Description" name="description" value={formData.description} onChange={handleChange} />
          <Select
            name="priority"
            value={formData.priority}
            onChange={value => handleSelectChange('priority', value as string)}
          >
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
          <Select
            name="status"
            value={formData.status}
            onChange={value => handleSelectChange('status', value as string)}
          >
            <Option value="Open">Open</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Closed">Closed</Option>
          </Select>
          <Input placeholder="Assignee ID" name="assignee_id" value={formData.assignee_id} onChange={handleChange} />
          <Input placeholder="Customer ID" name="customer_id" value={formData.customer_id} onChange={handleChange} />
          <Input placeholder="Category ID" name="category_id" value={formData.category_id} onChange={handleChange} />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button color="neutral" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={createMutation.isLoading || updateMutation.isLoading}>
            {ticket ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default ManageTicket;
