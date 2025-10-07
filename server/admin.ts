
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_USERNAME = 'mrfrankofc';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('darex123', 10);

export interface AuthRequest extends Request {
  adminId?: string;
}

export async function initializeAdmin() {
  const db = await getDB();
  const adminExists = await db.collection('admins').findOne({ username: ADMIN_USERNAME });
  
  if (!adminExists) {
    await db.collection('admins').insertOne({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD_HASH,
      createdAt: new Date(),
    });
    console.log('✅ Admin user initialized');
  }
}

export async function adminLogin(username: string, password: string): Promise<string | null> {
  const db = await getDB();
  const admin = await db.collection('admins').findOne({ username });
  
  if (!admin) return null;
  
  const isValid = await bcrypt.compare(password, admin.password as string);
  if (!isValid) return null;
  
  const token = jwt.sign({ id: admin._id.toString(), username: admin.username }, JWT_SECRET, {
    expiresIn: '7d',
  });
  
  return token;
}

export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.adminToken || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function trackVisitor(req: Request) {
  const db = await getDB();
  const ip = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  await db.collection('visitors').insertOne({
    ip,
    userAgent,
    visitedAt: new Date(),
  });
}

export async function getSiteStats() {
  const db = await getDB();
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const [
    totalBooks, 
    totalVisitors, 
    books,
    todayVisitors,
    weekVisitors,
    monthVisitors,
    todayDownloads
  ] = await Promise.all([
    db.collection('books').countDocuments(),
    db.collection('visitors').countDocuments(),
    db.collection('books').find({}).toArray(),
    db.collection('visitors').countDocuments({ visitedAt: { $gte: today } }),
    db.collection('visitors').countDocuments({ visitedAt: { $gte: thisWeek } }),
    db.collection('visitors').countDocuments({ visitedAt: { $gte: thisMonth } }),
    db.collection('downloads').countDocuments({ downloadedAt: { $gte: today } })
  ]);
  
  const totalDownloads = books.reduce((sum, book) => sum + (book.downloads || 0), 0);
  
  const mostDownloadedBooks = books
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 10)
    .map(book => ({ ...book, _id: book._id.toString() }));
  
  const recentUploads = books
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 10)
    .map(book => ({ ...book, _id: book._id.toString() }));

  // Book type distribution
  const bookTypeDistribution = books.reduce((acc: any, book) => {
    const type = (book as any).bookType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Level distribution
  const levelDistribution = books.reduce((acc: any, book) => {
    const level = book.level || 'Unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  // Curriculum distribution
  const curriculumDistribution = books.reduce((acc: any, book) => {
    const curriculum = book.curriculum || 'Unknown';
    acc[curriculum] = (acc[curriculum] || 0) + 1;
    return acc;
  }, {});

  // Get daily visitor trend for last 7 days
  const dailyVisitors = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const count = await db.collection('visitors').countDocuments({
      visitedAt: { $gte: dayStart, $lt: dayEnd }
    });
    dailyVisitors.push({
      date: dayStart.toISOString().split('T')[0],
      visitors: count
    });
  }
  
  return {
    totalBooks,
    totalDownloads,
    totalVisitors,
    todayVisitors,
    weekVisitors,
    monthVisitors,
    todayDownloads,
    mostDownloadedBooks,
    recentUploads,
    bookTypeDistribution,
    levelDistribution,
    curriculumDistribution,
    dailyVisitors,
  };
}

export async function getSiteMaintenance() {
  const db = await getDB();
  const maintenance = await db.collection('maintenance').findOne({});
  return maintenance || { isLocked: false, message: '' };
}

export async function setSiteMaintenance(isLocked: boolean, message: string) {
  const db = await getDB();
  await db.collection('maintenance').updateOne(
    {},
    { $set: { isLocked, message, updatedAt: new Date() } },
    { upsert: true }
  );
}
