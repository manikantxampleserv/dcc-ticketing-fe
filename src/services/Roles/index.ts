/**
 * Service for interacting with roles API
 */
import axiosInstance from 'configs/axios';
import { Role } from 'types/Roles';

/**
 * Fetch roles list
 * @param {Object} params - request parameters
 * @param {number} [params.page=1] - page number
 * @param {number} [params.limit=10] - of records per page
 * @param {string} [params.search] - search query
 * @returns {Promise<Object>} - response data
 */
export const rolesFn = async (params: { page?: number; limit?: number; search?: string }) => {
  try {
    const response = await axiosInstance.get('/role', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch role by id
 * @param {number} id - role id
 * @returns {Promise<Role>} - response data
 */
export const roleFn = async (id: number): Promise<Role> => {
  try {
    const response = await axiosInstance.get(`/role/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create role
 * @param {Role} body - role data
 * @returns {Promise<Role>} - response data
 */
export const createRoleFn = async (body: Role) => {
  try {
    const response = await axiosInstance.post('/role', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update role
 * @param {Role} body - role data
 * @returns {Promise<Role>} - response data
 */
export const updateRoleFn = async (body: Role) => {
  try {
    const response = await axiosInstance.put(`/role/${body.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete roles
 * @param {Object} data - request data
 * @param {number[]} data.ids - role ids
 * @returns {Promise<Object>} - response data
 */
export const deleteRoleFn = async (data: { ids: number[] }) => {
  try {
    const response = await axiosInstance.delete(`/role`, { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};
