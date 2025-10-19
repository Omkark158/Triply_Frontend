import React, { useEffect, useState } from 'react';
import { useTrip, TripCollaborator, TripInvitation } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import InviteMembers from './InviteMembers';
import CollaboratorsList from './CollaboratorsList';
import { Share2, Users, Mail, Loader, AlertCircle } from 'lucide-react';

interface ShareTripProps {
  tripId?: string;
}

export const ShareTrip: React.FC<ShareTripProps> = ({ tripId }) => {
  const { currentTrip, getCollaborators, getInvitations } = useTrip();
  const { addNotification } = useNotification();
  const [collaborators, setCollaborators] = useState<TripCollaborator[]>([]);
  const [invitations, setInvitations] = useState<TripInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const actualTripId = tripId || currentTrip?.id;

  useEffect(() => {
    if (actualTripId) {
      loadData();
    }
  }, [actualTripId]);

  const loadData = async () => {
    if (!actualTripId) return;
    try {
      setLoading(true);
      const [collabData, inviteData] = await Promise.all([
        getCollaborators(actualTripId),
        getInvitations(actualTripId),
      ]);
      setCollaborators(collabData);
      setInvitations(inviteData);
    } catch (error) {
      console.error('Error loading collaboration data:', error);
      addNotification({ type: 'error', message: 'Failed to load collaborators' });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSent = () => {
    setShowInviteForm(false);
    loadData();
  };

  const handleCollaboratorRemoved = () => {
    loadData();
  };

  if (!actualTripId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-900">No Trip Selected</h3>
          <p className="text-yellow-800">Please select a trip to share with others.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading collaboration details...</p>
        </div>
      </div>
    );
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Share2 size={28} />
                Share Trip
              </h1>
              <p className="text-purple-100 text-sm mt-1">
                Collaborate with friends and family
              </p>
            </div>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              {showInviteForm ? 'Cancel' : 'Invite Members'}
            </button>
          </div>
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <div className="p-6 border-b bg-purple-50">
            <InviteMembers tripId={actualTripId} onInviteSent={handleInviteSent} />
          </div>
        )}

        {/* Stats */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-600" size={20} />
              <span className="text-sm text-gray-600 font-semibold">Collaborators</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{collaborators.length}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-orange-600" size={20} />
              <span className="text-sm text-gray-600 font-semibold">Pending Invites</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pendingInvitations.length}</p>
          </div>
        </div>
      </div>

      {/* Collaborators List */}
      <CollaboratorsList
        collaborators={collaborators}
        tripId={actualTripId}
        onCollaboratorRemoved={handleCollaboratorRemoved}
      />

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Invitations</h2>
          <div className="space-y-3">
            {pendingInvitations.map(invitation => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Mail className="text-orange-600" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">{invitation.invitee_email}</p>
                    <p className="text-sm text-gray-600">
                      Role: <span className="capitalize">{invitation.role}</span> • 
                      Sent {new Date(invitation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareTrip;