import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@constants';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() ?? 'GET';
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    if (import.meta.env.DEV) {
      console.info(`[API Request] ${method} ${url}`, {
        params: config.params,
        hasBody: Boolean(config.data),
      });
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.info('[API Response]', {
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong while talking to the payment service.';

    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        status,
        message,
      });
    }

    return Promise.reject({
      status,
      message,
      originalError: error,
    });
  },
);
