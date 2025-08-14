import axiosInstance from 'configs/axios';
import withToast from 'utils/withToast';
import { User } from 'types/index';

/**
 * Service for authentication
 *
 * Provides functions for login, logout, get current user and refresh token
 */

export interface LoginCredentials {
  /**
   * Email for login
   */
  email: string;
  /**
   * Password for login
   */
  password: string;
}

export interface AuthResponse {
  /**
   * User details
   */
  user: User;
  /**
   * Auth token
   */
  token: string;
  /**
   * Message
   */
  message: string;
}

/**
 * Login user
 *
 * @param {LoginCredentials} credentials - Login credentials
 * @returns {Promise<AuthResponse>} - Auth response
 */
export const loginFn = async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await withToast(() => axiosInstance.post<AuthResponse>('auth/login', { email, password }));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user
 *
 * @returns {Promise<{ user: User }>} - User details
 */
export const getCurrentUserFn = async (): Promise<{ user: User }> => {
  try {
    const response = await axiosInstance.get<{ user: User }>('auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 *
 * @returns {Promise<void>} - Logout response
 */
export const logoutFn = async (): Promise<void> => {
  try {
    await axiosInstance.post('auth/logout');
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh token
 *
 * @returns {Promise<AuthResponse>} - Auth response
 */
export const refreshTokenFn = async (): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('auth/refresh');
    return response.data;
  } catch (error) {
    throw error;
  }
};
