import { Button, Modal, ModalClose, ModalDialog, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createTicketFn, updateTicketFn } from 'services/Ticket'; // 👈 Ticket APIs
import { Ticket } from 'types/Tickets'; // 👈 Ticket type

const ManageTicket: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Ticket | null;
  setSelected: (ticket: Ticket | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const { mutate: createTicket, isPending: isCreating } = useMutation({
    mutationFn: createTicketFn,
    onSuccess: res => {
      toast.success(res.data?.message || 'Ticket created successfully!');
      handleClose();
      client.refetchQueries({ queryKey: ['tickets'] });
    }
  });

  const { mutate: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: updateTicketFn,
    onSuccess: response => {
      toast.success(response.message || 'Ticket updated successfully!');
      handleClose();
      client.refetchQueries({ queryKey: ['tickets'] });
    }
  });

  const initialValues = {
    ticket_number: selected?.ticket_number || '',
    subject: selected?.subject || '',
    description: selected?.description || '',
    priority: selected?.priority || 'Medium',
    status: selected?.status || 'Open',
    customer_id: selected?.customer_id || null
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      if (isEdit) {
        updateTicket({
          id: selected?.id!,
          ...values
        } as Ticket);
      } else {
        createTicket({
          ...values
        } as Ticket);
      }
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog size="md" sx={{ padding: '1rem' }} component={Sheet} className="!w-[90%] sm:!w-[600px]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Ticket' : 'Create Ticket'}</p>
            <p className="text-sm text-gray-500">Fill in the ticket details below.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Ticket Number */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Ticket Number</label>
            <input
              type="text"
              name="ticket_number"
              value={formik.values.ticket_number}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
              placeholder="Enter ticket number"
              required
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
              placeholder="Enter subject"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
              placeholder="Enter description"
              rows={4}
              required
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Priority</label>
            <select
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

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

export default ManageTicket;
