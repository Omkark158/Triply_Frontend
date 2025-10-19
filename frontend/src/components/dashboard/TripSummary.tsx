import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { Trip } from '../../context/TripContext';

interface TripSummaryProps {
  trips: Trip[];
}

export const TripSummary: React.FC<TripSummaryProps> = ({ trips }) => {
  const navigate = useNavigate();

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Trips</h2>
        <p className="text-gray-500 text-center py-8">No trips to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Recent Trips</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {trips.slice(0, 5).map((trip) => (
          <div
            key={trip.id}
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="p-6 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {trip.title}
                </h3>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-blue-600" />
                    <span>{trip.destination}</span>
                  </div>
                  
                  {trip.start_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-blue-600" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString()}
                        {trip.end_date && (
                          <> - {new Date(trip.end_date).toLocaleDateString()}</>
                        )}
                      </span>
                    </div>
                  )}
                  
                  {trip.budget && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign size={16} className="text-blue-600" />
                      <span>${trip.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  View Details
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripSummary;