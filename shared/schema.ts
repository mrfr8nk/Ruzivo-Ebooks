import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Book metadata schema (stored in MongoDB via MONGO_URI)
export const bookMetadataSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Book title is required"),
  author: z.string().optional(),
  bookType: z.enum(["Textbook", "Past Exam Paper", "Greenbook", "Bluebook", "Syllabus"]).optional(),
  curriculum: z.enum(["ZIMSEC", "Cambridge", "Other"]).optional(),
  level: z.enum(["O-Level", "A-Level"]).optional(),
  form: z.string().optional(),
  year: z.string().optional(), // For past exam papers
  examSession: z.enum(["June", "October", "N/A"]).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number().positive(),
  coverUrl: z.string().optional(),
  downloads: z.number().default(0),
  uploadedBy: z.string().min(1, "Username is required"),
  uploadedAt: z.date().default(() => new Date()),
});

export const insertBookSchema = bookMetadataSchema.omit({ 
  _id: true, 
  downloads: true, 
  uploadedAt: true,
  fileUrl: true,
  fileName: true,
  fileSize: true,
});

export type BookMetadata = z.infer<typeof bookMetadataSchema>;
export type InsertBook = z.infer<typeof insertBookSchema>;
