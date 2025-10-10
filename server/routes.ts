import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { uploadFileToCDN, uploadThumbnailToCDN } from "./cdn";
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
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, EPUB, DOC, DOCX, PPT, and PPTX files are allowed.'));
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

  // Upload a new book (authentication optional but credited if logged in)
  app.post('/api/books/upload', upload.single('file'), async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Get username from session, ensure it's properly set
      const uploadedBy = req.session?.userId && req.session?.username 
        ? req.session.username 
        : 'Anonymous';

      console.log('Upload session check:', {
        hasSession: !!req.session,
        userId: req.session?.userId,
        username: req.session?.username,
        uploadedBy
      });

      const bookData = {
        title: req.body.title,
        author: req.body.author || undefined,
        bookType: req.body.bookType || undefined,
        curriculum: req.body.curriculum || undefined,
        level: req.body.level || undefined,
        form: req.body.form || undefined,
        year: req.body.year || undefined,
        examSession: req.body.examSession || undefined,
        description: req.body.description || undefined,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        coverUrl: req.body.coverUrl || undefined,
        uploadedBy: uploadedBy,
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

      // Upload to CDN
      const fileUrl = await uploadFileToCDN(req.file, fileName);

      // Generate thumbnail for PDFs
      let coverUrl = bookData.coverUrl;
      if (!coverUrl && req.file.mimetype === 'application/pdf') {
        try {
          const thumbnailBuffer = await generatePdfThumbnail(req.file.buffer);
          const thumbnailFileName = `${sanitizedTitle}_${timestamp}_thumb.jpg`;
          coverUrl = await uploadThumbnailToCDN(thumbnailBuffer, thumbnailFileName);
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

  // Get top uploaders
  app.get('/api/top-uploaders', async (_req, res) => {
    try {
      const uploaders = await storage.getTopUploaders(10);
      res.json(uploaders);
    } catch (error) {
      console.error('Get top uploaders error:', error);
      res.status(500).json({ error: 'Failed to fetch top uploaders' });
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

  // Get all users with uploads (admin only)
  app.get('/api/admin/users-uploads', async (req, res) => {
    try {
      const { authenticateAdmin } = await import('./admin');
      authenticateAdmin(req as any, res, async () => {
        const usersWithUploads = await storage.getAllUsersWithUploads();
        res.json(usersWithUploads);
      });
    } catch (error) {
      console.error('Get users with uploads error:', error);
      res.status(500).json({ error: 'Failed to fetch users with uploads' });
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

  // File proxy endpoint - masks Catbox URLs with custom domain
  app.get('/files/:fileId', async (req, res) => {
    try {
      const { fileId } = req.params;
      const catboxUrl = `https://files.catbox.moe/${fileId}`;

      console.log('Proxying file download:', fileId);

      const axios = (await import('axios')).default;
      const response = await axios.get(catboxUrl, {
        responseType: 'stream',
        timeout: 60000
      });

      // Get the original filename from the fileId or content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = fileId;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      }

      // Set headers to force download with custom filename
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', response.headers['content-length'] || '0');
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      // Stream the file to the client
      response.data.pipe(res);

    } catch (error) {
      console.error('File proxy error:', error);

      if ((error as any).response && (error as any).response.status === 404) {
        res.status(404).json({
          error: 'File not found',
          message: 'The requested file does not exist'
        });
      } else {
        res.status(500).json({
          error: 'File retrieval failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  });

  // Increment downloads (called when user downloads a book)
  app.post('/api/books/:id/download', async (req: AuthRequest, res) => {
    try {
      const book = await storage.getBookById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      await storage.incrementDownloads(req.params.id);

      // Track download for logged-in users
      if (req.session?.userId) {
        const { getDB } = await import('./mongodb');
        const db = await getDB();
        await db.collection('user_downloads').insertOne({
          userId: req.session.userId,
          username: req.session.username,
          bookId: req.params.id,
          bookTitle: book.title,
          downloadedAt: new Date()
        });
      }

      // Use original Catbox URL directly
      const originalCatboxUrl = book.fileUrl;

      res.json({
        success: true,
        fileUrl: originalCatboxUrl,
        fileName: book.fileName
      });
    } catch (error) {
      console.error('Download increment error:', error);
      res.status(500).json({ error: 'Failed to process download' });
    }
  });

  // Get user's download history
  app.get('/api/auth/my-downloads', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { getDB } = await import('./mongodb');
      const db = await getDB();
      const downloads = await db.collection('user_downloads')
        .find({ userId: req.session.userId })
        .sort({ downloadedAt: -1 })
        .limit(50)
        .toArray();

      res.json(downloads);
    } catch (error) {
      console.error('Get downloads error:', error);
      res.status(500).json({ error: 'Failed to fetch downloads' });
    }
  });

  // Get user's uploaded books
  app.get('/api/books/my-uploads', async (req: AuthRequest, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const books = await storage.getBooksByUsername(req.session.username!);
      res.json(books);
    } catch (error) {
      console.error('Error fetching user uploads:', error);
      res.status(500).json({ error: 'Failed to fetch uploads' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}