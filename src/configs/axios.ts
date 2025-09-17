import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Base URL for API requests.
 * @type {string}
 */
const baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://10.160.5.101:6000/api/v1/';

/**
 * Creates and configures an Axios instance with baseURL and request/response interceptors.
 * @param {string} baseURL - The base URL for API requests.
 * @returns {import("axios").AxiosInstance} - The configured Axios instance.
 */
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      const Authorization = 'Bearer ' + localStorage.getItem('auth_token');
      config.headers.set('Authorization', Authorization);
      return config;
    },

    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Axios instance with baseURL set and request/response interceptors configured.
 * @type {import("axios").AxiosInstance}
 */
const axiosInstance: AxiosInstance = createAxiosInstance(baseURL);

export default axiosInstance;
