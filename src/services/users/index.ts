import axiosInstance from 'configs/axios';
import { User } from 'types/index';

export const usersFn = async (params: { page?: number; limit?: number; search?: string; role_id?: string }) => {
  try {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userFn = async (params: User) => {
  try {
    const response = await axiosInstance.get(`/users/${params.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUserFn = async (body: User) => {
  const reqBody = new FormData();
  reqBody.append('first_name', body.first_name);
  reqBody.append('last_name', body.last_name);
  reqBody.append('email', body.email);
  reqBody.append('password_hash', body.password_hash);
  reqBody.append('role_id', body.role_id);
  reqBody.append('department_id', body?.department_id || '');
  reqBody.append('is_active', body.is_active ? 'true' : 'false');
  reqBody.append('avatar', body.avatar || '');
  reqBody.append('phone', body.phone || '');
  try {
    const response = await axiosInstance.post('/users', reqBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserFn = async (body: User) => {
  const reqBody = new FormData();
  if (body.avatar) {
    reqBody.append('avatar', body.avatar);
  }
  reqBody.append('id', body.id);
  reqBody.append('first_name', body.first_name);
  reqBody.append('last_name', body.last_name);
  reqBody.append('email', body.email);
  reqBody.append('password_hash', body.password_hash);
  reqBody.append('role_id', body.role_id);
  reqBody.append('department_id', body?.department_id || '');
  reqBody.append('is_active', body.is_active ? 'true' : 'false');
  reqBody.append('phone', body.phone || '');
  try {
    const response = await axiosInstance.put(`/users/${body.id}`, reqBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserFn = async (data: { ids: number[] }) => {
  try {
    const response = await axiosInstance.delete(`/users`, { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};
