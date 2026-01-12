import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return the response as-is (data will be accessed by hooks)
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: unknown[] }>) => {
    // Handle errors consistently
    const message = error.response?.data?.message || 'Terjadi kesalahan, silakan coba lagi';
    
    // Show error toast
    toast.error(message);
    
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message,
        errors: error.response?.data?.errors,
      });
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor (for future auth token)
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
