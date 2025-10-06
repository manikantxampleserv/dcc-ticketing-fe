import { Button, Modal, ModalClose, ModalDialog, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createDepartmentFn, updateDepartmentFn } from 'services/Department'; // Department APIs
import { Department } from 'types/Departments'; // Department type

const ManageDepartment: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Department | null;
  setSelected: (department: Department | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const formik = useFormik({
    initialValues: {
      department_name: selected?.department_name || '',
      is_active: selected?.is_active?.toString() || 'true',
      created_at: selected?.created_at || new Date().toISOString().split('T')[0]
    },
    enableReinitialize: true,
    onSubmit: values => {
      const payload: Department = {
        department_name: values.department_name,
        is_active: values.is_active === 'true',
        created_at: values.created_at
      } as Department;

      if (isEdit) {
        updateDepartment({ id: selected?.id, ...payload });
      } else {
        createDepartment(payload);
      }
    }
  });

  // ✅ Close modal & reset form
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    formik.resetForm();
  };

  const { mutate: createDepartment, isPending: isCreating } = useMutation({
    mutationFn: createDepartmentFn,
    onSuccess: async res => {
      toast.success(res.message || 'Department created successfully!');
      handleClose();
      await client.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: err => {
      toast.error(err.message || 'Failed to create department!');
    }
  });

  const { mutate: updateDepartment, isPending: isUpdating } = useMutation({
    mutationFn: updateDepartmentFn,
    onSuccess: async res => {
      toast.success(res.message || 'Department updated successfully!');
      handleClose();
      await client.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: err => {
      toast.error(err.message || 'Failed to update department!');
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog size="md" sx={{ padding: '1rem' }} component={Sheet} className="!w-[90%] sm:!w-[500px]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Department' : 'Create Department'}</p>
            <p className="text-sm text-gray-500">Fill in the department details below.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Department Name */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Department Name</label>
            <input
              type="text"
              name="department_name"
              value={formik.values.department_name}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
              placeholder="Enter department name"
              required
            />
          </div>

          {/* Status (optional) */}
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

export default ManageDepartment;
