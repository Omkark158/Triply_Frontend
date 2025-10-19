import React, { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import { Document as AppDocument } from '../../types/documents';

interface DocumentViewerProps {
  documents: AppDocument[];
  onDelete?: (documentId: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents, onDelete }) => {
  const [deleting, setDeleting] = useState<string | null>(null);

  const documentTypeLabels: Record<string, string> = {
    passport: 'Passport',
    visa: 'Visa',
    ticket: 'Ticket/Boarding Pass',
    booking: 'Booking Confirmation',
    insurance: 'Travel Insurance',
    itinerary: 'Itinerary',
    map: 'Map',
    other: 'Other',
  };

  const documentTypeColors: Record<string, string> = {
    passport: 'bg-blue-100 text-blue-800',
    visa: 'bg-green-100 text-green-800',
    ticket: 'bg-purple-100 text-purple-800',
    booking: 'bg-orange-100 text-orange-800',
    insurance: 'bg-red-100 text-red-800',
    itinerary: 'bg-yellow-100 text-yellow-800',
    map: 'bg-teal-100 text-teal-800',
    other: 'bg-gray-100 text-gray-800',
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      setDeleting(documentId);
      const response = await fetch(`/api/documents/${documentId}/delete_file/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Delete failed');
      onDelete?.(documentId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete document. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <FileText className="mx-auto text-gray-300 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
        <p className="text-gray-600">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Documents</h2>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <FileText className="text-indigo-600 flex-shrink-0" size={24} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          documentTypeColors[doc.document_type] || documentTypeColors.other
                        }`}
                      >
                        {documentTypeLabels[doc.document_type] || 'Other'}
                      </span>
                    </div>

                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploaded_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={doc.file}
                    download
                    className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium text-sm"
                  >
                    Download
                  </a>
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm disabled:opacity-50"
                    >
                      {deleting === doc.id ? (
                        <Loader className="animate-spin" size={16} />
                      ) : (
                        'Delete'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};