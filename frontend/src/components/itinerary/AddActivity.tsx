import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { Clock, DollarSign, Link as LinkIcon } from 'lucide-react';
import { ACTIVITY_CATEGORIES } from './constants';


interface AddActivityProps {
  destinationId: string;
  onActivityAdded: () => void;
}

// const ACTIVITY_CATEGORIES = [
//   { value: 'sightseeing', label: 'Sightseeing' },
//   { value: 'food', label: 'Food & Dining' },
//   { value: 'adventure', label: 'Adventure' },
//   { value: 'relaxation', label: 'Relaxation' },
//   { value: 'shopping', label: 'Shopping' },
//   { value: 'entertainment', label: 'Entertainment' },
//   { value: 'transport', label: 'Transport' },
//   { value: 'other', label: 'Other' },
// ];

export const AddActivity: React.FC<AddActivityProps> = ({ destinationId, onActivityAdded }) => {
  const { createActivity } = useTrip();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'sightseeing',
    start_time: '',
    end_time: '',
    estimated_cost: '',
    booking_url: '',
  });

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

    if (!formData.title.trim()) {
      addNotification({ type: 'warning', message: 'Please enter an activity title' });
      return;
    }

    try {
      setLoading(true);
      await createActivity(destinationId, {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category as any,
        start_time: formData.start_time || undefined,
        end_time: formData.end_time || undefined,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : 0,
        booking_url: formData.booking_url || undefined,
      });

      setFormData({
        title: '',
        description: '',
        category: 'sightseeing',
        start_time: '',
        end_time: '',
        estimated_cost: '',
        booking_url: '',
      });

      onActivityAdded();
    } catch (error) {
      console.error('Error adding activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Visit Louvre Museum"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ACTIVITY_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1">
            <Clock size={14} />
            Start Time
          </label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1">
            <Clock size={14} />
            End Time
          </label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1">
            <DollarSign size={14} />
            Estimated Cost
          </label>
          <input
            type="number"
            name="estimated_cost"
            value={formData.estimated_cost}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Booking URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1">
            <LinkIcon size={14} />
            Booking URL
          </label>
          <input
            type="url"
            name="booking_url"
            value={formData.booking_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Activity details..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Activity'}
        </button>
      </div>
    </form>
  );
};

export default AddActivity;