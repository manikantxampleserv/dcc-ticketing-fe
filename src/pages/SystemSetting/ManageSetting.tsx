import { Button, Modal, ModalClose, ModalDialog, Sheet } from '@mui/joy';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createSystemSettingFn, updateSystemSettingFn } from 'services/SystemSetting';
import CustomInput from 'shared/CustomInput';
import CustomSelect from 'shared/CustomSelect';
import { Option } from '@mui/joy';

import { SystemSetting } from 'types';

const ManageSystemSetting: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: SystemSetting | null;
  setSelected: (setting: SystemSetting | null) => void;
}> = ({ open, setOpen, selected, setSelected }) => {
  const isEdit = !!selected;
  const client = useQueryClient();

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const { mutate: createSystemSetting, isPending: isCreating } = useMutation({
    mutationFn: createSystemSettingFn,
    onSuccess: response => {
      toast.success(response.message);
      handleClose();
      client.refetchQueries({ queryKey: ['system-settings'] });
    }
  });

  const { mutate: updateSystemSetting, isPending: isUpdating } = useMutation({
    mutationFn: updateSystemSettingFn,
    onSuccess: response => {
      toast.success(response.message);
      handleClose();
      client.refetchQueries({ queryKey: ['system-settings'] });
    }
  });

  const initialValues = {
    key: selected?.setting_key || '',
    value: selected?.setting_value || '',
    type: selected?.data_type || 'string',
    description: selected?.description || ''
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      const payload = {
        setting_key: values.key,
        setting_value: values.value,
        data_type: values.type,
        description: values.description
      };

      if (isEdit) {
        updateSystemSetting({ ...payload, id: selected?.id } as SystemSetting);
      } else {
        createSystemSetting(payload as SystemSetting);
      }
    }
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        size="lg"
        sx={{ padding: '1rem' }}
        component={Sheet}
        className="lg:!w-[50%] !w-[90%] max-h-[80%] overflow-y-auto"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{isEdit ? 'Edit Setting' : 'Create Setting'}</p>
            <p className="text-sm text-gray-500">Manage your system configuration here.</p>
          </div>
          <ModalClose onClick={handleClose} />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4">
            <CustomInput label="Key" name="key" formik={formik} />
            <CustomInput label="Value" name="value" formik={formik} />

            <CustomSelect label="Type" name="type" formik={formik}>
              <Option value="string">String</Option>
              <Option value="number">Number</Option>
              <Option value="boolean">Boolean</Option>
              <Option value="json">JSON</Option>
            </CustomSelect>

            <CustomInput label="Description" name="description" formik={formik} />
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

export default ManageSystemSetting;
