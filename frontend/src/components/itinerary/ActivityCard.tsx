import React, { useState } from 'react';
import { Activity } from '../../context/TripContext';
import { useTrip } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { Clock, DollarSign, CheckCircle, Trash2, Edit2, LinkIcon } from 'lucide-react';
import { ACTIVITY_CATEGORIES } from './constants';


interface ActivityCardProps {
  activity: Activity;
  onActivityUpdated: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  sightseeing: { bg: 'bg-blue-100', text: 'text-blue-800' },
  food: { bg: 'bg-orange-100', text: 'text-orange-800' },
  adventure: { bg: 'bg-red-100', text: 'text-red-800' },
  relaxation: { bg: 'bg-green-100', text: 'text-green-800' },
  shopping: { bg: 'bg-pink-100', text: 'text-pink-800' },
  entertainment: { bg: 'bg-purple-100', text: 'text-purple-800' },
  transport: { bg: 'bg-gray-100', text: 'text-gray-800' },
  other: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onActivityUpdated }) => {
  const { updateActivity, deleteActivity } = useTrip();
  const { addNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [editing, setEditing] = useState(activity);
  const [deleting, setDeleting] = useState(false);

  const categoryColor = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.other;

  const handleToggleComplete = async () => {
    try {
      await updateActivity(activity.id, {
        is_completed: !activity.is_completed,
      });
      onActivityUpdated();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this activity?')) return;
    try {
      setDeleting(true);
      await deleteActivity(activity.id);
      addNotification({ type: 'success', message: 'Activity deleted' });
      onActivityUpdated();
    } catch (error) {
      console.error('Error deleting activity:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border transition ${
        activity.is_completed
          ? 'bg-gray-50 border-gray-300 opacity-75'
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className="mt-1 flex-shrink-0 transition"
        >
          <CheckCircle
            size={20}
            className={`${activity.is_completed ? 'text-green-600 fill-green-600' : 'text-gray-300'}`}
          />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h4
              className={`font-semibold text-sm ${
                activity.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {activity.title}
            </h4>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${categoryColor.bg} ${categoryColor.text}`}>
              {activity.category}
            </span>
          </div>

          {activity.description && (
            <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
          )}

          {/* Details */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            {activity.start_time && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {activity.start_time}
                {activity.end_time && ` - ${activity.end_time}`}
              </span>
            )}
            {activity.estimated_cost > 0 && (
              <span className="flex items-center gap-1">
                <DollarSign size={14} />
                {activity.estimated_cost}
              </span>
            )}
            {activity.booking_url && (
              <a
                href={activity.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <LinkIcon size={14} />
                Book
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-blue-100 rounded transition text-blue-600"
            title="Edit activity"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1 hover:bg-red-100 rounded transition text-red-600 disabled:opacity-50"
            title="Delete activity"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-3 pt-3 border-t space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Edit Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={editing.title}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Edit Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={editing.category}
                onChange={e => setEditing({ ...editing, category: e.target.value as any })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {ACTIVITY_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Edit Start Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={editing.start_time || ''}
                onChange={e => setEditing({ ...editing, start_time: e.target.value || undefined })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Edit End Time */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={editing.end_time || ''}
                onChange={e => setEditing({ ...editing, end_time: e.target.value || undefined })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Edit Cost */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Cost</label>
              <input
                type="number"
                value={editing.estimated_cost || 0}
                onChange={e => setEditing({ ...editing, estimated_cost: parseFloat(e.target.value) || 0 })}
                step="0.01"
                min="0"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Edit Booking URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Booking URL</label>
              <input
                type="url"
                value={editing.booking_url || ''}
                onChange={e => setEditing({ ...editing, booking_url: e.target.value || undefined })}
                placeholder="https://..."
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Edit Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={editing.description || ''}
              onChange={e => setEditing({ ...editing, description: e.target.value || undefined })}
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
            />
          </div>

          {/* Edit Buttons */}
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await updateActivity(activity.id, editing);
                  setIsEditing(false);
                  onActivityUpdated();
                } catch (error) {
                  console.error('Error updating activity:', error);
                }
              }}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-semibold"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditing(activity);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;