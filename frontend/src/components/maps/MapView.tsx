import React, { useEffect, useState } from 'react';
import { useTrip, Destination } from '../../context/TripContext';
import { Map, Download, AlertCircle, Loader } from 'lucide-react';
import DestinationMarkers from './DestinationMarkers';
import RouteVisualization from './RouteVisualization';

interface MapViewProps {
  tripId?: string;
}

export const MapView: React.FC<MapViewProps> = ({ tripId }) => {
  const { currentTrip, getDestinations } = useTrip();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState<'markers' | 'route'>('markers');
  const [downloadingMap, setDownloadingMap] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMap = async () => {
    try {
      setDownloadingMap(true);
      // TODO: Implement offline map download using a library like leaflet-offline
      console.log('Downloading map for offline access...');
      // This would typically use IndexedDB or similar to store map tiles
    } catch (error) {
      console.error('Error downloading map:', error);
    } finally {
      setDownloadingMap(false);
    }
  };

  if (!actualTripId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-900">No Trip Selected</h3>
          <p className="text-yellow-800">Please select a trip to view its map.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-3">
        <Map className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-blue-900">No Destinations Yet</h3>
          <p className="text-blue-800">Add destinations to your itinerary to see them on the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Map size={28} />
            Trip Map
          </h1>
          <button
            onClick={handleDownloadMap}
            disabled={downloadingMap}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold disabled:opacity-50"
          >
            <Download size={18} />
            {downloadingMap ? 'Downloading...' : 'Download for Offline'}
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMapType('markers')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mapType === 'markers'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Destinations
          </button>
          <button
            onClick={() => setMapType('route')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mapType === 'route'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Route
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-6">
        {mapType === 'markers' ? (
          <DestinationMarkers destinations={destinations} tripId={actualTripId} />
        ) : (
          <RouteVisualization destinations={destinations} tripId={actualTripId} />
        )}
      </div>

      {/* Destinations List */}
      <div className="border-t p-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Destinations ({destinations.length})</h2>
        <div className="space-y-3">
          {destinations.map(dest => (
            <div key={dest.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {dest.day_number}
                    </span>
                    <h3 className="font-semibold text-gray-900">{dest.name}</h3>
                  </div>
                  {dest.address && (
                    <p className="text-sm text-gray-600 ml-8">{dest.address}</p>
                  )}
                  {dest.latitude && dest.longitude && (
                    <p className="text-xs text-gray-500 ml-8">
                      📍 {dest.latitude}, {dest.longitude}
                    </p>
                  )}
                </div>
              </div>
              {dest.notes && (
                <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                  {dest.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;