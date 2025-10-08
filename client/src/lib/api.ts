import { apiRequest } from './queryClient';

interface DownloadResponse {
  success: boolean;
  fileUrl: string;
  fileName: string;
}

export interface Book {
  _id?: string;
  title: string;
  author: string;
  curriculum: "ZIMSEC" | "Cambridge" | "Other";
  level: "O-Level" | "A-Level";
  form: string;
  fileUrl: string;
  fileName: string;
  coverUrl?: string;
  downloads: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export async function uploadBook(formData: FormData): Promise<Book> {
  const response = await fetch('/api/books/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload book');
  }

  return response.json();
}

export async function downloadBook(bookId: string, fileName: string): Promise<void> {
  const response = await apiRequest('POST', `/api/books/${bookId}/download`);
  const data: DownloadResponse = await response.json();

  const { fileUrl } = data;

  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function fetchUser() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Not authenticated');
  }
  return response.json();
}