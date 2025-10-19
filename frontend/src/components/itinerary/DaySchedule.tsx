import React, { useState, useEffect } from 'react';
import { Destination, Activity } from '../../context/TripContext';
import { useTrip } from '../../context/TripContext';
import ActivityCard from './ActivityCard';
import AddActivity from './AddActivity';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface DayScheduleProps {
  dayNumber: number;
  destinations: Destination[];
  tripId: string;
  onRefresh: () => void;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({
  dayNumber,
  destinations,
  tripId,
  onRefresh,
}) => {
  const { getActivities } = useTrip();
  const [expanded, setExpanded] = useState(true);
  const [activitiesByDestination, setActivitiesByDestination] = useState<
    Record<string, Activity[]>
  >({});
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState<string | null>(null);

  useEffect(() => {
    if (expanded && destinations.length > 0) {
      loadActivities();
    }
  }, [expanded, destinations]);

  const loadActivities = async () => {
    try {
      setLoadingActivities(true);
      const activitiesMap: Record<string, Activity[]> = {};

      for (const destination of destinations) {
        const activities = await getActivities(destination.id);
        activitiesMap[destination.id] = activities.sort((a, b) => {
          if (!a.start_time || !b.start_time) return 0;
          return a.start_time.localeCompare(b.start_time);
        });
      }

      setActivitiesByDestination(activitiesMap);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleActivityAdded = () => {
    setShowAddActivity(null);
    loadActivities();
  };

  const totalActivities = Object.values(activitiesByDestination).reduce(
    (sum, acts) => sum + acts.length,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Day Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between hover:from-blue-700 hover:to-blue-600 transition"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg font-bold text-lg">Day {dayNumber}</div>
          <div>
            <p className="text-left font-semibold">
              {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-blue-100">
              {totalActivities} activity{totalActivities !== 1 ? 'ies' : ''}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>

      {/* Day Content */}
      {expanded && (
        <div className="p-6 space-y-6">
          {destinations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No destinations for this day</p>
          ) : (
            destinations.map(destination => (
              <div key={destination.id} className="border-l-4 border-blue-600 pl-4">
                {/* Destination Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                  {destination.address && (
                    <p className="text-sm text-gray-600">📍 {destination.address}</p>
                  )}
                  {destination.notes && (
                    <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                      {destination.notes}
                    </p>
                  )}
                </div>

                {/* Activities List */}
                <div className="space-y-3 mb-4">
                  {loadingActivities ? (
                    <p className="text-gray-500 text-sm">Loading activities...</p>
                  ) : (activitiesByDestination[destination.id]?.length || 0) === 0 ? (
                    <p className="text-gray-500 text-sm">No activities scheduled</p>
                  ) : (
                    activitiesByDestination[destination.id]?.map(activity => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onActivityUpdated={handleActivityAdded}
                      />
                    ))
                  )}
                </div>

                {/* Add Activity */}
                {showAddActivity === destination.id ? (
                  <AddActivity
                    destinationId={destination.id}
                    onActivityAdded={handleActivityAdded}
                  />
                ) : (
                  <button
                    onClick={() => setShowAddActivity(destination.id)}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition font-semibold text-sm"
                  >
                    <Plus size={16} />
                    Add Activity
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DaySchedule;
