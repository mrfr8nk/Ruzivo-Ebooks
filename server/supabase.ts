import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hzhzxdopkuopvvultayn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aHp4ZG9wa3VvcHZ2dWx0YXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0Mzg4MzIsImV4cCI6MjA3NDAxNDgzMn0.8DPHbJ9sUV1wZKmc1-rBPISTCv59WJ8CGsn1_krJeLo';
const BUCKET_NAME = 'mrfrankofc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_BUCKET = BUCKET_NAME;

interface MulterFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export async function uploadFileToSupabase(
  file: MulterFile,
  fileName: string
): Promise<string> {
  const filePath = `ebooks/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function uploadThumbnailToSupabase(
  thumbnailBuffer: Buffer,
  fileName: string
): Promise<string> {
  const filePath = `thumbnails/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, thumbnailBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase thumbnail upload error: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}
