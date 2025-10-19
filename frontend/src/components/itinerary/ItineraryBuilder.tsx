import React, { useEffect, useState } from 'react';
import { useTrip, Destination } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import AddDestination from './AddDestination';
import DaySchedule from './DaySchedule';
import { Plus, Loader, AlertCircle } from 'lucide-react';

interface ItineraryBuilderProps {
  tripId?: string;
}

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ tripId }) => {
  const { currentTrip, getDestinations } = useTrip();
  const { addNotification } = useNotification();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDestination, setShowAddDestination] = useState(false);

  const actualTripId = tripId || currentTrip?.id;

  useEffect(() => {
    if (actualTripId) {
      fetchDestinations();
    }
  }, [actualTripId]);

  const fetchDestinations = async () => {
    if (!actualTripId) return;
    try {
      setLoading(true);
      const data = await getDestinations(actualTripId);
      setDestinations(data.sort((a, b) => a.day_number - b.day_number));
    } catch (error) {
      console.error('Error fetching destinations:', error);
      addNotification({ type: 'error', message: 'Failed to load itinerary' });
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationAdded = () => {
    setShowAddDestination(false);
    fetchDestinations();
  };

  if (!actualTripId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-900">No Trip Selected</h3>
          <p className="text-yellow-800">Please select a trip to build an itinerary.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  const tripDays = currentTrip
    ? Math.ceil(
        (new Date(currentTrip.end_date).getTime() - new Date(currentTrip.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Itinerary</h1>
            <p className="text-gray-600">
              {tripDays} days | {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowAddDestination(!showAddDestination)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={20} />
            Add Destination
          </button>
        </div>

        {showAddDestination && (
          <AddDestination tripId={actualTripId} onDestinationAdded={handleDestinationAdded} />
        )}
      </div>

      {/* Days Timeline */}
      {destinations.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-900 font-semibold mb-2">No Destinations Added Yet</p>
          <p className="text-blue-800 text-sm">Start planning by adding your first destination!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: tripDays }).map((_, dayIndex) => {
            const dayDestinations = destinations.filter(d => d.day_number === dayIndex + 1);
            return (
              <DaySchedule
                key={dayIndex}
                dayNumber={dayIndex + 1}
                destinations={dayDestinations}
                tripId={actualTripId}
                onRefresh={fetchDestinations}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;