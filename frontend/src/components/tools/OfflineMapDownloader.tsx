import React, { useState } from 'react';
import { Download, MapPin, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { mapsService } from '../../services/maps';

interface DownloadedMap {
  id: string;
  name: string;
  location: string;
  zoom: number;
  imageUrl: string;
  downloadedAt: string;
  size: string;
}

interface OfflineMapDownloaderProps {
  destinations?: Array<{ name: string; latitude?: string; longitude?: string }>;
}

const OfflineMapDownloader: React.FC<OfflineMapDownloaderProps> = ({ destinations = [] }) => {
  const [downloadedMaps, setDownloadedMaps] = useState<DownloadedMap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Custom download inputs
  const [customLocation, setCustomLocation] = useState('');
  const [zoomLevel, setZoomLevel] = useState(13);

  // Load saved maps from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('offline_maps');
    if (saved) {
      try {
        setDownloadedMaps(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved maps:', e);
      }
    }
  }, []);

  // Save maps to localStorage
  React.useEffect(() => {
    if (downloadedMaps.length > 0) {
      localStorage.setItem('offline_maps', JSON.stringify(downloadedMaps));
    }
  }, [downloadedMaps]);

  const downloadMap = async (location: string, lat?: string, lng?: string, zoom: number = 13) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let coordinates = { lat: 0, lng: 0 };

      // If coordinates provided, use them
      if (lat && lng) {
        coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
      } else {
        // Otherwise, geocode the location
        const geocoded = await mapsService.geocodeAddress(location);
        if (!geocoded) {
          throw new Error('Could not find location');
        }
        coordinates = geocoded;
      }

      // Get static map URL
      const imageUrl = mapsService.getStaticMapUrl(coordinates, zoom);

      // Download the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);

      // Calculate size
      const sizeKB = Math.round(blob.size / 1024);

      // Create map entry
      const newMap: DownloadedMap = {
        id: Date.now().toString(),
        name: location,
        location: `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
        zoom,
        imageUrl: base64 as string,
        downloadedAt: new Date().toISOString(),
        size: `${sizeKB} KB`,
      };

      setDownloadedMaps([...downloadedMaps, newMap]);
      setSuccess(`Map for "${location}" downloaded successfully!`);
      setCustomLocation('');
    } catch (err: any) {
      setError(err.message || 'Failed to download map');
    } finally {
      setLoading(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const deleteMap = (id: string) => {
    setDownloadedMaps(downloadedMaps.filter(map => map.id !== id));
    setSuccess('Map deleted');
  };

  const clearAllMaps = () => {
    if (window.confirm('Delete all downloaded maps?')) {
      setDownloadedMaps([]);
      localStorage.removeItem('offline_maps');
      setSuccess('All maps cleared');
    }
  };

  const downloadMapAsImage = (map: DownloadedMap) => {
    const link = document.createElement('a');
    link.href = map.imageUrl;
    link.download = `${map.name.replace(/\s+/g, '_')}_map.png`;
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Offline Map Downloader</h2>
        <p className="text-gray-600">Download maps for offline use during your trip</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* Download from Destinations */}
      {destinations.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin size={20} />
            Download from Trip Destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {destinations.map((dest, index) => (
              <button
                key={index}
                onClick={() => downloadMap(dest.name, dest.latitude, dest.longitude, zoomLevel)}
                disabled={loading}
                className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
              >
                <span className="font-medium">{dest.name}</span>
                <Download size={18} className="text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Location Download */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Download Custom Location</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location (City, Address, or Landmark)
            </label>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="e.g., Eiffel Tower, Paris"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zoom Level: {zoomLevel}
            </label>
            <input
              type="range"
              min="10"
              max="18"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Far (City view)</span>
              <span>Close (Street view)</span>
            </div>
          </div>

          <button
            onClick={() => downloadMap(customLocation, undefined, undefined, zoomLevel)}
            disabled={loading || !customLocation.trim()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download size={20} />
                Download Map
              </>
            )}
          </button>
        </div>
      </div>

      {/* Downloaded Maps */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Downloaded Maps ({downloadedMaps.length})
          </h3>
          {downloadedMaps.length > 0 && (
            <button
              onClick={clearAllMaps}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {downloadedMaps.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
            <p>No maps downloaded yet</p>
            <p className="text-sm">Download maps to access them offline</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloadedMaps.map(map => (
              <div key={map.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <img
                  src={map.imageUrl}
                  alt={map.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => window.open(map.imageUrl, '_blank')}
                />
                <div className="p-3">
                  <h4 className="font-semibold text-gray-800">{map.name}</h4>
                  <p className="text-sm text-gray-600">{map.location}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{new Date(map.downloadedAt).toLocaleDateString()}</span>
                    <span>{map.size}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => downloadMapAsImage(map)}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center justify-center gap-1"
                    >
                      <Download size={14} />
                      Save
                    </button>
                    <button
                      onClick={() => deleteMap(map.id)}
                      className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Downloaded maps are stored in your browser's local storage. 
          They will be available offline but may be cleared if you clear browser data.
          For best results, download maps before your trip when you have internet access.
        </p>
      </div>
    </div>
  );
};

export default OfflineMapDownloader;