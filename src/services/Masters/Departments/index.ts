/**
 * Service for interacting with departments API
 */
import axiosInstance from 'configs/axios';
import { Department } from 'types/Departments';
import { DeleteRequestData, RequestParams } from 'types/index';
import withToast from 'utils/withToast';

/**
 * Fetch departments list
 * @param {RequestParams} params - request parameters
 * @returns {Promise<Object>} - response data
 */
export const departmentsFn = async (params: RequestParams) => {
  try {
    const response = await axiosInstance.get('/departments', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch department by id
 * @param {Department} params - department data
 * @returns {Promise<Department>} - response data
 */
export const departmentFn = async (params: Department): Promise<Department> => {
  try {
    const response = await axiosInstance.get(`/departments/${params.id}`);
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
    const response = await withToast(() => axiosInstance.post('/departments', body));
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
    const response = await withToast(() => axiosInstance.put(`/departments/${body.id}`, body));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete department
 * @param {DeleteRequestData} data - request data
 * @param {number[]} data.ids - department ids
 * @returns {Promise<Object>} - response data
 */
export const deleteDepartmentFn = async (data: DeleteRequestData) => {
  try {
    const response = await withToast(() => axiosInstance.delete(`/departments`, { data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};
