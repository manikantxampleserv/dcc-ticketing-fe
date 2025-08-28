/**
 * Service for interacting with departments API
 */
import axiosInstance from 'configs/axios';
import { Department } from 'types/Departments';

/**
 * Fetch departments list
 * @param {Object} params - request parameters
 * @param {number} [params.page=1] - page number
 * @param {number} [params.limit=10] - number of records per page
 * @param {string} [params.search] - search query
 * @returns {Promise<Object>} - response data
 */
export const departmentsFn = async (params: { page?: number; limit?: number; search?: string }) => {
  try {
    const response = await axiosInstance.get('/department', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch department by id
 * @param {number} id - department id
 * @returns {Promise<Department>} - response data
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
 * @param {Department} body - department data
 * @returns {Promise<Department>} - response data
 */
export const createDepartmentFn = async (body: Department) => {
  try {
    const response = await axiosInstance.post('/department', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update department
 * @param {Department} body - department data
 * @returns {Promise<Department>} - response data
 */
export const updateDepartmentFn = async (body: Department) => {
  try {
    const response = await axiosInstance.put(`/department/${body.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete departments
 * @param {Object} data - request data
 * @param {number[]} data.ids - department ids
 * @returns {Promise<Object>} - response data
 */
export const deleteDepartmentFn = async (data: { ids: number[] }) => {
  try {
    const response = await axiosInstance.delete(`/department`, { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};
