import api from './api';
import { Trip, TripFormData, CreateTripData, UpdateTripData } from '../types/trip';

// Helper type for API responses
interface ApiResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export const tripService = {
  // Get all trips
  getAll: async (): Promise<ApiResponse<Trip>> => {
    try {
      const response = await api.get<ApiResponse<Trip>>('/api/v1/trips/');
      return response.data;
    } catch (error: any) {
      console.error('Get all trips error:', error.response?.data || error.message);
      throw error;
    }
  },

  getTrips: async (): Promise<Trip[]> => {
    try {
      const response = await api.get('/api/v1/trips/');
      return response.data.results || response.data;
    } catch (error: any) {
      console.error('Get trips error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get single trip by ID (accepts both string and number)
  getById: async (id: string | number): Promise<Trip> => {
    try {
      const response = await api.get<Trip>(`/api/v1/trips/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error('Get trip by ID error:', error.response?.data || error.message);
      throw error;
    }
  },

  getTripById: async (tripId: string | number): Promise<Trip> => {
    try {
      const response = await api.get(`/api/v1/trips/${tripId}/`);
      return response.data;
    } catch (error: any) {
      console.error('Get trip by ID error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create new trip
  create: async (data: TripFormData | CreateTripData): Promise<Trip> => {
    try {
      const response = await api.post<Trip>('/api/v1/trips/', data);
      return response.data;
    } catch (error: any) {
      console.error('Create trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  createTrip: async (tripData: TripFormData | CreateTripData): Promise<Trip> => {
    try {
      const response = await api.post('/api/v1/trips/', tripData);
      return response.data;
    } catch (error: any) {
      console.error('Create trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update existing trip (accepts both string and number ID)
  update: async (id: string | number, data: TripFormData | Partial<UpdateTripData>): Promise<Trip> => {
    try {
      const response = await api.put<Trip>(`/api/v1/trips/${id}/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateTrip: async (tripId: string | number, tripData: Partial<TripFormData | UpdateTripData>): Promise<Trip> => {
    try {
      const response = await api.put(`/api/v1/trips/${tripId}/`, tripData);
      return response.data;
    } catch (error: any) {
      console.error('Update trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Partial update (accepts both string and number ID)
  partialUpdate: async (id: string | number, data: Partial<TripFormData>): Promise<Trip> => {
    try {
      const response = await api.patch<Trip>(`/api/v1/trips/${id}/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Partial update trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  patchTrip: async (tripId: string | number, tripData: Partial<TripFormData>): Promise<Trip> => {
    try {
      const response = await api.patch(`/api/v1/trips/${tripId}/`, tripData);
      return response.data;
    } catch (error: any) {
      console.error('Patch trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete trip (accepts both string and number ID)
  delete: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/api/v1/trips/${id}/`);
    } catch (error: any) {
      console.error('Delete trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteTrip: async (tripId: string | number): Promise<void> => {
    try {
      await api.delete(`/api/v1/trips/${tripId}/`);
    } catch (error: any) {
      console.error('Delete trip error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get upcoming trips
  getUpcoming: async (): Promise<Trip[]> => {
    try {
      const response = await api.get<Trip[]>('/api/v1/trips/upcoming/');
      return response.data;
    } catch (error: any) {
      console.error('Get upcoming trips error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get past trips
  getPast: async (): Promise<Trip[]> => {
    try {
      const response = await api.get<Trip[]>('/api/v1/trips/past/');
      return response.data;
    } catch (error: any) {
      console.error('Get past trips error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search trips
  search: async (query: string): Promise<ApiResponse<Trip>> => {
    try {
      const response = await api.get<ApiResponse<Trip>>(`/api/v1/trips/?search=${query}`);
      return response.data;
    } catch (error: any) {
      console.error('Search trips error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Export both as default and named export for compatibility
export const tripsService = tripService;
export default tripService;