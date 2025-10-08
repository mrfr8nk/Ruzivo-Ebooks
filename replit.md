# MasterMinds Ebooks - Educational Platform

## Overview

MasterMinds Ebooks is an educational platform designed to provide ZIMSEC (Zimbabwe Schools Examination Council) students with accessible O-Level and A-Level study resources. The platform enables students to discover, browse, and download educational ebooks while also allowing contributors to upload and share educational materials. Built with a focus on clarity, accessibility, and academic credibility, the application features a clean, distraction-free learning environment optimized for mobile-first student usage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, utilizing Vite as the build tool and development server
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **UI Components**: shadcn/ui component library built on Radix UI primitives, providing accessible and customizable components
- **Styling**: Tailwind CSS with custom design system following education-focused principles
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

**Design Philosophy**: The UI follows a hybrid educational design approach inspired by modern platforms like Coursera and Khan Academy, prioritizing:
- Clean, distraction-free learning environment
- Strong visual hierarchy for content discovery
- Mobile-first responsive design
- Trust-building aesthetics for academic credibility

### Backend Architecture
- **Server Framework**: Express.js running on Node.js
- **API Structure**: RESTful API pattern with organized route handlers
- **File Upload**: Multer middleware for handling multipart/form-data file uploads (PDF and EPUB)
- **Storage Interface**: Abstract storage interface (IStorage) allowing flexibility between in-memory and database implementations
- **Build Process**: esbuild for production bundling with ESM output format

**Key Backend Routes**:
- `/api/books/upload` - Handles book file and metadata upload
- `/api/books/trending` - Retrieves trending books
- `/api/books/most-downloaded` - Retrieves most downloaded books
- `/api/books/:id/download` - Handles book download and analytics

### Data Architecture
- **Schema Definition**: Drizzle ORM with Zod validation schemas in shared directory
- **Database**: PostgreSQL configured via Drizzle with Neon serverless driver
- **Type Safety**: Full type inference from database schema to frontend using shared types
- **Data Models**:
  - Users table (PostgreSQL): Authentication and user management
  - Book metadata schema: Title, author, level (O-Level/A-Level), form, file URLs, download counts, upload timestamps

**Storage Strategy**: The application uses an abstracted storage pattern with an in-memory implementation (MemStorage) that can be swapped for database-backed storage, demonstrating flexibility in data persistence approaches.

### File Storage & Management
- **File Storage Provider**: Custom CDN service powered by Catbox (https://catboxcdn.onrender.com)
- **CDN Architecture**: Self-hosted proxy CDN that uploads files to Catbox.moe and serves them through custom domain
- **Upload Flow**: 
  1. Files uploaded via Multer to memory
  2. Processed and validated on server
  3. Uploaded to custom CDN with unique timestamped filenames
  4. Public CDN URLs generated and stored in MongoDB
- **File Constraints**: 500MB upload limit, PDF, EPUB, DOC, DOCX, PPT, and PPTX formats
- **Security**: File type validation, sanitized filenames, public URL generation

### Authentication & Authorization
Currently implements basic user schema with username/password fields, indicating planned authentication system. No active authentication middleware is currently enforced on routes.

## External Dependencies

### Third-Party Services
- **Custom CDN**: Self-hosted CDN proxy service for ebook file hosting and delivery
  - Service URL: `https://catboxcdn.onrender.com`
  - Backend Storage: Catbox.moe cloud file hosting
  - Public file access via CDN proxy URLs
  - Supports files up to 500MB

### Database
- **PostgreSQL**: Primary database via Neon serverless (@neondatabase/serverless)
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Connection**: Environment variable `DATABASE_URL` required

### Key NPM Packages
- **UI Framework**: @radix-ui/* components (20+ component primitives)
- **Data Fetching**: @tanstack/react-query for server state
- **Validation**: Zod for runtime type validation
- **Forms**: React Hook Form with @hookform/resolvers
- **File Handling**: Multer for multipart uploads
- **Styling**: Tailwind CSS with class-variance-authority for variants
- **Build Tools**: Vite, esbuild, TypeScript
- **Fonts**: Google Fonts (Inter, JetBrains Mono)

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
  - @replit/vite-plugin-runtime-error-modal
  - @replit/vite-plugin-cartographer
  - @replit/vite-plugin-dev-banner
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

### Asset Management
Custom asset aliasing configured in Vite for generated images stored in `attached_assets` directory, supporting the educational platform's visual design requirements.