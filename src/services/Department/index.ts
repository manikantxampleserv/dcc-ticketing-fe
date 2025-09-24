import axiosInstance from 'configs/axios';
import toast from 'react-hot-toast';
import { Department } from 'types/Departments';

/**
 * Fetch departments list
 */
export const departmentsFn = async (params?: { page?: number; limit?: number; search?: string }) => {
  try {
    const response = await axiosInstance.get('/department', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch department by id
 */
export const departmentFn = async (id: number): Promise<Department> => {
  try {
    const response = await axiosInstance.get(`/department/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create department
 */
export const createDepartmentFn = async (body: Omit<Department, 'id'>) => {
  try {
    const response = await axiosInstance.post('/department', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update department
 */
export const updateDepartmentFn = async (body: { id: number; department_name: string; is_active: boolean }) => {
  try {
    const response = await axiosInstance.put(`/department/${body.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete departments
 */
export const deleteDepartmentsFn = async (id: number) => {
  try {
    if (id) {
      const response = await axiosInstance.delete('/department', {
        data: { id }
      });
      return response.data;
    } else {
      toast.error('Invalid department id');
      throw new Error('Invalid department id');
    }
  } catch (error) {
    throw error;
  }
};
