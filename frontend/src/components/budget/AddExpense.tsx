import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { DollarSign, Calendar, Tag } from 'lucide-react';

interface AddExpenseProps {
  tripId: string;
  onExpenseAdded: () => void;
}

const EXPENSE_CATEGORIES = [
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transportation' },
  { value: 'activities', label: 'Activities' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'other', label: 'Other' },
];

export const AddExpense: React.FC<AddExpenseProps> = ({ tripId, onExpenseAdded }) => {
  const { createExpense } = useTrip();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food',
    expense_type: 'personal',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.amount) {
      addNotification({ type: 'warning', message: 'Please fill in required fields' });
      return;
    }

    try {
      setLoading(true);
      await createExpense(tripId, {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category as any,
        expense_type: formData.expense_type as any,
        date: formData.date,
        description: formData.description || undefined,
      });

      setFormData({
        title: '',
        amount: '',
        category: 'food',
        expense_type: 'personal',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });

      onExpenseAdded();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Hotel stay"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <DollarSign size={16} />
            Amount *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <Tag size={16} />
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <Calendar size={16} />
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Expense Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
          <select
            name="expense_type"
            value={formData.expense_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="personal">Personal</option>
            <option value="group">Group</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details..."
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default AddExpense;