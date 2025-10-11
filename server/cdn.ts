import axios from 'axios';
import FormData from 'form-data';

const CATBOX_USERHASH = process.env.CATBOX_USERHASH || '61101e1ef85d3a146d5841cee';
const CATBOX_API_URL = 'https://catbox.moe/user/api.php';

interface MulterFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export async function uploadFileToCDN(
  file: MulterFile,
  fileName: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', CATBOX_USERHASH);
    formData.append('fileToUpload', file.buffer, {
      filename: fileName,
      contentType: file.mimetype
    });

    const response = await axios.post(
      CATBOX_API_URL,
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 600000 // 10 minutes timeout for large files
      }
    );

    const catboxUrl = response.data.trim();
    
    if (!catboxUrl.startsWith('http')) {
      throw new Error('Invalid response from Catbox: ' + catboxUrl);
    }

    console.log('Catbox upload successful:', catboxUrl);
    return catboxUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Catbox upload error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`Catbox upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function uploadThumbnailToCDN(
  thumbnailBuffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', CATBOX_USERHASH);
    formData.append('fileToUpload', thumbnailBuffer, {
      filename: fileName,
      contentType: 'image/jpeg'
    });

    const response = await axios.post(
      CATBOX_API_URL,
      formData,
      {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 300000 // 5 minutes timeout
      }
    );

    const catboxUrl = response.data.trim();
    
    if (!catboxUrl.startsWith('http')) {
      throw new Error('Invalid response from Catbox: ' + catboxUrl);
    }

    console.log('Catbox thumbnail upload successful:', catboxUrl);
    return catboxUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Catbox thumbnail upload error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`Catbox thumbnail upload error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
