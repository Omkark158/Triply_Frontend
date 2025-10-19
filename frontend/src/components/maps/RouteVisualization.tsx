import React, { useState } from 'react';
import { Destination } from '../../context/TripContext';
import { Navigation, AlertCircle } from 'lucide-react';

interface RouteVisualizationProps {
  destinations: Destination[];
  tripId: string;
}

export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  destinations,
  tripId,
}) => {
  const [routeStats, setRouteStats] = useState({
    totalDistance: '0 km',
    estimatedDuration: '0 hrs',
  });

  // Filter destinations with coordinates
  const markedDestinations = destinations.filter(d => d.latitude && d.longitude);

  if (markedDestinations.length < 2) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-900">Insufficient Destinations</h3>
          <p className="text-yellow-800">
            Add at least 2 destinations with coordinates to visualize a route.
          </p>
        </div>
      </div>
    );
  }

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate total route distance
  let totalDistance = 0;
  for (let i = 0; i < markedDestinations.length - 1; i++) {
    const d1 = markedDestinations[i];
    const d2 = markedDestinations[i + 1];
    const distance = calculateDistance(
      parseFloat(d1.latitude!.toString()),
      parseFloat(d1.longitude!.toString()),
      parseFloat(d2.latitude!.toString()),
      parseFloat(d2.longitude!.toString())
    );
    totalDistance += distance;
  }

  const estimatedHours = (totalDistance / 50).toFixed(1); // Assume avg 50km/hr

  return (
    <div className="space-y-4">
      {/* Route Map Visualization */}
      <div className="bg-gray-200 rounded-lg overflow-hidden h-96 relative">
        {/* Placeholder for actual map with route */}
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-50 flex items-center justify-center relative">
          <div className="text-center">
            <Navigation size={48} className="text-green-600 mx-auto mb-2 transform -rotate-45" />
            <p className="text-gray-600 font-semibold">Route Map</p>
            <p className="text-sm text-gray-500 mt-1">
              {markedDestinations.length} stops
            </p>
          </div>

          {/* Simple route line visualization */}
          <svg className="absolute inset-0 w-full h-full">
            {markedDestinations.map((dest, idx) => {
              const latRange = Math.max(...markedDestinations.map(d => parseFloat(d.latitude!.toString()))) -
                Math.min(...markedDestinations.map(d => parseFloat(d.latitude!.toString()))) || 1;
              const lngRange = Math.max(...markedDestinations.map(d => parseFloat(d.longitude!.toString()))) -
                Math.min(...markedDestinations.map(d => parseFloat(d.longitude!.toString()))) || 1;
              const minLat = Math.min(...markedDestinations.map(d => parseFloat(d.latitude!.toString())));
              const minLng = Math.min(...markedDestinations.map(d => parseFloat(d.longitude!.toString())));

              const x = ((parseFloat(dest.longitude!.toString()) - minLng) / lngRange) * 100;
              const y = ((1 - (parseFloat(dest.latitude!.toString()) - minLat) / latRange)) * 100;

              return (
                <g key={dest.id}>
                  {idx < markedDestinations.length - 1 && (
                    <line
                      x1={`${x}%`}
                      y1={`${y}%`}
                      x2={`${((parseFloat(markedDestinations[idx + 1].longitude!.toString()) - minLng) / lngRange) * 100}%`}
                      y2={`${((1 - (parseFloat(markedDestinations[idx + 1].latitude!.toString()) - minLat) / latRange)) * 100}%`}
                      stroke="#059669"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  )}
                  <circle cx={`${x}%`} cy={`${y}%`} r="6" fill="#059669" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Route Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Distance</p>
          <p className="text-2xl font-bold text-green-600">{totalDistance.toFixed(1)} km</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Estimated Travel Time</p>
          <p className="text-2xl font-bold text-blue-600">{estimatedHours} hrs</p>
        </div>
      </div>

      {/* Route Breakdown */}
      <div className="bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 p-4 border-b">Route Breakdown</h3>
        <div className="p-4">
          {markedDestinations.map((dest, idx) => (
            <div key={dest.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-gray-900">{dest.name}</span>
                </div>
              </div>
              {idx < markedDestinations.length - 1 && (
                <div className="ml-9 text-sm text-gray-600 pb-3 border-l-2 border-gray-300">
                  <p>
                    → {calculateDistance(
                      parseFloat(dest.latitude!.toString()),
                      parseFloat(dest.longitude!.toString()),
                      parseFloat(markedDestinations[idx + 1].latitude!.toString()),
                      parseFloat(markedDestinations[idx + 1].longitude!.toString())
                    ).toFixed(1)} km to {markedDestinations[idx + 1].name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;