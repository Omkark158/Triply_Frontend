import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import api from '../services/api';
import { useNotification } from './NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: 'USD' | 'INR';
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user: string;
}

export interface TripCollaborator {
  id: string;
  trip: string;
  user: string;
  role: 'owner' | 'editor' | 'viewer';
  added_at: string;
  user_details?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface TripInvitation {
  id: string;
  trip: string;
  inviter: string;
  invitee_email: string;
  role: 'owner' | 'editor' | 'viewer';
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  created_at: string;
  expires_at: string;
  is_expired: boolean;
}

export interface Destination {
  id: string;
  trip: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  day_number: number;
  notes?: string;
  created_at: string;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  destination: string;
  title: string;
  description?: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'relaxation' | 'shopping' | 'entertainment' | 'transport' | 'other';
  start_time?: string;
  end_time?: string;
  estimated_cost: number;
  booking_url?: string;
  is_completed: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  trip: string;
  expense_type: 'personal' | 'group';
  title: string;
  description?: string;
  amount: number;
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping' | 'entertainment' | 'emergency' | 'other';
  date: string;
  paid_by: string;
  split_between: string[];
  receipt_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  total_budget: string;
  total_spent: string;
  remaining: string;
  percentage_used: number;
  expenses_by_category: {
    [key: string]: number;
  };
  currency?: 'USD' | 'INR';
  id?: string;
  trip?: string;
  updated_at?: string;
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  error: Error | null;
  fetchAllTrips: () => Promise<void>;
  fetchTripById: (tripId: string) => Promise<void>;
  createTrip: (tripData: Partial<Trip>) => Promise<Trip>;
  updateTrip: (tripId: string, tripData: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  getCollaborators: (tripId: string) => Promise<TripCollaborator[]>;
  inviteCollaborator: (tripId: string, email: string, role: string, message?: string) => Promise<TripInvitation>;
  getInvitations: (tripId: string) => Promise<TripInvitation[]>;
  respondToInvitation: (invitationId: string, action: 'accept' | 'decline') => Promise<void>;
  removeCollaborator: (collaboratorId: string) => Promise<void>;
  updateCollaboratorRole: (collaboratorId: string, role: string) => Promise<void>;
  getDestinations: (tripId: string) => Promise<Destination[]>;
  createDestination: (tripId: string, destData: Partial<Destination>) => Promise<Destination>;
  updateDestination: (destId: string, destData: Partial<Destination>) => Promise<Destination>;
  deleteDestination: (destId: string) => Promise<void>;
  getActivities: (destinationId: string) => Promise<Activity[]>;
  createActivity: (destinationId: string, actData: Partial<Activity>) => Promise<Activity>;
  updateActivity: (actId: string, actData: Partial<Activity>) => Promise<Activity>;
  deleteActivity: (actId: string) => Promise<void>;
  getExpenses: (tripId: string) => Promise<Expense[]>;
  createExpense: (tripId: string, expData: Partial<Expense>) => Promise<Expense>;
  updateExpense: (expId: string, expData: Partial<Expense>) => Promise<Expense>;
  deleteExpense: (expId: string) => Promise<void>;
  getBudget: (tripId: string) => Promise<Budget>;
  updateBudget: (tripId: string, currency: 'USD' | 'INR', totalBudget: number) => Promise<Budget>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotification();
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

  const fetchAllTrips = async () => {
    if (!checkAuth()) return;
    try {
      setLoading(true);
      setError(null);
      authService.debugTokens();
      const response = await api.get('/api/v1/trips/');
      setTrips(response.data.results || response.data);
      console.log('Fetched trips:', response.data.results || response.data);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to fetch trips';
      setError(err);
      console.error('Fetch trips error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTripById = async (tripId: string) => {
    if (!checkAuth()) return;
    try {
      setLoading(true);
      setError(null);
      authService.debugTokens();
      const response = await api.get(`/api/v1/trips/${tripId}/`);
      setCurrentTrip(response.data);
      console.log('Fetched trip:', response.data);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to fetch trip';
      setError(err);
      console.error('Fetch trip by ID error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Partial<Trip>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      setLoading(true);
      authService.debugTokens();
      const response = await api.post('/api/v1/trips/', tripData);
      const newTrip = response.data;
      setTrips(prev => [newTrip, ...prev]);
      addNotification({ type: 'success', message: 'Trip created successfully! 🎉' });
      console.log('Created trip:', newTrip);
      return newTrip;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to create trip';
      setError(err);
      console.error('Create trip error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (tripId: string, tripData: Partial<Trip>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      setLoading(true);
      authService.debugTokens();
      const response = await api.put(`/api/v1/trips/${tripId}/`, tripData);
      const updatedTrip = response.data;
      setTrips(prev => prev.map(trip => (trip.id === tripId ? updatedTrip : trip)));
      if (currentTrip?.id === tripId) setCurrentTrip(updatedTrip);
      addNotification({ type: 'success', message: 'Trip updated successfully!' });
      console.log('Updated trip:', updatedTrip);
      return updatedTrip;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to update trip';
      setError(err);
      console.error('Update trip error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      setLoading(true);
      authService.debugTokens();
      await api.delete(`/api/v1/trips/${tripId}/`);
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      if (currentTrip?.id === tripId) setCurrentTrip(null);
      addNotification({ type: 'success', message: 'Trip deleted successfully' });
      console.log('Deleted trip:', tripId);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to delete trip';
      setError(err);
      console.error('Delete trip error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCollaborators = async (tripId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.get(`/api/v1/collaboration/collaborators/?trip=${tripId}`);
      return response.data.results || response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to fetch collaborators';
      console.error('Get collaborators error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const inviteCollaborator = async (tripId: string, email: string, role: string, message?: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.post('/api/v1/collaboration/invitations/', {
        trip: tripId,
        invitee_email: email,
        role,
        message,
      });
      addNotification({ type: 'success', message: `Invitation sent to ${email}` });
      console.log('Invited collaborator:', email);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : err.response?.data?.detail || 'Failed to send invitation';
      console.error('Invite collaborator error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const getInvitations = async (tripId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.get(`/api/v1/collaboration/invitations/?trip=${tripId}`);
      return response.data.results || response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to fetch invitations';
      console.error('Get invitations error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const respondToInvitation = async (invitationId: string, action: 'accept' | 'decline') => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      await api.post(`/api/v1/collaboration/invitations/${invitationId}/respond/`, { action });
      addNotification({ type: 'success', message: `Invitation ${action}ed successfully` });
      console.log(`Responded to invitation ${invitationId}: ${action}`);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : `Failed to ${action} invitation`;
      console.error('Respond to invitation error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      await api.delete(`/api/v1/collaboration/collaborators/${collaboratorId}/`);
      addNotification({ type: 'success', message: 'Collaborator removed' });
      console.log('Removed collaborator:', collaboratorId);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to remove collaborator';
      console.error('Remove collaborator error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const updateCollaboratorRole = async (collaboratorId: string, role: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      await api.patch(`/api/v1/collaboration/collaborators/${collaboratorId}/`, { role });
      addNotification({ type: 'success', message: 'Role updated successfully' });
      console.log('Updated collaborator role:', collaboratorId, role);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to update role';
      console.error('Update collaborator role error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const getDestinations = async (tripId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.get(`/api/v1/itineraries/destinations/?trip=${tripId}`);
      return response.data.results || response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to fetch destinations';
      console.error('Get destinations error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const createDestination = async (tripId: string, destData: Partial<Destination>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.post('/api/v1/itineraries/destinations/', {
        trip: tripId,
        ...destData,
      });
      addNotification({ type: 'success', message: 'Destination added!' });
      console.log('Created destination:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to add destination';
      console.error('Create destination error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const updateDestination = async (destId: string, destData: Partial<Destination>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.put(`/api/v1/itineraries/destinations/${destId}/`, destData);
      addNotification({ type: 'success', message: 'Destination updated' });
      console.log('Updated destination:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to update destination';
      console.error('Update destination error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const deleteDestination = async (destId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      await api.delete(`/api/v1/itineraries/destinations/${destId}/`);
      addNotification({ type: 'success', message: 'Destination deleted' });
      console.log('Deleted destination:', destId);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to delete destination';
      console.error('Delete destination error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const getActivities = async (destinationId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.get(`/api/v1/itineraries/activities/?destination=${destinationId}`);
      return response.data.results || response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to fetch activities';
      console.error('Get activities error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const createActivity = async (destinationId: string, actData: Partial<Activity>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.post('/api/v1/itineraries/activities/', {
        destination: destinationId,
        ...actData,
      });
      addNotification({ type: 'success', message: 'Activity added!' });
      console.log('Created activity:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to add activity';
      console.error('Create activity error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const updateActivity = async (actId: string, actData: Partial<Activity>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.put(`/api/v1/itineraries/activities/${actId}/`, actData);
      addNotification({ type: 'success', message: 'Activity updated' });
      console.log('Updated activity:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to update activity';
      console.error('Update activity error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const deleteActivity = async (actId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      await api.delete(`/api/v1/itineraries/activities/${actId}/`);
      addNotification({ type: 'success', message: 'Activity deleted' });
      console.log('Deleted activity:', actId);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to delete activity';
      console.error('Delete activity error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const getExpenses = async (tripId: string) => {
    if (!checkAuth()) throw new Error('Not authenticated');
    try {
      authService.debugTokens();
      const response = await api.get(`/api/v1/budgets/expenses/?trip=${tripId}`); // Corrected endpoint
      return response.data.results || response.data;
    } catch (err: any) {
      console.error('Get expenses error:', err);
      if (err.response?.status === 404) return [];
      throw err;
    }
  };

  const createExpense = async (tripId: string, expData: Partial<Expense>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.post('/api/v1/budgets/expenses/', {
        trip: tripId,
        ...expData,
      });
      addNotification({ type: 'success', message: 'Expense added!' });
      console.log('Created expense:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to add expense';
      console.error('Create expense error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const updateExpense = async (expId: string, expData: Partial<Expense>) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.put(`/api/v1/budgets/expenses/${expId}/`, expData);
      addNotification({ type: 'success', message: 'Expense updated' });
      console.log('Updated expense:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to update expense';
      console.error('Update expense error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const deleteExpense = async (expId: string) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      await api.delete(`/api/v1/budgets/expenses/${expId}/`);
      addNotification({ type: 'success', message: 'Expense deleted' });
      console.log('Deleted expense:', expId);
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to delete expense';
      console.error('Delete expense error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  const getBudget = async (tripId: string): Promise<Budget> => {
    if (!checkAuth()) throw new Error('Not authenticated');
    try {
      authService.debugTokens();
      const response = await api.get<Budget>(`/api/v1/budgets/summary/${tripId}/`);
      console.log('Budget API response:', response.data); // Debug log
      return response.data;
    } catch (err: any) {
      console.error('Get budget error:', err);
      if (err.response?.status === 404) {
        return {
          total_budget: '0',
          total_spent: '0',
          remaining: '0',
          percentage_used: 0,
          expenses_by_category: {},
          currency: 'USD',
        };
      }
      throw err;
    }
  };

  const updateBudget = async (tripId: string, currency: 'USD' | 'INR', totalBudget: number) => {
    if (!checkAuth()) {
      throw new Error('Not authenticated');
    }
    try {
      authService.debugTokens();
      const response = await api.put(`/api/v1/budgets/budget/${tripId}/`, {
        currency,
        total_budget: totalBudget,
      });
      addNotification({ type: 'success', message: 'Budget updated!' });
      console.log('Updated budget:', response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.message === 'Cannot connect to the server. Please check if the backend is running.'
        ? 'Server is unreachable. Please ensure the backend is running.'
        : 'Failed to update budget';
      console.error('Update budget error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        addNotification({ type: 'error', message: 'Session expired. Please log in again.' });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      } else {
        addNotification({ type: 'error', message: errorMsg });
      }
      throw err;
    }
  };

  useEffect(() => {
    authService.debugTokens();
    if (checkAuth()) {
      fetchAllTrips();
    }
  }, [isAuthenticated]);

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        loading,
        error,
        fetchAllTrips,
        fetchTripById,
        createTrip,
        updateTrip,
        deleteTrip,
        getCollaborators,
        inviteCollaborator,
        getInvitations,
        respondToInvitation,
        removeCollaborator,
        updateCollaboratorRole,
        getDestinations,
        createDestination,
        updateDestination,
        deleteDestination,
        getActivities,
        createActivity,
        updateActivity,
        deleteActivity,
        getExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
        getBudget,
        updateBudget,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return context;
};