import axiosInstance from 'configs/axios';
import toast from 'react-hot-toast';
import { Agent } from 'types/Agent';

/**
 * Fetch agents list with optional pagination and filters
 */
export const agentsFn = async (params?: { page?: number; limit?: number; search?: string; role_id?: string }) => {
  try {
    const response = await axiosInstance.get('/agents', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch agent by id
 */
export const agentFn = async (id: number): Promise<Agent> => {
  try {
    const response = await axiosInstance.get(`/agents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create agent
 */
export const createAgentFn = async (body: Omit<Agent, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const response = await axiosInstance.post('/agents', body);
    toast.success('Agent created successfully');
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to create agent');
    throw error;
  }
};

/**
 * Update agent
 */
export const updateAgentFn = async (body: Agent) => {
  try {
    const response = await axiosInstance.put(`/agents/${body.id}`, body);
    toast.success('Agent updated successfully');
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to update agent');
    throw error;
  }
};

/**
 * Delete agents (single or multiple)
 */
// services/Agents.ts
export const deleteAgentFn = async ({ ids }: { ids: number[] }) => {
  try {
    if (ids.length >= 1) {
      // Delete first agent only (single delete)
      const response = await axiosInstance.delete(`/agents/${ids[0]}`);
      toast.success('Agent deleted successfully');
      return response.data;
    } else {
      toast.error('Please select an agent to delete.');
      throw new Error('Please select an agent to delete.');
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Failed to delete agent');
    throw error;
  }
};
