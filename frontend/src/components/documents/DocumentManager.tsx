import React, { useState, useEffect } from 'react';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { DocumentViewer } from './DocumentViewer';
import { Document as AppDocument } from '../../types/documents';

interface DocumentManagerProps {
  tripId?: string;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ tripId }) => {
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Mock data — replace this with actual API call
  useEffect(() => {
    setDocuments([
      {
        id: '1',
        title: 'Passport Copy',
        document_type: 'passport',
        file: '#',
        description: 'Scanned passport document',
        file_size: 2048576,
        uploaded_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Flight Ticket',
        document_type: 'ticket',
        file: '#',
        description: 'E-ticket for flight booking',
        file_size: 1048576,
        uploaded_at: new Date().toISOString(),
      },
    ]);
  }, [tripId]);

  const handleUploadComplete = (file: File) => {
    setShowUpload(false);
    // TODO: refresh documents list via API
  };

  if (!tripId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-900">No Trip Selected</h3>
          <p className="text-yellow-800">Please select a trip to manage documents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText size={28} />
                Documents
              </h1>
              <p className="text-indigo-100 text-sm mt-1">Store and manage travel documents</p>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2"
            >
              <Upload size={20} />
              {showUpload ? 'Cancel' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="p-6 border-b bg-indigo-50">
            <FileUpload tripId={tripId} onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {/* Stats */}
        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <DocumentViewer documents={documents} />
    </div>
  );
};

export default DocumentManager;
