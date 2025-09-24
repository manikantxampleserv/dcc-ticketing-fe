/**
 * Service for interacting with tickets API
 */
import axiosInstance from 'configs/axios';
import { Ticket, TicketComment } from 'types/Tickets';
import withToast from 'utils/withToast';

/**
 * Fetch tickets list
 * @param {Object} params - request parameters
 * @param {number} [params.page=1] - page number
 * @param {number} [params.limit=10] - number of records per page
 * @param {string} [params.search] - search query
 * @returns {Promise<Object>} - response data
 */
export const ticketsFn = async (params: { page?: number; limit?: number; search?: string }) => {
  try {
    const response = await axiosInstance.get('/ticket', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch ticket by id
 * @param {number} id - ticket id
 * @returns {Promise<Ticket>} - response data
 */
export const ticketFn = async (id: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/ticket/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create ticket
 * @param {Ticket} body - ticket data
 * @returns {Promise<Ticket>} - response data
 */
export const createTicketFn = async (body: Ticket) => {
  try {
    const response = await axiosInstance.post('/ticket', body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createCommentFn = async (body: any) => {
  try {
    const response = await withToast(() => axiosInstance.post('/ticket-comment', body));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update ticket
 * @param {Ticket} body - ticket data
 * @returns {Promise<Ticket>} - response data
 */
export const updateTicketFn = async (id: number, body: Ticket) => {
  try {
    const response = await axiosInstance.put(`/ticket/${body.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete tickets
 * @param {Object} data - request data
 * @param {number[]} data.ids - ticket ids
 * @returns {Promise<Object>} - response data
 */
export const deleteTicketFn = async (data: { ids: number[] }) => {
  try {
    const response = await axiosInstance.delete(`/ticket`, { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};
