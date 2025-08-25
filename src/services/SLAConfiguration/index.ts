import axiosInstance from 'configs/axios';

export const slaFn = async () => {
  const { data } = await axiosInstance.get('/SLA');
  return data;
};

export const upsertSLAFn = async (payload: any) => {
  const { data } = await axiosInstance.post('/SLA', payload);
  return data;
};

export const deleteSLAFn = async (id: number) => {
  const { data } = await axiosInstance.delete(`/SLA/${id}`);
  return data;
};
