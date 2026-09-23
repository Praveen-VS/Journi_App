import axios from 'axios';

/**
 * Journi Axios Base API Client
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach authentication token when available
api.interceptors.request.use(
  (config) => {
    // TODO: Attach auth header when auth feature is implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global response handling & error formatting
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: Handle 401 Unauthorized / Token refresh flows
    return Promise.reject(error);
  }
);

export default api;
