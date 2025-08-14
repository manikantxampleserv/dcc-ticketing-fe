/**
 * Service for interacting with customers API
 */
import axiosInstance from 'configs/axios';
import { Customer } from 'types/Customers';

/**
 * Fetch customers list
 * @param {Object} params - request parameters
 * @param {number} [params.page=1] - page number
 * @param {number} [params.limit=10] - limit of records per page
 * @param {string} [params.search] - search query
 * @param {string} [params.role] - customer role
 * @returns {Promise<Object>} - response data
 */
export const customersFn = async (params: { page?: number; limit?: number; search?: string; role?: string }) => {
  try {
    const response = await axiosInstance.get('/customers', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch customer by id
 * @param {Customer} params - customer data
 * @returns {Promise<Customer>} - response data
 */
export const customerFn = async (params: Customer): Promise<Customer> => {
  try {
    const response = await axiosInstance.get(`/customers/${params.id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create customer
 * @param {Customer} body - customer data
 * @returns {Promise<Customer>} - response data
 */
export const createCustomerFn = async (body: Customer) => {
  try {
    const response = await axiosInstance.post('/customers', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update customer
 * @param {Customer} body - customer data
 * @returns {Promise<Customer>} - response data
 */
export const updateCustomerFn = async (body: Customer) => {
  try {
    const response = await axiosInstance.put(`/customers/${body.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete customer
 * @param {Object} data - request data
 * @param {number[]} data.ids - customer ids
 * @returns {Promise<Object>} - response data
 */
export const deleteCustomerFn = async (data: { ids: number[] }) => {
  try {
    const response = await axiosInstance.delete(`/customers`, { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};
