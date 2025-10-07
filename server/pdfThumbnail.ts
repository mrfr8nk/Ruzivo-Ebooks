
import sharp from 'sharp';
import * as pdfParse from 'pdf-parse';

export async function generatePdfThumbnail(pdfBuffer: Buffer): Promise<Buffer> {
  try {
    // Parse the PDF
    const data = await (pdfParse as any).default(pdfBuffer);
    
    // For now, create a simple placeholder thumbnail with PDF info
    // Note: Full PDF rendering requires additional dependencies like pdf-poppler
    // This creates a styled thumbnail with the PDF title/info
    
    const width = 400;
    const height = 600;
    
    // Create a gradient background image
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)"/>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="24" font-weight="bold">PDF Document</text>
        <text x="50%" y="60%" text-anchor="middle" fill="white" font-size="16">${data.numpages} pages</text>
      </svg>
    `;
    
    // Convert SVG to image buffer
    const thumbnailBuffer = await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toBuffer();
    
    return thumbnailBuffer;
  } catch (error) {
    console.error('PDF thumbnail generation error:', error);
    throw error;
  }
}
