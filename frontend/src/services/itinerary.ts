import api from './api';
import { Destination, Activity, DestinationFormData, ActivityFormData } from '../types/itinerary';
import { ApiResponse } from '../types/common';

export const itineraryService = {
  // Destinations
  getAllDestinations: async (tripId?: number): Promise<ApiResponse<Destination>> => {
    const url = tripId ? `/itineraries/destinations/?trip=${tripId}` : '/itineraries/destinations/';
    const response = await api.get<ApiResponse<Destination>>(url);
    return response.data;
  },

  getDestinationById: async (id: number): Promise<Destination> => {
    const response = await api.get<Destination>(`/itineraries/destinations/${id}/`);
    return response.data;
  },

  createDestination: async (data: DestinationFormData): Promise<Destination> => {
    const response = await api.post<Destination>('/itineraries/destinations/', data);
    return response.data;
  },

  updateDestination: async (id: number, data: DestinationFormData): Promise<Destination> => {
    const response = await api.put<Destination>(`/itineraries/destinations/${id}/`, data);
    return response.data;
  },

  deleteDestination: async (id: number): Promise<void> => {
    await api.delete(`/itineraries/destinations/${id}/`);
  },

  // Activities
  getAllActivities: async (destinationId?: number): Promise<ApiResponse<Activity>> => {
    const url = destinationId ? `/itineraries/activities/?destination=${destinationId}` : '/itineraries/activities/';
    const response = await api.get<ApiResponse<Activity>>(url);
    return response.data;
  },

  getActivityById: async (id: number): Promise<Activity> => {
    const response = await api.get<Activity>(`/itineraries/activities/${id}/`);
    return response.data;
  },

  createActivity: async (data: ActivityFormData): Promise<Activity> => {
    const response = await api.post<Activity>('/itineraries/activities/', data);
    return response.data;
  },

  updateActivity: async (id: number, data: ActivityFormData): Promise<Activity> => {
    const response = await api.put<Activity>(`/itineraries/activities/${id}/`, data);
    return response.data;
  },

  toggleActivityComplete: async (id: number, isCompleted: boolean): Promise<Activity> => {
    const response = await api.patch<Activity>(`/itineraries/activities/${id}/`, {
      is_completed: isCompleted,
    });
    return response.data;
  },

  deleteActivity: async (id: number): Promise<void> => {
    await api.delete(`/itineraries/activities/${id}/`);
  },
};