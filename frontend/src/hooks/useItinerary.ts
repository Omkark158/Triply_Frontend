import { useState, useEffect } from 'react';
import { Destination, Activity, DestinationFormData, ActivityFormData } from '../types/itinerary';
import { itineraryService } from '../services/itinerary';
import toast from 'react-hot-toast';

export const useItinerary = (tripId?: number) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Destination methods
  const fetchDestinations = async (tripIdParam?: number) => {
    try {
      setLoading(true);
      const response = await itineraryService.getAllDestinations(tripIdParam || tripId);
      setDestinations(response.results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch destinations');
    } finally {
      setLoading(false);
    }
  };

  const createDestination = async (data: DestinationFormData) => {
    try {
      const newDestination = await itineraryService.createDestination(data);
      setDestinations([...destinations, newDestination]);
      toast.success('Destination added successfully!');
      return newDestination;
    } catch (err: any) {
      toast.error('Failed to add destination');
      throw err;
    }
  };

  const updateDestination = async (id: number, data: DestinationFormData) => {
    try {
      const updatedDestination = await itineraryService.updateDestination(id, data);
      setDestinations(destinations.map(dest => dest.id === id ? updatedDestination : dest));
      toast.success('Destination updated successfully!');
      return updatedDestination;
    } catch (err: any) {
      toast.error('Failed to update destination');
      throw err;
    }
  };

  const deleteDestination = async (id: number) => {
    try {
      await itineraryService.deleteDestination(id);
      setDestinations(destinations.filter(dest => dest.id !== id));
      toast.success('Destination deleted successfully!');
    } catch (err: any) {
      toast.error('Failed to delete destination');
      throw err;
    }
  };

  // Activity methods
  const fetchActivities = async (destinationId?: number) => {
    try {
      setLoading(true);
      const response = await itineraryService.getAllActivities(destinationId);
      setActivities(response.results);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (data: ActivityFormData) => {
    try {
      const newActivity = await itineraryService.createActivity(data);
      setActivities([...activities, newActivity]);
      toast.success('Activity added successfully!');
      return newActivity;
    } catch (err: any) {
      toast.error('Failed to add activity');
      throw err;
    }
  };

  const updateActivity = async (id: number, data: ActivityFormData) => {
    try {
      const updatedActivity = await itineraryService.updateActivity(id, data);
      setActivities(activities.map(act => act.id === id ? updatedActivity : act));
      toast.success('Activity updated successfully!');
      return updatedActivity;
    } catch (err: any) {
      toast.error('Failed to update activity');
      throw err;
    }
  };

  const toggleActivityComplete = async (id: number, isCompleted: boolean) => {
    try {
      const updatedActivity = await itineraryService.toggleActivityComplete(id, isCompleted);
      setActivities(activities.map(act => act.id === id ? updatedActivity : act));
      toast.success(isCompleted ? 'Activity marked as completed!' : 'Activity marked as incomplete');
      return updatedActivity;
    } catch (err: any) {
      toast.error('Failed to update activity');
      throw err;
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      await itineraryService.deleteActivity(id);
      setActivities(activities.filter(act => act.id !== id));
      toast.success('Activity deleted successfully!');
    } catch (err: any) {
      toast.error('Failed to delete activity');
      throw err;
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchDestinations(tripId);
    }
  }, [tripId]);

  return {
    destinations,
    activities,
    loading,
    error,
    fetchDestinations,
    createDestination,
    updateDestination,
    deleteDestination,
    fetchActivities,
    createActivity,
    updateActivity,
    toggleActivityComplete,
    deleteActivity,
  };
};