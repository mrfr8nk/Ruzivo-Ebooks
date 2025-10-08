import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { uploadFileToSupabase, uploadThumbnailToSupabase } from "./supabase";
import { insertBookSchema, bookMetadataSchema, insertUserSchema } from "@shared/schema";
import { generatePdfThumbnail } from "./pdfThumbnail";

// Session middleware for student authentication
interface AuthRequest extends Request {
  session: {
    userId?: string;
    username?: string;
  };
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  next();
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/epub+zip'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and EPUB files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {

  // Student Authentication Routes
  
  // Student Signup
  app.post('/api/auth/signup', async (req: AuthRequest, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      const { username, password } = validation.data;

      // Check if username exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;

      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  // Student Login
  app.post('/api/auth/login', async (req: AuthRequest, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set session and save it
      req.session.userId = user.id;
      req.session.username = user.username;

      // Force session save before responding
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ error: 'Failed to save session' });
        }

        res.json({ 
          success: true, 
          user: { id: user.id, username: user.username } 
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Student Logout
  app.post('/api/auth/logout', (req: AuthRequest, res) => {
    req.session.userId = undefined;
    req.session.username = undefined;
    res.json({ success: true });
  });

  // Get current student
  app.get('/api/auth/me', (req: AuthRequest, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ 
      id: req.session.userId, 
      username: req.session.username 
    });
  });

  // Get student's uploaded books
  app.get('/api/auth/my-books', requireAuth, async (req: AuthRequest, res) => {
    try {
      const username = req.session.username!;
      const books = await storage.getBooksByUsername(username);
      res.json(books);
    } catch (error) {
      console.error('Get my books error:', error);
      res.status(500).json({ error: 'Failed to fetch your books' });
    }
  });

  // Upload a new book (requires authentication)
  app.post('/api/books/upload', requireAuth, upload.single('file'), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const bookData = {
        title: req.body.title,
        author: req.body.author,
        bookType: req.body.bookType,
        curriculum: req.body.curriculum,
        level: req.body.level,
        form: req.body.form,
        year: req.body.year || undefined,
        examSession: req.body.examSession || undefined,
        description: req.body.description,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        coverUrl: req.body.coverUrl,
        uploadedBy: req.session.username!, // Use authenticated user's username
      };

      const validation = insertBookSchema.safeParse(bookData);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedTitle = bookData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${sanitizedTitle}_${timestamp}.${fileExtension}`;
      const fileSize = req.file.size;

      // Upload to Supabase
      const fileUrl = await uploadFileToSupabase(req.file, fileName);

      // Generate thumbnail for PDFs
      let coverUrl = bookData.coverUrl;
      if (!coverUrl && req.file.mimetype === 'application/pdf') {
        try {
          const thumbnailBuffer = await generatePdfThumbnail(req.file.buffer);
          const thumbnailFileName = `${sanitizedTitle}_${timestamp}_thumb.jpg`;
          coverUrl = await uploadThumbnailToSupabase(thumbnailBuffer, thumbnailFileName);
        } catch (error) {
          console.error('Thumbnail generation failed:', error);
          // Use fallback PDF image
          coverUrl = 'https://cdn.mrfrankofc.gleeze.com/pdf_image.png';
        }
      }

      // Save metadata to storage
      const book = await storage.createBook({
        ...validation.data,
        fileUrl,
        fileName,
        fileSize,
        coverUrl: coverUrl || bookData.coverUrl,
      });

      res.json(book);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to upload book'
      });
    }
  });

  // Get all books
  app.get('/api/books', async (_req, res) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error('Get books error:', error);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  });

  // Get books by level
  app.get('/api/books/level/:level', async (req, res) => {
    try {
      const level = req.params.level as "O-Level" | "A-Level";
      if (level !== "O-Level" && level !== "A-Level") {
        return res.status(400).json({ error: 'Invalid level' });
      }
      const books = await storage.getBooksByLevel(level);
      res.json(books);
    } catch (error) {
      console.error('Get books by level error:', error);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  });

  // Get trending books
  app.get('/api/books/trending', async (_req, res) => {
    try {
      const books = await storage.getTrendingBooks(8);
      res.json(books);
    } catch (error) {
      console.error('Get trending books error:', error);
      res.status(500).json({ error: 'Failed to fetch trending books' });
    }
  });

  // Get most downloaded books
  app.get('/api/books/most-downloaded', async (_req, res) => {
    try {
      const books = await storage.getMostDownloadedBooks(8);
      res.json(books);
    } catch (error) {
      console.error('Get most downloaded books error:', error);
      res.status(500).json({ error: 'Failed to fetch most downloaded books' });
    }
  });

  // Get single book
  app.get('/api/books/:id', async (req, res) => {
    try {
      const book = await storage.getBookById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      console.error('Get book error:', error);
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  });

  // Admin login
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const { adminLogin } = await import('./admin');
      const token = await adminLogin(username, password);

      if (!token) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ success: true, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Admin logout
  app.post('/api/admin/logout', async (req, res) => {
    res.clearCookie('adminToken');
    res.json({ success: true });
  });

  // Get admin stats
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const { getSiteStats } = await import('./admin');
      const stats = await getSiteStats();
      res.json(stats);
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Delete book (admin only)
  app.delete('/api/admin/books/:id', async (req, res) => {
    try {
      const { authenticateAdmin } = await import('./admin');
      authenticateAdmin(req as any, res, async () => {
        await storage.deleteBook(req.params.id);
        res.json({ success: true });
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete book' });
    }
  });

  // Increment downloads (called when user downloads a book)
  app.post('/api/books/:id/download', async (req, res) => {
    try {
      const book = await storage.getBookById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      await storage.incrementDownloads(req.params.id);

      res.json({
        success: true,
        fileUrl: book.fileUrl,
        fileName: book.fileName
      });
    } catch (error) {
      console.error('Download increment error:', error);
      res.status(500).json({ error: 'Failed to process download' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}