import axiosInstance from 'configs/axios';
import { Ticket } from 'types';

// Get all tickets (paginated)
export const ticketsFn = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ data: Ticket[]; total: number; page: number; limit: number }> => {
  try {
    const response = await axiosInstance.get('/ticket', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single ticket
export const ticketFn = async (id: number): Promise<Ticket> => {
  try {
    const response = await axiosInstance.get(`/ticket/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create ticket
export const createTicketFn = async (
  body: Omit<Ticket, 'id' | 'ticket_number' | 'created_at' | 'updated_at'>
): Promise<Ticket> => {
  try {
    const response = await axiosInstance.post('/ticket', body, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update ticket
export const updateTicketFn = async (body: Partial<Ticket> & { id: string }): Promise<Ticket> => {
  try {
    const response = await axiosInstance.put(`/ticket/${body.id}`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete ticket
export const deleteTicketFn = async (id: number): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.delete(`/ticket/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const customersFn = async () => {
  try {
    const response = await axiosInstance.get('/customers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const agentsFn = async () => {
  try {
    const response = await axiosInstance.get('/agents');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const categoriesFn = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};
