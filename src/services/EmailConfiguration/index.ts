import axiosInstance from 'configs/axios';
import { EmailConfiguration } from 'types';

// export const emailConfigurationFn = async ({
//   page,
//   limit,
//   search
// }: {
//   page: number;
//   limit: number;
//   search?: string;
// }) => {
//   const res = await axiosInstance.get('/email-configuration', {
//     params: { page, limit, search }
//   });
//   return res.data;
// };

// services/EmailConfiguration/index.ts
export const emailConfigurationFn = async ({
  page,
  limit,
  search
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const res = await axiosInstance.get('/email-configuration', {
    params: { page, limit, search }
  });
  return res.data;
};

export const createEmailConfigurationFn = async (payload: Partial<EmailConfiguration>) => {
  const res = await axiosInstance.post('/email-configuration', payload);
  return res.data;
};

export const updateEmailConfigurationFn = async ({
  id,
  payload
}: {
  id: number;
  payload: Partial<EmailConfiguration>;
}) => {
  const res = await axiosInstance.put(`/email-configuration/${id}`, payload);
  return res.data;
};
export const upsertEmailConfigurationFn = async (payload: Partial<EmailConfiguration>) => {
  const res = await axiosInstance.post('/email-configuration/upsert', payload);
  return res.data;
};

export const deleteEmailConfigurationFn = async (id: number) => {
  const res = await axiosInstance.delete(`/email-configuration/${id}`);
  return res.data;
};
