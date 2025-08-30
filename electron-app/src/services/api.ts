import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthRequest, AuthResponse, Student, Analytics, ApiResponse } from '../types';

const BASE_URL = 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: AuthRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }
};

// Students API
export const studentsApi = {
  getAll: async (subject?: string): Promise<ApiResponse<Student[]>> => {
    try {
      const params = subject ? { subject } : {};
      const response: AxiosResponse<ApiResponse<Student[]>> = await apiClient.get('/students', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch students');
    }
  },

  create: async (student: Omit<Student, 'id' | 'created_at'>): Promise<ApiResponse<Student>> => {
    try {
      const response: AxiosResponse<ApiResponse<Student>> = await apiClient.post('/students', student);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create student');
    }
  },

  update: async (id: number, student: Partial<Omit<Student, 'id' | 'created_at'>>): Promise<ApiResponse<Student>> => {
    try {
      const response: AxiosResponse<ApiResponse<Student>> = await apiClient.put(`/students/${id}`, student);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update student');
    }
  },

  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await apiClient.delete(`/students/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete student');
    }
  }
};

// Analytics API
export const analyticsApi = {
  get: async (): Promise<ApiResponse<Analytics>> => {
    try {
      const response: AxiosResponse<ApiResponse<Analytics>> = await apiClient.get('/analytics');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch analytics');
    }
  }
};
