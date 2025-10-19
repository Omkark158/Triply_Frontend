// src/types/documents.ts

export interface Document {
  id: string;
  title: string;
  document_type: string;
  file: string;
  description?: string;
  file_size: number;
  uploaded_at: string;
}
