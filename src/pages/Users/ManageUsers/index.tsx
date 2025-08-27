import { Button, Modal, ModalClose, ModalDialog, Option, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
// import { createUserFn, updateUserFn } from './services/users'; // 👈 User APIs
import { createUserFn, updateUserFn } from 'services/users'; // 👈 User APIs
import CustomFilePicker from 'shared/CustomFilePicker';
import CustomInput from 'shared/CustomInput';
import CustomRadioInput from 'shared/CustomRadioInput';
import CustomSelect from 'shared/CustomSelect';
import { User } from 'types';

const ManageUsers: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: User | null;
  setSelected: (user: User | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const { mutate: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: createUserFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['users'] });
    }
  });

  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: updateUserFn,
    onSuccess: response => {
      toast.success(response.message);
      setOpen(false);
      setSelected(null);
      client.refetchQueries({ queryKey: ['users'] });
    }
  });

  const initialValues = {
    first_name: selected?.first_name || '',
    last_name: selected?.last_name || '',
    email: selected?.email || '',
    password: '',
    confirm_password: '',
    role_id: selected?.role_id || '',
    department_id: selected?.department_id || '',
    is_active: selected?.is_active || 'true',
    avatar: selected?.avatar || '',
    phone: selected?.phone || ''
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      if (isEdit) {
        updateUser({ ...values, id: selected?.id } as unknown as User);
      } else {
        createUser(values as unknown as User);
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
            <p className="text-lg font-semibold">{isEdit ? 'Edit User' : 'Create User'}</p>
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
            <Button disabled={isEdit ? isUpdatingUser : isCreatingUser} color="primary" type="submit">
              {isEdit ? (isUpdatingUser ? 'Updating...' : 'Update') : isCreatingUser ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ManageUsers;
