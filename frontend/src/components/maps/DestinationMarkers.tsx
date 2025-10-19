import React, { useEffect, useState } from 'react';
import { Destination } from '../../context/TripContext';
import { MapPin, AlertCircle } from 'lucide-react';

interface DestinationMarkersProps {
  destinations: Destination[];
  tripId: string;
}

export const DestinationMarkers: React.FC<DestinationMarkersProps> = ({
  destinations,
  tripId,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Filter destinations with coordinates
  const markedDestinations = destinations.filter(d => d.latitude && d.longitude);

  if (markedDestinations.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-900">No Coordinates</h3>
          <p className="text-yellow-800">
            Add latitude and longitude to destinations to display them on the map.
          </p>
        </div>
      </div>
    );
  }

  // Calculate bounds for all markers
  const latitudes = markedDestinations.map(d => parseFloat(d.latitude!.toString()));
  const longitudes = markedDestinations.map(d => parseFloat(d.longitude!.toString()));
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="bg-gray-200 rounded-lg overflow-hidden h-96 relative">
        {/* Placeholder for actual map library (Google Maps, Leaflet, etc.) */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center relative">
          {/* Map would be rendered here using Google Maps API or Leaflet */}
          <div className="text-center">
            <MapPin size={48} className="text-blue-400 mx-auto mb-2" />
            <p className="text-gray-600 font-semibold">Map View</p>
            <p className="text-sm text-gray-500 mt-1">
              Center: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {markedDestinations.length} destination{markedDestinations.length !== 1 ? 's' : ''} displayed
            </p>
          </div>

          {/* Markers Grid (Visual representation) */}
          <div className="absolute inset-0">
            {markedDestinations.map((dest, idx) => {
              // Calculate marker position relative to bounds
              const latRange = maxLat - minLat || 1;
              const lngRange = maxLng - minLng || 1;
              const relLat = (parseFloat(dest.latitude!.toString()) - minLat) / latRange;
              const relLng = (parseFloat(dest.longitude!.toString()) - minLng) / lngRange;
              const x = relLng * 100;
              const y = (1 - relLat) * 100;

              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedMarker(dest.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-full group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  title={dest.name}
                >
                  <div
                    className={`px-2 py-1 rounded text-xs font-bold transition ${
                      selectedMarker === dest.id
                        ? 'bg-red-600 text-white scale-125'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Day {dest.day_number}
                  </div>
                  <div className={`w-3 h-3 mx-auto mt-0.5 transition ${
                    selectedMarker === dest.id ? 'bg-red-600' : 'bg-blue-600'
                  }`}></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Marker Details */}
      {selectedMarker && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          {markedDestinations
            .filter(d => d.id === selectedMarker)
            .map(dest => (
              <div key={dest.id}>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {dest.day_number}
                  </span>
                  {dest.name}
                </h3>
                {dest.address && <p className="text-sm text-gray-700 mb-1">{dest.address}</p>}
                <p className="text-xs text-gray-600">
                  Coordinates: {dest.latitude}, {dest.longitude}
                </p>
                {dest.notes && <p className="text-sm text-gray-700 mt-2">{dest.notes}</p>}
              </div>
            ))}
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Destination Marker</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Selected Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationMarkers;