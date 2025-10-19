import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { Mail, UserPlus, MessageSquare } from 'lucide-react';

interface InviteMembersProps {
  tripId: string;
  onInviteSent: () => void;
}

export const InviteMembers: React.FC<InviteMembersProps> = ({ tripId, onInviteSent }) => {
  const { inviteCollaborator } = useTrip();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    role: 'viewer',
    message: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await inviteCollaborator(
        tripId,
        formData.email,
        formData.role,
        formData.message || undefined
      );

      setFormData({
        email: '',
        role: 'viewer',
        message: '',
      });

      onInviteSent();
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      if (error.response?.status === 400) {
        setErrors({ email: 'User is already a collaborator or invited' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="friend@example.com"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <MessageSquare size={16} />
          Personal Message (Optional)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Add a personal note to your invitation..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Role Descriptions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-gray-900 mb-2">Role Permissions:</p>
        <ul className="space-y-1 text-gray-700">
          <li><strong>Viewer:</strong> Can view trip details</li>
          <li><strong>Editor:</strong> Can view and edit trip details</li>
          <li><strong>Owner:</strong> Full access including delete</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus size={20} />
          {loading ? 'Sending Invitation...' : 'Send Invitation'}
        </button>
      </div>
    </form>
  );
};

export default InviteMembers;