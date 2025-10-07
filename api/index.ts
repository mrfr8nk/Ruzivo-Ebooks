
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import createMemoryStore from "memorystore";
import { connectToMongoDB } from "../server/mongodb";
import { initializeAdmin } from "../server/admin";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const MemoryStore = createMemoryStore(session);
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'ruzivo-ebooks-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return;
  
  try {
    await connectToMongoDB();
    await initializeAdmin();
    await registerRoutes(app);
    isInitialized = true;
  } catch (error) {
    console.error("Initialization error:", error);
    throw error;
  }
}

// For Vercel serverless
export default async (req: Request, res: Response) => {
  await initializeApp();
  return app(req, res);
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  initializeApp().then(() => {
    console.log("API initialized for local development");
  });
}
