import { Button, Modal, ModalClose, ModalDialog, Option, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createRoleFn, updateRoleFn } from 'services/Roles'; // 👈 Role APIs
import { Role } from 'types/Roles'; // 👈 Role type
const ManageRole: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Role | null;
  setSelected: (role: Role | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const { mutate: createRole, isPending: isCreating } = useMutation({
    mutationFn: createRoleFn,
    onSuccess: res => {
      toast.success(res.message || 'Role created successfully!');
      handleClose();
      client.refetchQueries({ queryKey: ['roles'] });
    }
  });

  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: updateRoleFn,
    onSuccess: response => {
      toast.success(response.message || 'Role updated successfully!');
      handleClose();
      client.refetchQueries({ queryKey: ['roles'] });
    }
  });

  const initialValues = {
    name: selected?.name || '',
    is_active: selected?.is_active?.toString() || 'true',
    created_at: selected?.created_at || new Date().toISOString().split('T')[0]
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      if (isEdit) {
        // Update only required fields
        updateRole({
          id: selected?.id!,
          name: values.name,
          is_active: values.is_active === 'true' // convert string back to boolean
        } as Role);
      } else {
        // Create new role
        createRole({
          name: values.name,
          is_active: values.is_active === 'true',
          created_at: values.created_at
        } as Role);
      }
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog size="md" sx={{ padding: '1rem' }} component={Sheet} className="!w-[90%] sm:!w-[500px]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Role' : 'Create Role'}</p>
            <p className="text-sm text-gray-500">Fill in the role details below.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Role Name */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Role Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
              placeholder="Enter role name"
              required
            />
          </div>

          {/* Status */}
          {/* <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Status</label>
            <select
              name="is_active"
              value={formik.values.is_active}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div> */}

          {/* Created At */}
          {/* <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Created At</label>
            <input
              type="text"
              name="created_at"
              value={formik.values.created_at}
              disabled
              className="border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div> */}

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

export default ManageRole;
