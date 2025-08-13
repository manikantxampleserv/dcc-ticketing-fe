import axiosInstance from 'configs/axios';

export interface User {
  avatar: string | undefined;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  department: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string;
  active_tickets_count: number;
  resolved_tickets_count: number;
  avg_response_time: string;
  sla_compliance_percent: number;
  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    in_app_notifications: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const loginFn = async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred during login');
  }
};

export const getCurrentUserFn = async (): Promise<{ user: User }> => {
  try {
    const response = await axiosInstance.get<{ user: User }>('auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

export const logoutFn = async (): Promise<void> => {
  try {
    await axiosInstance.post('auth/logout');
  } catch (error) {
    console.warn('Logout request failed:', error);
  }
};

export const refreshTokenFn = async (): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('auth/refresh');
    return response.data;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};
