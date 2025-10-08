import axios from 'axios';
import FormData from 'form-data';

const CDN_BASE_URL = 'https://catboxcdn.onrender.com';

interface MulterFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

interface CDNUploadResponse {
  success: boolean;
  data: {
    cdnUrl: string;
    fileId: string;
    originalName: string;
    customName: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  };
}

export async function uploadFileToCDN(
  file: MulterFile,
  fileName: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: fileName,
      contentType: file.mimetype
    });
    formData.append('filename', fileName);

    const response = await axios.post<CDNUploadResponse>(
      `${CDN_BASE_URL}/api/upload`,
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 600000 // 10 minutes timeout for large files
      }
    );

    if (!response.data.success) {
      throw new Error('CDN upload failed');
    }

    return response.data.data.cdnUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`CDN upload error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`CDN upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function uploadThumbnailToCDN(
  thumbnailBuffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', thumbnailBuffer, {
      filename: fileName,
      contentType: 'image/jpeg'
    });
    formData.append('filename', fileName);

    const response = await axios.post<CDNUploadResponse>(
      `${CDN_BASE_URL}/api/upload`,
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 300000 // 5 minutes timeout
      }
    );

    if (!response.data.success) {
      throw new Error('CDN thumbnail upload failed');
    }

    return response.data.data.cdnUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`CDN thumbnail upload error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`CDN thumbnail upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
