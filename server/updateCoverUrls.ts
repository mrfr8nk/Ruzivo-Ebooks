
import { getDB } from './mongodb';

async function updateOldCoverUrls() {
  try {
    const db = await getDB();
    
    // Find all books with the old CDN URL
    const result = await db.collection('books').updateMany(
      { coverUrl: { $regex: /cdn\.mrfrankofc\.gleeze\.com/ } },
      { $set: { coverUrl: 'https://dabby.vercel.app/pdf_icon.png' } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} books with old CDN URLs`);
    
    // Also update any empty or null coverUrl to use the fallback
    const nullResult = await db.collection('books').updateMany(
      { $or: [{ coverUrl: null }, { coverUrl: '' }] },
      { $set: { coverUrl: 'https://dabby.vercel.app/pdf_icon.png' } }
    );
    
    console.log(`✅ Updated ${nullResult.modifiedCount} books with null/empty coverUrl`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating cover URLs:', error);
    process.exit(1);
  }
}

updateOldCoverUrls();
