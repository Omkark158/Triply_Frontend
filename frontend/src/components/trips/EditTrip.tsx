import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { ArrowLeft, MapPin, Calendar, DollarSign, Trash2, Globe } from 'lucide-react';

export const EditTrip: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { currentTrip, fetchTripById, updateTrip, deleteTrip } = useTrip();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
    description: '',
    is_public: false,
  });

  useEffect(() => {
    if (tripId) {
      fetchTripById(tripId);
    }
  }, [tripId]);

  useEffect(() => {
    if (currentTrip) {
      setFormData({
        title: currentTrip.title,
        destination: currentTrip.destination,
        start_date: currentTrip.start_date,
        end_date: currentTrip.end_date,
        budget: currentTrip.budget.toString(),
        description: currentTrip.description || '',
        is_public: currentTrip.is_public,
      });
    }
  }, [currentTrip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
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
      if (tripId) {
        await updateTrip(tripId, {
          ...formData,
          budget: parseFloat(formData.budget),
        });
        navigate(`/trip/${tripId}`);
      }
    } catch (error) {
      console.error('Error updating trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (tripId) {
        await deleteTrip(tripId);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold">Edit Trip</h1>
        <p className="text-white/80">Update your trip details</p>
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

        {/* Budget */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <DollarSign size={18} />
            Budget (USD) *
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Trip'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold flex items-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Trip?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All trip data including itinerary, budget, and documents will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTrip;