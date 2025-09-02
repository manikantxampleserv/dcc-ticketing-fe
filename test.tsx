import axios from 'axios';

// BASE URL
const API_URL = '/api/tickets';

// Create Ticket
export const createTicketFn = async (data: any) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

// Update Ticket
export const updateTicketFn = async (data: any) => {
  const { id, ...rest } = data;
  const res = await axios.put(`${API_URL}/${id}`, rest);
  return res.data;
};

// Delete Ticket
export const deleteTicketFn = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

// Get All Tickets
export const ticketsFn = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ============================
// Dropdowns
// ============================

// Customers
export const customersFn = async () => {
  const res = await axios.get('/api/customers');
  return res.data;
};

// Agents
export const agentsFn = async () => {
  const res = await axios.get('/api/agents');
  return res.data;
};

// Categories
export const categoriesFn = async () => {
  const res = await axios.get('/api/categories');
  return res.data;
};
