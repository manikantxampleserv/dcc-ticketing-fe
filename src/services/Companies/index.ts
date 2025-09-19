/**
 * Service for interacting with companies API
 */
import axiosInstance from 'configs/axios';
import toast from 'react-hot-toast';
import { Company } from 'types/Companies';

/**
 * Fetch companies list
 */
export const companiesFn = async (params: { page?: number; limit?: number; search?: string }) => {
  try {
    const response = await axiosInstance.get('/company', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch single company
 */
export const companyFn = async (id: number): Promise<Company> => {
  try {
    const response = await axiosInstance.get(`/company/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create company
 */
export const createCompanyFn = async (body: Company) => {
  try {
    const response = await axiosInstance.post('/company', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update company
 */
export const updateCompanyFn = async (body: Company) => {
  try {
    const response = await axiosInstance.put(`/company/${body.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete companies
 */
// export const deleteCompanyFn = async (data: { ids: number[] }) => {
//   try {
//     const response = await axiosInstance.delete(`/company`, { data });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const deleteCompanyFn = async (data: { ids: number[] }) => {
  try {
    if (data.ids.length >= 1) {
      const response = await axiosInstance.delete(`/company/${data.ids[0]}`);
      return response.data;
    } else {
      toast.error('Please delete companies one by one.');
      throw new Error('Please delete companies one by one.');
    }
  } catch (error) {
    throw error;
  }
};
