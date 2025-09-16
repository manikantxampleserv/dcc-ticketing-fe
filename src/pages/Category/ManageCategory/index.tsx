import { Button, Modal, ModalClose, ModalDialog, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createCategoryFn, updateCategoryFn } from 'services/Category'; // 👈 Category APIs
import { Category } from 'types/Category'; // 👈 Category type

const ManageCategory: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Category | null;
  setSelected: (category: Category | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationFn: createCategoryFn,
    onSuccess: res => {
      toast.success(res.message || 'Category created successfully!');
      handleClose();
      client.refetchQueries({ queryKey: ['categories'] });
    }
  });

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: updateCategoryFn,
    onSuccess: response => {
      toast.success(response.message || 'Category updated successfully!');
      handleClose();
      client.refetchQueries({ queryKey: ['categories'] });
    }
  });

  const initialValues = {
    category_name: selected?.category_name || '',
    description: selected?.description || '', // 👈 Assuming categories have description
    is_active: selected?.is_active?.toString() || 'true',
    created_at: selected?.created_at || new Date().toISOString().split('T')[0]
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      if (isEdit) {
        updateCategory({
          id: selected?.id!,
          category_name: values.category_name,
          description: values.description,
          is_active: values.is_active === 'true'
        } as Category);
      } else {
        createCategory({
          category_name: values.category_name,
          description: values.description,
          is_active: values.is_active === 'true',
          created_at: values.created_at
        } as Category);
      }
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog size="md" sx={{ padding: '1rem' }} component={Sheet} className="!w-[90%] sm:!w-[500px]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Category' : 'Create Category'}</p>
            <p className="text-sm text-gray-500">Fill in the category details below.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Category Name */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Category Name</label>
            <input
              type="text"
              name="category_name"
              value={formik.values.category_name}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2"
              placeholder="Enter category name"
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
              placeholder="Enter category description"
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1 mb-3">
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
          </div>

          {/* Created At */}
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium">Created At</label>
            <input
              type="text"
              name="created_at"
              value={formik.values.created_at}
              disabled
              className="border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
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

export default ManageCategory;
