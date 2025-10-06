// services/CCTicket.ts
import axios from 'axios';
import axiosInstance from 'configs/axios';
import withToast from 'utils/withToast';

export interface AddCcParams {
  ticket_id: number;
  user_id: number;
}

export const addCcToTicket = async (params: AddCcParams) => {
  const { ticket_id, user_id } = params;

  try {
    const response = await withToast(() =>
      axiosInstance.put(`/ticket-cc-add/${ticket_id}`, {
        user_id
      })
    );
    return response.data;
  } catch (error: any) {
    console.error('Error adding CC:', error.response?.data || error.message);
    throw error;
  }
};
