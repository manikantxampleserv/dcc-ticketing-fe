/**
 * Service for interacting with categories API
 */
import axiosInstance from 'configs/axios';
import { Category } from 'types/Category';

/**
 * Fetch categories list
 * @param {Object} params - request parameters
 * @param {number} [params.page=1] - page number
 * @param {number} [params.limit=10] - number of records per page
 * @param {string} [params.search] - search query
 * @returns {Promise<Object>} - response data
 */
export const categoriesFn = async (params: { page?: number; limit?: number; search?: string }) => {
  try {
    const response = await axiosInstance.get('/category', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch category by id
 * @param {number} id - category id
 * @returns {Promise<Category>} - response data
 */
export const categoryFn = async (id: number): Promise<Category> => {
  try {
    const response = await axiosInstance.get(`/category/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create category
 * @param {Category} body - category data
 * @returns {Promise<Category>} - response data
 */
export const createCategoryFn = async (body: Category) => {
  try {
    const response = await axiosInstance.post('/category', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update category
 * @param {Category} body - category data
 * @returns {Promise<Category>} - response data
 */
export const updateCategoryFn = async (body: Category) => {
  try {
    const response = await axiosInstance.put(`/category/${body.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete categories
 * @param {Object} data - request data
 * @param {number[]} data.ids - category ids
 * @returns {Promise<Object>} - response data
 */
export const deleteCategoryFn = async (data: { ids: number[] }) => {
  try {
    const response = await axiosInstance.delete(`/category`, { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};
