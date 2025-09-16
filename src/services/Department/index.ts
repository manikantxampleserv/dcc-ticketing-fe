import axiosInstance from 'configs/axios';
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
export const deleteDepartmentFn = async (ids: number[]) => {
  try {
    // Send IDs as query params (safe for most backends)
    const response = await axiosInstance.delete('/department', { params: { ids: ids.join(',') } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
