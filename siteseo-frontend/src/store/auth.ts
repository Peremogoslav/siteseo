import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, type LoginData, type RegisterData } from '@/lib/api';

interface User {
  username: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (data: LoginData) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(data);
          const { access_token } = response.data;

          // Сохраняем токен в localStorage для API interceptor
          localStorage.setItem('access_token', access_token);

          set({
            token: access_token,
            user: { username: data.username }
          });

          // Проверяем права администратора
          try {
            await authApi.getAdminProfile();
            set({ user: { username: data.username, isAdmin: true } });
          } catch {
            // Пользователь не админ, это нормально
          }
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await authApi.register(data);
          // После регистрации можно сразу залогинить пользователя
          await get().login({ username: data.username, password: data.password });
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
          const response = await authApi.getProfile();
          const username = response.data['Привет!'];

          let isAdmin = false;
          try {
            await authApi.getAdminProfile();
            isAdmin = true;
          } catch {
            // Не админ
          }

          set({
            token,
            user: { username, isAdmin }
          });
        } catch {
          localStorage.removeItem('access_token');
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      }),
    }
  )
);
