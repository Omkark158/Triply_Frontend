import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTrip, Trip } from '../../context/TripContext';
import TripSummary from './TripSummary';
import QuickActions from './QuickActions';
import { AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { trips, loading, fetchAllTrips } = useTrip();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    ongoingTrips: 0,
    completedTrips: 0,
  });

  useEffect(() => {
    console.log('[Dashboard] Mounting, trips already loaded by TripContext');
    if (trips.length === 0 && !loading) {
      console.log('[Dashboard] No trips found, fetching...');
      fetchAllTrips();
    }
  }, []);

  useEffect(() => {
    console.log('[Dashboard] Trips updated:', trips);
    calculateStats();
  }, [trips]);

  const calculateStats = () => {
    const now = new Date();
    let upcoming = 0;
    let ongoing = 0;
    let completed = 0;

    trips.forEach(trip => {
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);

      if (startDate > now) {
        upcoming++;
      } else if (endDate < now) {
        completed++;
      } else {
        ongoing++;
      }
    });

    setStats({
      totalTrips: trips.length,
      upcomingTrips: upcoming,
      ongoingTrips: ongoing,
      completedTrips: completed,
    });
  };

  const getDisplayName = () => {
    if (!user) return 'Guest';

    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) {
      return user.first_name;
    }
    return user.email?.split('@')[0] || 'Traveler';
  };

  if (loading && trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {getDisplayName()}!
        </h1>
        <p className="text-blue-100">Plan, track, and enjoy your trips</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm mb-1">Total Trips</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTrips}</p>
          <p className="text-xs text-gray-500 mt-2">All your trips</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-gray-900">{stats.upcomingTrips}</p>
          <p className="text-xs text-gray-500 mt-2">Coming soon</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
          <p className="text-gray-600 text-sm mb-1">Ongoing</p>
          <p className="text-3xl font-bold text-gray-900">{stats.ongoingTrips}</p>
          <p className="text-xs text-gray-500 mt-2">In progress</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-gray-900">{stats.completedTrips}</p>
          <p className="text-xs text-gray-500 mt-2">Finished</p>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Summary */}
          <div className="lg:col-span-3"> {/* Adjusted to span full width */}
            <TripSummary trips={trips} />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Trips Yet</h2>
          <p className="text-gray-600 mb-6">Create your first trip to get started with planning!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;