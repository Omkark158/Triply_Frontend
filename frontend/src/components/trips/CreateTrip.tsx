// src/components/trips/CreateTrip.tsx - FIXED
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip, Trip } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { ArrowLeft, MapPin, Calendar, DollarSign, Globe } from 'lucide-react';

interface FormData {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string;
  currency: 'USD' | 'INR';  // TYPED AS LITERAL
  description: string;
  is_public: boolean;
}

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrip();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
    currency: 'USD',  // Default value
    description: '',
    is_public: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === 'currency') {
      // Ensure currency is typed correctly as literal
      setFormData(prev => ({
        ...prev,
        [name]: value as 'USD' | 'INR',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.destination || !formData.start_date || !formData.end_date || !formData.budget) {
      addNotification({
        type: 'warning',
        message: 'Please fill in all required fields',
      });
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      addNotification({
        type: 'error',
        message: 'Start date must be before end date',
      });
      return;
    }

    try {
      setLoading(true);
      
      // FIXED: Properly type the trip data
      const tripData: Partial<Trip> = {
        title: formData.title,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: parseFloat(formData.budget),
        currency: formData.currency,  // Already typed as 'USD' | 'INR'
        description: formData.description,
        is_public: formData.is_public,
      };

      await createTrip(tripData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Create New Trip</h1>
        <p className="text-white/80">Plan your next adventure</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 max-w-2xl">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Trip Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Summer Europe Tour"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Destination */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin size={18} />
            Destination *
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g., Paris, France"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar size={18} />
              Start Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar size={18} />
              End Date *
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Budget & Currency */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign size={18} />
              Budget *
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details about your trip..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Public Toggle */}
        <div className="mb-6 flex items-center gap-3">
          <input
            type="checkbox"
            id="is_public"
            name="is_public"
            checked={formData.is_public}
            onChange={handleChange}
            className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="is_public" className="flex items-center gap-2 cursor-pointer text-gray-900">
            <Globe size={18} className="text-blue-600" />
            Make this trip public
          </label>
          <p className="text-sm text-gray-500 ml-auto">
            {formData.is_public ? 'Anyone can view this trip' : 'Only you can view'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;