import axios from 'axios';

// API base URL - в продакшене замените на ваш домен
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления JWT токена к запросам
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface Model {
  uuid: string;
  name: string;
  slug: string;
  description: string;
  price_per_hour?: string;
  price_per_foo?: string;
  price_per_night?: string;
  height?: string;
  weight?: string;
  boobs?: string;
  place?: string;
  number?: string;
  photo_url?: string;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// API methods
export const modelsApi = {
  getAll: (limit = 12, offset = 0) =>
    api.get<Model[]>(`/models/all-model?limit=${limit}&offset=${offset}`),

  getBySlug: (slug: string) =>
    api.get<Model>(`/models/${slug}`),

  create: (formData: FormData) =>
    api.post<Model>('/models/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id: string, data: Partial<Model>) =>
    api.put<Model>(`/models/update-${id}`, data),

  delete: (id: string) =>
    api.delete(`/models/delete-${id}`),
};

export const servicesApi = {
  getAll: () =>
    api.get<Service[]>('/services/all-services'),

  create: (data: { name: string }) =>
    api.post<Service>('/services/add-service', data),
};

export const authApi = {
  login: (data: LoginData) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return api.post<{ access_token: string; token_type: string }>('/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },

  register: (data: RegisterData) =>
    api.post('/register', data),

  getProfile: () =>
    api.get('/user_protected'),

  getAdminProfile: () =>
    api.get('/admin_protected'),
};
