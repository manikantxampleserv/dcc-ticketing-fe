import { Button, Modal, ModalClose, ModalDialog, Option, Sheet } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createUserFn, updateUserFn } from 'services/users';
import { rolesFn } from 'services/Roles';
import { departmentsFn } from 'services/Department';
import CustomFilePicker from 'shared/CustomFilePicker';
import CustomInput from 'shared/CustomInput';
import CustomRadioInput from 'shared/CustomRadioInput';
import CustomSelect from 'shared/CustomSelect';
import { User } from 'types';

interface ManageUsersProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: User | null;
  setSelected: (user: User | null) => void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  // ✅ Formik initial values
  const initialValues = {
    first_name: selected?.first_name || '',
    last_name: selected?.last_name || '',
    email: selected?.email || '',
    password_hash: '',
    confirm_password: '',
    role_id: selected?.role_id || '',
    department_id: selected?.department_id || '',
    is_active: selected?.is_active?.toString() || 'true',
    avatar: selected?.avatar || '',
    phone: selected?.phone || ''
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      const payload = {
        ...values,
        is_active: values.is_active === 'true' || values.is_active === true
      };

      if (isEdit) updateUser({ ...payload, id: selected?.id } as User);
      else createUser(payload as User);
    }
  });

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    formik.resetForm();
  };

  // Fetch roles & departments
  const { data: rolesData } = useQuery({ queryKey: ['roles'], queryFn: () => rolesFn({}) });
  const { data: departmentsData } = useQuery({ queryKey: ['departments'], queryFn: () => departmentsFn() });
  const roles = rolesData?.data || [];
  const departments = departmentsData?.data || [];

  const { mutate: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: createUserFn,
    onSuccess: async res => {
      toast.success(res.message || 'User created successfully!');
      handleClose();
      await client.invalidateQueries({ queryKey: ['users'] });
    },
    onError: err => toast.error(err.message || 'Failed to create user!')
  });

  const { mutate: updateUser, isPending: isUpdatingUser } = useMutation({
    mutationFn: updateUserFn,
    onSuccess: async res => {
      toast.success(res.message || 'User updated successfully!');
      handleClose();
      await client.invalidateQueries({ queryKey: ['users'] });
    },
    onError: err => toast.error(err.message || 'Failed to update user!')
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
            <p className="text-lg font-semibold">{isEdit ? 'Edit User' : 'Create User'}</p>
            <p className="text-sm text-gray-500">Fill in the user information below.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-4">
            <CustomFilePicker label="Avatar" name="avatar" accept="image/*" formik={formik} />
            <CustomInput label="First Name" name="first_name" formik={formik} />
            <CustomInput label="Last Name" name="last_name" formik={formik} />
            <CustomInput label="Email" name="email" formik={formik} />
            <CustomInput label="Phone" type="number" name="phone" formik={formik} />
            {!isEdit && <CustomInput label="Password" type="password" name="password_hash" formik={formik} />}
            {!isEdit && (
              <CustomInput label="Confirm Password" type="password" name="confirm_password" formik={formik} />
            )}

            <CustomSelect label="Role" name="role_id" formik={formik}>
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </CustomSelect>

            <CustomSelect label="Department" name="department_id" formik={formik}>
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>
                  {dept.department_name}
                </Option>
              ))}
            </CustomSelect>

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
