/**
 * Service for interacting with tickets API
 */
import axiosInstance from 'configs/axios';
import { Ticket, TicketAttachment, TicketComment } from 'types/Tickets';
import withToast from 'utils/withToast';

/**
 * Fetch tickets list
 * @param {Object} params - request parameters
 * @param {number} [params.page=1] - page number
 * @param {number} [params.limit=10] - number of records per page
 * @param {string} [params.search] - search query
 * @returns {Promise<Object>} - response data
 */
export const ticketsFn = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; // <-- optional banaya
  priority?: string; // <-- optional banaya
}) => {
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
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ticketAttachmentFn = async (id: number): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`/ticket-attachment/${id}`);

    if (response.status === 200 && response.data) {
      // Extract ticket_attachments array
      return response.data.data?.ticket_attachments || [];
    }

    throw new Error(response.data?.message || 'Failed to fetch ticket attachments');
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || 'Something went wrong while fetching attachments');
  }
};
/**
 * Create ticket
 * @param {Ticket} body - ticket data
 * @returns {Promise<Ticket>} - response data
 */
export const createTicketFn = async (body: Partial<Ticket>) => {
  try {
    const response = await withToast(() => axiosInstance.post('/ticket', body));
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createTicketAttachmentFn = async (body: Partial<TicketAttachment>) => {
  const formData = new FormData();
  formData.append('ticket_id', String(body.ticket_id));
  formData.append('file_name', String(body.file_name));
  formData.append('file_path', body?.file_path);
  formData.append('is_public', body?.is_public);
  try {
    const response = await withToast(() => axiosInstance.post('/ticket-attachment', formData));
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
export const updateTicketFn = async (body: Partial<Ticket>) => {
  try {
    const { id, ...datas } = body;
    const response = await withToast(() => axiosInstance.put(`/ticket/${id}`, { ...datas }));
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateTicketActionFn = async (body: Partial<Ticket>) => {
  try {
    const { id, ...datas } = body;
    const response = await withToast(() => axiosInstance.put(`/ticket-action/${id}`, { ...datas }));
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const mergeTicketFn = async (body: Partial<Ticket>) => {
  try {
    const { id, ...datas } = body;
    const response = await withToast(() => axiosInstance.put(`/ticket-merge/${id}`, { ...datas }));
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
    const response = await withToast(() => axiosInstance.delete(`/ticket`, { data }));
    return response.data;
  } catch (error) {
    throw error;
  }
};
