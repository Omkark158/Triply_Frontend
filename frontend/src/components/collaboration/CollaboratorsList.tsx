import React, { useState } from 'react';
import { TripCollaborator } from '../../context/TripContext';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { Users, Crown, Edit2, Trash2, Shield, Eye } from 'lucide-react';

interface CollaboratorsListProps {
  collaborators: TripCollaborator[];
  tripId: string;
  onCollaboratorRemoved: () => void;
}

const ROLE_ICONS = {
  owner: Crown,
  editor: Edit2,
  viewer: Eye,
};

const ROLE_COLORS = {
  owner: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' },
  editor: { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-600' },
  viewer: { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' },
};

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  collaborators,
  tripId,
  onCollaboratorRemoved,
}) => {
  const { removeCollaborator, updateCollaboratorRole } = useTrip();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');

  const handleRemove = async (collaboratorId: string, email: string) => {
    if (!confirm(`Remove ${email} from this trip?`)) return;

    try {
      await removeCollaborator(collaboratorId);
      onCollaboratorRemoved();
    } catch (error) {
      console.error('Error removing collaborator:', error);
    }
  };

  const handleRoleUpdate = async (collaboratorId: string) => {
    try {
      await updateCollaboratorRole(collaboratorId, newRole);
      setEditingRole(null);
      onCollaboratorRemoved();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (collaborators.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Collaborators Yet</h3>
        <p className="text-gray-600">Invite friends and family to collaborate on this trip</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={24} />
          Collaborators ({collaborators.length})
        </h2>
      </div>

      {/* List */}
      <div className="p-6">
        <div className="space-y-3">
          {collaborators.map(collaborator => {
            const RoleIcon = ROLE_ICONS[collaborator.role];
            const roleColor = ROLE_COLORS[collaborator.role];
            const isCurrentUser = collaborator.user === String(user?.id);

            return (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {collaborator.user_details?.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>

                  {/* Info */}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {collaborator.user_details?.first_name} {collaborator.user_details?.last_name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {collaborator.user_details?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Added {new Date(collaborator.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Role Badge/Editor */}
                  {editingRole === collaborator.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newRole}
                        onChange={e => setNewRole(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="owner">Owner</option>
                      </select>
                      <button
                        onClick={() => handleRoleUpdate(collaborator.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRole(null)}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${roleColor.bg} ${roleColor.text}`}
                      >
                        <RoleIcon size={14} className={roleColor.icon} />
                        {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                      </span>

                      {!isCurrentUser && (
                        <>
                          <button
                            onClick={() => {
                              setEditingRole(collaborator.id);
                              setNewRole(collaborator.role);
                            }}
                            className="p-2 hover:bg-blue-100 rounded transition text-blue-600"
                            title="Change role"
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            onClick={() => handleRemove(collaborator.id, collaborator.user_details?.email || '')}
                            className="p-2 hover:bg-red-100 rounded transition text-red-600"
                            title="Remove collaborator"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsList;