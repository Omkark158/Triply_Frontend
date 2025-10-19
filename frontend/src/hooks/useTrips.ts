import { useState, useEffect } from 'react';
import { Trip, TripFormData } from '../types/trip';
import { tripsService } from '../services/trips';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { authService } from '../services/auth';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const checkAuth = () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken || !isAuthenticated) {
      console.log('No access token or not authenticated, redirecting to /login');
      navigate('/login');
      return false;
    }
    return true;
  };

  const fetchTrips = async () => {
    if (!checkAuth()) return;
    try {
      setLoading(true);
      authService.debugTokens();
      const response = await tripsService.getAll();
      setTrips(response.results);
      setError(null);
      console.log('Fetched trips:', response.results);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to fetch trips';
      setError(errorMsg);
      console.error('Fetch trips error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (data: TripFormData) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const newTrip = await tripsService.create(data);
      setTrips([newTrip, ...trips]);
      toast.success('Trip created successfully!');
      console.log('Created trip:', newTrip);
      return newTrip;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to create trip';
      console.error('Create trip error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
      throw err;
    }
  };

  const updateTrip = async (id: number, data: TripFormData) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const updatedTrip = await tripsService.update(id, data);
      setTrips(trips.map(trip => (trip.id === id ? updatedTrip : trip)));
      toast.success('Trip updated successfully!');
      console.log('Updated trip:', updatedTrip);
      return updatedTrip;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to update trip';
      console.error('Update trip error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
      throw err;
    }
  };

  const deleteTrip = async (id: number) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      await tripsService.delete(id);
      setTrips(trips.filter(trip => trip.id !== id));
      toast.success('Trip deleted successfully!');
      console.log('Deleted trip:', id);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to delete trip';
      console.error('Delete trip error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
      throw err;
    }
  };

  const getUpcomingTrips = async () => {
    if (!checkAuth()) return;
    try {
      setLoading(true);
      authService.debugTokens();
      const upcomingTrips = await tripsService.getUpcoming();
      setTrips(upcomingTrips);
      setError(null);
      console.log('Fetched upcoming trips:', upcomingTrips);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to fetch upcoming trips';
      setError(errorMsg);
      console.error('Fetch upcoming trips error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPastTrips = async () => {
    if (!checkAuth()) return;
    try {
      setLoading(true);
      authService.debugTokens();
      const pastTrips = await tripsService.getPast();
      setTrips(pastTrips);
      setError(null);
      console.log('Fetched past trips:', pastTrips);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to fetch past trips';
      setError(errorMsg);
      console.error('Fetch past trips error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchTrips = async (query: string) => {
    if (!checkAuth()) return;
    try {
      setLoading(true);
      authService.debugTokens();
      const response = await tripsService.search(query);
      setTrips(response.results);
      setError(null);
      console.log('Searched trips:', response.results);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to search trips';
      setError(errorMsg);
      console.error('Search trips error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authService.debugTokens();
    if (checkAuth()) {
      fetchTrips();
    }
  }, [isAuthenticated]);

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    getUpcomingTrips,
    getPastTrips,
    searchTrips,
  };
};