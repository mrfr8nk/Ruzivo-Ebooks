
import { MongoClient, Db, ObjectId } from 'mongodb';
import type { BookMetadata } from '@shared/schema';

const MONGODB_URI = 'mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/ebooks?retryWrites=true&w=majority&appName=Cluster0';

let client: MongoClient;
let db: Db;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('ebooks');
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function getDB(): Promise<Db> {
  if (!db) {
    return await connectToMongoDB();
  }
  return db;
}

export interface SiteStats {
  totalBooks: number;
  totalDownloads: number;
  totalVisitors: number;
  mostDownloadedBooks: BookMetadata[];
  recentUploads: BookMetadata[];
}

export interface AdminUser {
  _id?: ObjectId;
  username: string;
  password: string;
  createdAt: Date;
}

export interface Visitor {
  _id?: ObjectId;
  ip: string;
  userAgent: string;
  visitedAt: Date;
}

export interface SiteMaintenance {
  _id?: ObjectId;
  isLocked: boolean;
  message: string;
  updatedAt: Date;
}
