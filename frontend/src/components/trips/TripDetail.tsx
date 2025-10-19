import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTrip } from '../../context/TripContext';
import { MapPin, Calendar, DollarSign, FileText, AlertCircle, Globe, Clock } from 'lucide-react';

interface TripDetailProps {
  tripId?: string;
}

export const TripDetail: React.FC<TripDetailProps> = ({ tripId: propTripId }) => {
  const { tripId: paramTripId } = useParams<{ tripId: string }>();
  const { currentTrip, fetchTripById, loading } = useTrip();
  
  const tripId = propTripId || paramTripId;

  useEffect(() => {
    if (tripId) {
      fetchTripById(tripId);
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-900">Trip Not Found</h3>
          <p className="text-yellow-800">The trip you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(currentTrip.start_date);
  const endDate = new Date(currentTrip.end_date);
  const daysCount = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const costPerDay = (parseFloat(currentTrip.budget.toString()) / daysCount).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with Cover */}
      <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-white/80">
          <MapPin size={64} />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        {currentTrip.is_public && (
          <div className="absolute top-6 right-6 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
            <Globe size={16} />
            Public
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Destination */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentTrip.title}</h1>
          <p className="text-xl text-gray-600 flex items-center gap-2">
            <MapPin className="text-blue-600" size={24} />
            {currentTrip.destination}
          </p>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Duration */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Duration
            </p>
            <p className="text-2xl font-bold text-gray-900">{daysCount}</p>
            <p className="text-sm text-gray-600">
              {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
            </p>
          </div>

          {/* Budget */}
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" />
              Total Budget
            </p>
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(currentTrip.budget.toString()).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              ${costPerDay} per day
            </p>
          </div>

          {/* Created */}
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-purple-600" />
              Created
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {new Date(currentTrip.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Updated {new Date(currentTrip.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Description */}
        {currentTrip.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Trip</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {currentTrip.description}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900">Active</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Visibility</p>
              <p className="font-semibold text-gray-900">
                {currentTrip.is_public ? 'Public' : 'Private'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Per Day</p>
              <p className="font-semibold text-gray-900">${costPerDay}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="font-semibold text-gray-900">{daysCount} days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;