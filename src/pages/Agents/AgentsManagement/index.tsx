// ManageAgents.tsx
import { Button, Modal, ModalClose, ModalDialog, Option, Sheet } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createAgentFn, updateAgentFn } from 'services/Agents';
import { rolesFn } from 'services/Roles';
import { departmentsFn } from 'services/Department';
import { usersFn } from 'services/users';
import CustomFilePicker from 'shared/CustomFilePicker';
import CustomInput from 'shared/CustomInput';
import CustomRadioInput from 'shared/CustomRadioInput';
import CustomSelect from 'shared/CustomSelect';
import { Agent } from 'types';

interface ManageAgentsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: Agent | null;
  setSelected: (agent: Agent | null) => void;
}

const ManageAgents: React.FC<ManageAgentsProps> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  // Fetch data for selects
  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: () => usersFn({ page: 1, limit: 1000 }) });
  const { data: rolesData } = useQuery({ queryKey: ['roles'], queryFn: () => rolesFn({}) });
  const { data: departmentsData } = useQuery({ queryKey: ['departments'], queryFn: () => departmentsFn() });

  const users = usersData?.data || [];
  const roles = rolesData?.data || [];
  const departments = departmentsData?.data || [];

  // Mutations
  const { mutate: createAgent, isPending: isCreating } = useMutation({
    mutationFn: createAgentFn,
    onSuccess: res => {
      toast.success(res.message);
      handleClose();
      client.refetchQueries({ queryKey: ['agents'] });
    }
  });

  const { mutate: updateAgent, isPending: isUpdating } = useMutation({
    mutationFn: updateAgentFn,
    onSuccess: res => {
      toast.success(res.message);
      handleClose();
      client.refetchQueries({ queryKey: ['agents'] });
    }
  });

  // Form initial values
  const initialValues = {
    first_name: selected?.first_name || '',
    last_name: selected?.last_name || '',
    email: selected?.email || '',
    phone: selected?.phone || '',
    user_id: selected?.user_id || '',
    role_id: selected?.role_id || '',
    department_id: selected?.department_id || '',
    hire_date: selected?.hire_date ? selected.hire_date.split('T')[0] : '',
    is_active: selected?.is_active?.toString() || 'true',
    avatar: selected?.avatar || ''
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      // Convert hire_date to full ISO timestamp for backend
      const payload = {
        ...values,
        hire_date: values.hire_date ? new Date(values.hire_date).toISOString() : null
      };

      if (isEdit) updateAgent({ ...payload, id: selected?.id } as unknown as Agent);
      else createAgent(payload as any);
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
            <p className="text-lg font-semibold">{isEdit ? 'Edit Agent' : 'Create Agent'}</p>
            <p className="text-sm text-gray-500">Fill in the information of the agent.</p>
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
            <CustomInput label="Hire Date" type="date" name="hire_date" formik={formik} />

            <CustomSelect label="User" name="user_id" formik={formik}>
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.email}
                </Option>
              ))}
            </CustomSelect>

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
            <Button disabled={isEdit ? isUpdating : isCreating} color="primary" type="submit">
              {isEdit ? (isUpdating ? 'Updating...' : 'Update') : isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default ManageAgents;
