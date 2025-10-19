import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trip } from '../../context/TripContext';
import { MapPin, Calendar, DollarSign, MoreVertical, Globe } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const daysCount = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden relative">
        <div className="w-full h-full flex items-center justify-center text-white/80">
          <MapPin size={48} />
        </div>
        {trip.is_public && (
          <div className="absolute top-3 right-3 bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Globe size={14} />
            Public
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {trip.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin size={16} />
              {trip.destination}
            </p>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-lg transition relative"
          >
            <MoreVertical size={20} className="text-gray-600" />
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => navigate(`/trips/${trip.id}/edit`)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Details
                </button>
              </div>
            )}
          </button>
        </div>

        {/* Trip Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} />
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            <span className="ml-auto text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {daysCount} days
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign size={16} />
            ${trip.budget}
          </div>
        </div>

        {trip.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {trip.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
          >
            View Trip
          </button>
          <button
            onClick={() => navigate(`/trips/${trip.id}/edit`)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;