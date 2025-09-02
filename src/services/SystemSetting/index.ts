import axiosInstance from 'configs/axios';
import { SystemSetting } from 'types';

export const systemSettingsFn = async (params: { page?: number; limit?: number; search?: string }) => {
  try {
    const response = await axiosInstance.get('/system-setting', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const systemSettingFn = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/system-setting/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSystemSettingFn = async (body: SystemSetting) => {
  // Debug: log the body to see what's being passed
  console.log('Input body:', body);

  // Map the properties correctly - handle both naming conventions
  const reqBody = {
    setting_key: body.setting_key || (body as any).key,
    setting_value: body.setting_value || (body as any).value || '',
    description: body.description || '',
    data_type: body.data_type || (body as any).type || 'String'
  };

  // Debug: log the request body
  console.log('Request body being sent:', reqBody);

  try {
    const response = await axiosInstance.post('/system-setting', reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const updateSystemSettingFn = async (body: SystemSetting) => {
  // Map the properties correctly - handle both naming conventions
  const reqBody = {
    id: body.id,
    setting_key: body.setting_key || (body as any).key,
    setting_value: body.setting_value || (body as any).value || '',
    description: body.description || '',
    data_type: body.data_type || (body as any).type || 'String'
  };

  try {
    const response = await axiosInstance.put(`/system-setting/${body.id}`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSystemSettingFn = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/system-setting/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSystemSettingFormDataFn = async (body: SystemSetting) => {
  const reqBody = new FormData();
  reqBody.append('setting_key', body.setting_key);
  reqBody.append('setting_value', body.setting_value || '');
  reqBody.append('description', body.description || '');
  reqBody.append('data_type', body.data_type || 'String');

  try {
    const response = await axiosInstance.post('/system-setting', reqBody, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSystemSettingFormDataFn = async (body: SystemSetting) => {
  const reqBody = new FormData();
  reqBody.append('id', String(body.id));
  reqBody.append('setting_key', body.setting_key);
  reqBody.append('setting_value', body.setting_value || '');
  reqBody.append('description', body.description || '');
  reqBody.append('data_type', body.data_type || 'String');

  try {
    const response = await axiosInstance.put(`/system-setting/${body.id}`, reqBody, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
