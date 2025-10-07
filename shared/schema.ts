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
  author: z.string().min(1, "Author name is required"),
  bookType: z.enum(["Textbook", "Past Exam Paper", "Greenbook", "Bluebook", "Syllabus"]),
  curriculum: z.enum(["ZIMSEC", "Cambridge", "Other"]),
  level: z.enum(["O-Level", "A-Level"]),
  form: z.string().min(1, "Form/Grade is required"),
  year: z.string().optional(), // For past exam papers
  examSession: z.enum(["June", "October", "N/A"]).optional(),
  description: z.string().min(1, "Description is required"),
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
