import { create } from 'zustand';
import { modelsApi, servicesApi, type Model, type Service } from '@/lib/api';

interface ModelsState {
  models: Model[];
  services: Service[];
  currentModel: Model | null;
  isLoading: boolean;
  currentPage: number;
  limit: number;
  searchQuery: string;
  selectedServices: number[];
  selectedPlace: string;

  // Actions
  fetchModels: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchModelBySlug: (slug: string) => Promise<void>;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedServices: (services: number[]) => void;
  setSelectedPlace: (place: string) => void;
  resetFilters: () => void;
}

export const useModelsStore = create<ModelsState>((set, get) => ({
  models: [],
  services: [],
  currentModel: null,
  isLoading: false,
  currentPage: 0,
  limit: 12,
  searchQuery: '',
  selectedServices: [],
  selectedPlace: '',

  fetchModels: async () => {
    const { currentPage, limit } = get();
    set({ isLoading: true });

    try {
      const offset = currentPage * limit;
      const response = await modelsApi.getAll(limit, offset);
      set({ models: response.data });
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchServices: async () => {
    try {
      const response = await servicesApi.getAll();
      set({ services: response.data });
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  },

  fetchModelBySlug: async (slug: string) => {
    set({ isLoading: true });

    try {
      const response = await modelsApi.getBySlug(slug);
      set({ currentModel: response.data });
    } catch (error) {
      console.error('Failed to fetch model:', error);
      set({ currentModel: null });
    } finally {
      set({ isLoading: false });
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchModels();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 0 });
    // TODO: Реализовать фильтрацию на стороне API
  },

  setSelectedServices: (services: number[]) => {
    set({ selectedServices: services, currentPage: 0 });
    // TODO: Реализовать фильтрацию на стороне API
  },

  setSelectedPlace: (place: string) => {
    set({ selectedPlace: place, currentPage: 0 });
    // TODO: Реализовать фильтрацию на стороне API
  },

  resetFilters: () => {
    set({
      searchQuery: '',
      selectedServices: [],
      selectedPlace: '',
      currentPage: 0
    });
    get().fetchModels();
  },
}));
