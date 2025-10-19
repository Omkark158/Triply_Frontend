import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { X, MapPin, Calendar } from 'lucide-react';

interface AddDestinationProps {
  tripId: string;
  onDestinationAdded: () => void;
}

export const AddDestination: React.FC<AddDestinationProps> = ({
  tripId,
  onDestinationAdded,
}) => {
  const { createDestination, currentTrip } = useTrip();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    day_number: '1',
    notes: '',
  });

  const tripDays = currentTrip
    ? Math.ceil(
        (new Date(currentTrip.end_date).getTime() - new Date(currentTrip.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 1;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addNotification({ type: 'warning', message: 'Please enter a destination name' });
      return;
    }

    try {
      setLoading(true);
      await createDestination(tripId, {
        name: formData.name,
        address: formData.address || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        day_number: parseInt(formData.day_number),
        notes: formData.notes || undefined,
      });

      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        day_number: '1',
        notes: '',
      });

      onDestinationAdded();
    } catch (error) {
      console.error('Error adding destination:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Destination Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Eiffel Tower"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Day */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1">
            <Calendar size={16} />
            Day *
          </label>
          <select
            name="day_number"
            value={formData.day_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: tripDays }).map((_, i) => (
              <option key={i} value={i + 1}>
                Day {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1">
            <MapPin size={16} />
            Latitude
          </label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="e.g., 48.8584"
            step="0.0001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1">
            <MapPin size={16} />
            Longitude
          </label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="e.g., 2.2945"
            step="0.0001"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any notes about this destination..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Destination'}
        </button>
      </div>
    </form>
  );
};

export default AddDestination;