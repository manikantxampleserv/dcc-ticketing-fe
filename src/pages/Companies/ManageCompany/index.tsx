import { Button, Modal, ModalClose, ModalDialog, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createCompanyFn, updateCompanyFn } from 'services/Companies';
import { Company } from 'types/Companies';

const ManageCompany: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Company | null;
  setSelected: (company: Company | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const formik = useFormik({
    initialValues: {
      company_name: selected?.company_name || '',
      domain: selected?.domain || '',
      contact_email: selected?.contact_email || '',
      contact_phone: selected?.contact_phone || '',
      address: selected?.address || '',
      is_active: selected?.is_active?.toString() || 'true',
      created_at: selected?.created_at || new Date().toISOString().split('T')[0]
    },
    enableReinitialize: true,
    onSubmit: values => {
      const payload: Company = {
        ...values,
        is_active: values.is_active === 'true'
      } as Company;

      if (isEdit) {
        updateCompany({ id: selected?.id!, ...payload });
      } else {
        createCompany(payload);
      }
    }
  });

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    formik.resetForm();
  };

  const { mutate: createCompany, isPending: isCreating } = useMutation({
    mutationFn: createCompanyFn,
    onSuccess: async res => {
      toast.success(res.message || 'Company created successfully!');
      handleClose();
      await client.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: err => {
      toast.error(err.message || 'Failed to create company!');
    }
  });

  const { mutate: updateCompany, isPending: isUpdating } = useMutation({
    mutationFn: updateCompanyFn,
    onSuccess: async res => {
      toast.success(res.message || 'Company updated successfully!');
      handleClose();
      await client.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: err => {
      toast.error(err.message || 'Failed to update company!');
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog size="md" component={Sheet} className="!w-[500px] sm:!w-[40%]">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Company' : 'Create Company'}</p>
            <p className="text-sm text-gray-500">Fill in the company details below.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formik.values.company_name}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2 w-full"
              required
              placeholder="Enter Company Name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Domain</label>
            <input
              type="text"
              name="domain"
              value={formik.values.domain}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2 w-full"
              required
              placeholder="Enter Domain"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={formik.values.contact_email}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Enter Contact Email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Contact Phone</label>
            <input
              type="text"
              name="contact_phone"
              value={formik.values.contact_phone}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Enter Contact Phone"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2 w-full"
              rows={3}
              placeholder="Enter Address"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="is_active"
              value={formik.values.is_active}
              onChange={formik.handleChange}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button color="neutral" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEdit ? isUpdating : isCreating}>
              {isEdit ? (isUpdating ? 'Updating...' : 'Update') : isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ManageCompany;
