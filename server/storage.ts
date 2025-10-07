import { type User, type InsertUser, type BookMetadata, type InsertBook } from "@shared/schema";
import { randomUUID } from "crypto";
import { getDB } from "./mongodb";
import { ObjectId } from "mongodb";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Book methods
  createBook(book: InsertBook & { fileUrl: string; fileName: string; fileSize: number }): Promise<BookMetadata>;
  getAllBooks(): Promise<BookMetadata[]>;
  getBookById(id: string): Promise<BookMetadata | undefined>;
  incrementDownloads(id: string): Promise<void>;
  getBooksByLevel(level: "O-Level" | "A-Level"): Promise<BookMetadata[]>;
  getTrendingBooks(limit?: number): Promise<BookMetadata[]>;
  getMostDownloadedBooks(limit?: number): Promise<BookMetadata[]>;
  deleteBook(id: string): Promise<void>;
  getBooksByUsername(username: string): Promise<BookMetadata[]>;
}

export class MongoDBStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDB();
    const user = await db.collection('users').findOne({ id });
    return user as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDB();
    const user = await db.collection('users').findOne({ username });
    return user as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDB();
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    await db.collection('users').insertOne(user);
    return user;
  }

  async createBook(book: InsertBook & { fileUrl: string; fileName: string; fileSize: number }): Promise<BookMetadata> {
    const db = await getDB();
    const bookMetadata: Omit<BookMetadata, '_id'> = {
      ...book,
      downloads: 0,
      uploadedAt: new Date(),
    };
    const result = await db.collection('books').insertOne(bookMetadata as any);
    return { ...bookMetadata, _id: result.insertedId.toString() };
  }

  async getAllBooks(): Promise<BookMetadata[]> {
    const db = await getDB();
    const books = await db.collection('books')
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();
    return books.map(book => ({ ...book, _id: book._id.toString() })) as BookMetadata[];
  }

  async getBookById(id: string): Promise<BookMetadata | undefined> {
    const db = await getDB();
    const book = await db.collection('books').findOne({ _id: new ObjectId(id) });
    if (!book) return undefined;
    return { ...book, _id: book._id.toString() } as BookMetadata;
  }

  async incrementDownloads(id: string): Promise<void> {
    const db = await getDB();
    await db.collection('books').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { downloads: 1 } }
    );
    
    // Track individual download for analytics
    await db.collection('downloads').insertOne({
      bookId: id,
      downloadedAt: new Date()
    });
  }

  async deleteBook(id: string): Promise<void> {
    const db = await getDB();
    await db.collection('books').deleteOne({ _id: new ObjectId(id) });
  }

  async getBooksByLevel(level: "O-Level" | "A-Level"): Promise<BookMetadata[]> {
    const db = await getDB();
    const books = await db.collection('books')
      .find({ level })
      .sort({ uploadedAt: -1 })
      .toArray();
    return books.map(book => ({ ...book, _id: book._id.toString() })) as BookMetadata[];
  }

  async getTrendingBooks(limit: number = 8): Promise<BookMetadata[]> {
    const db = await getDB();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const books = await db.collection('books')
      .find({ uploadedAt: { $gte: weekAgo } })
      .sort({ downloads: -1 })
      .limit(limit)
      .toArray();
    return books.map(book => ({ ...book, _id: book._id.toString() })) as BookMetadata[];
  }

  async getMostDownloadedBooks(limit: number = 8): Promise<BookMetadata[]> {
    const db = await getDB();
    const books = await db.collection('books')
      .find({})
      .sort({ downloads: -1 })
      .limit(limit)
      .toArray();
    return books.map(book => ({ ...book, _id: book._id.toString() })) as BookMetadata[];
  }

  async getBooksByUsername(username: string): Promise<BookMetadata[]> {
    const db = await getDB();
    const books = await db.collection('books')
      .find({ uploadedBy: username })
      .sort({ uploadedAt: -1 })
      .toArray();
    return books.map(book => ({ ...book, _id: book._id.toString() })) as BookMetadata[];
  }
}

export const storage = new MongoDBStorage();