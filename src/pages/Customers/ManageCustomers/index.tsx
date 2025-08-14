import { Button, Modal, ModalClose, ModalDialog, Option, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createCustomerFn, updateCustomerFn } from 'services/Customers';
import CustomFilePicker from 'shared/CustomFilePicker';
import CustomInput from 'shared/CustomInput';
import CustomRadioInput from 'shared/CustomRadioInput';
import CustomSelect from 'shared/CustomSelect';
import { Customer } from 'types/Customers';

const ManageCustomers: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Customer | null;
  setSelected: (user: Customer | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const { mutate: createCustomer, isPending: isCreatingCustomer } = useMutation({
    mutationFn: createCustomerFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['customers'] });
    }
  });

  const { mutate: updateCustomer, isPending: isUpdatingCustomer } = useMutation({
    mutationFn: updateCustomerFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['customers'] });
    }
  });

  const initialValues = {
    first_name: selected?.first_name || '',
    last_name: selected?.last_name || '',
    email: selected?.email || '',
    password: '',
    confirm_password: '',
    is_active: selected?.is_active || 'true',
    phone: selected?.phone || ''
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      if (isEdit) {
        updateCustomer({ ...values, id: selected?.id } as unknown as Customer);
      } else {
        createCustomer(values as unknown as Customer);
      }
    }
  });

  console.log(formik.values);

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
            <p className="text-lg font-semibold">{isEdit ? 'Edit Customer' : 'Create Customer'}</p>
            <p className="text-sm text-gray-500">Fill in the information of the user.</p>
          </div>
          <ModalClose onClick={() => setOpen(false)} />
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-4">
            <CustomFilePicker label="Avatar" name="avatar" accept="image/*" formik={formik} />

            <CustomInput label="First Name" name="first_name" formik={formik} />
            <CustomInput label="Last Name" name="last_name" formik={formik} />
            <CustomInput label="Email" name="email" formik={formik} />
            <CustomInput type="number" label="Phone" name="phone" formik={formik} />

            {!isEdit && <CustomInput label="Password" type="password" name="password" formik={formik} />}
            {!isEdit && (
              <CustomInput label="Confirm Password" type="password" name="confirm_password" formik={formik} />
            )}
            <CustomSelect label="Role" name="role" formik={formik}>
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Agent">Agent</Option>
            </CustomSelect>
            <CustomInput label="Department" name="department" formik={formik} />
            <CustomRadioInput
              label="Status"
              name="is_active"
              formik={formik}
              orientation="horizontal"
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-5">
            <Button color="neutral" onClick={handleClose}>
              Cancel
            </Button>
            <Button disabled={isEdit ? isUpdatingCustomer : isCreatingCustomer} color="primary" type="submit">
              {isEdit ? (isUpdatingCustomer ? 'Updating...' : 'Update') : isCreatingCustomer ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ManageCustomers;
