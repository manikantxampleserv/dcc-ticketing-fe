import { Button, Modal, ModalClose, ModalDialog, Option, Sheet } from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { createCustomerFn, updateCustomerFn } from 'services/Customers';
import { companiesFn } from 'services/Companies';
import CustomInput from 'shared/CustomInput';
import CustomRadioInput from 'shared/CustomRadioInput';
import CustomSelect from 'shared/CustomSelect';
import { Customer } from 'types/Customers';
import { boolean } from 'yup';

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

  // ✅ Fetch companies list
  const { data: companiesData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesFn({})
  });

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
    company_id: selected?.company_id || '',
    first_name: selected?.first_name || '',
    last_name: selected?.last_name || '',
    email: selected?.email || '',
    phone: selected?.phone || '',
    job_title: selected?.job_title || '',
    is_active: selected?.is_active || 'true',
    created_at: selected?.created_at || ''
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: values => {
      const processedValues = {
        ...values,
        is_active: Boolean(values.is_active === 'true' || values.is_active === true)
      };

      if (isEdit) {
        updateCustomer({ ...processedValues, id: selected?.id } as Customer);
      } else {
        createCustomer(processedValues as Customer);
      }
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
            <p className="text-lg font-semibold">{isEdit ? 'Edit Customer' : 'Create Customer'}</p>
            <p className="text-sm text-gray-500">Fill in the information of the user.</p>
          </div>
          <ModalClose onClick={() => setOpen(false)} />
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Company Select from API */}
            <CustomSelect label="Company" name="company_id" formik={formik}>
              {isCompaniesLoading ? (
                <Option value="">Loading...</Option>
              ) : (
                companiesData?.data?.map((company: any) => (
                  <Option key={company.id} value={company.id}>
                    {company.company_name}
                  </Option>
                ))
              )}
            </CustomSelect>

            <CustomInput label="First Name" name="first_name" formik={formik} />
            <CustomInput label="Last Name" name="last_name" formik={formik} />
            <CustomInput label="Email" name="email" formik={formik} />
            <CustomInput type="number" label="Phone" name="phone" formik={formik} />
            <CustomInput label="Job Title" name="job_title" formik={formik} />

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

            {/* Created At - only show when editing */}
            {isEdit && <CustomInput label="Created At" name="created_at" formik={formik} disabled />}
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
