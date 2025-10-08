
# MasterMinds Ebooks - Educational Platform

![MasterMinds Ebooks](https://img.shields.io/badge/Education-ZIMSEC-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)
![Express](https://img.shields.io/badge/Express-4.21-000000)

## Overview

MasterMinds Ebooks is a comprehensive educational platform designed specifically for ZIMSEC (Zimbabwe Schools Examination Council) students. The platform provides accessible O-Level and A-Level study resources, enabling students to discover, browse, and download educational ebooks while allowing contributors to upload and share educational materials.

## Features

### For Students
- 📚 **Extensive Library**: Access O-Level and A-Level ebooks, study guides, past papers, and syllabus materials
- 🔍 **Smart Search**: Find books by title, author, subject, or level
- 📱 **Mobile-First Design**: Optimized for smartphones and tablets
- 📥 **Easy Downloads**: Download books with custom watermarking ("Downloaded from MasterMinds Ebooks")
- 🎯 **Category Filters**: Browse by level (O-Level/A-Level), form, and subject
- 🔥 **Trending Books**: Discover popular study materials
- 📊 **Download Statistics**: See which books are most helpful to other students

### For Contributors
- ⬆️ **Upload Books**: Share educational materials with the community
- 📝 **Multiple Uploads**: Upload multiple books at once
- 🖼️ **Cover Images**: Add custom cover images to your uploads
- 🏷️ **Tagging System**: Categorize books with subjects and forms
- 👤 **Attribution**: Your username appears on uploaded books

### For Administrators
- 🎛️ **Admin Dashboard**: Manage books, users, and platform statistics
- 📈 **Analytics**: Track downloads, trending books, and top uploaders
- 🗑️ **Content Moderation**: Remove inappropriate or duplicate content

## Technology Stack

### Frontend
- **React 18.3** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library (Radix UI primitives)
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation

### Backend
- **Express.js** on Node.js
- **MongoDB** for data storage
- **Supabase Storage** for file hosting
- **Multer** for file uploads
- **Express Session** for authentication
- **bcryptjs** for password hashing

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for production bundling
- **Drizzle ORM** with Zod schemas
- **Replit** development environment

## Getting Started

### Prerequisites
This project runs on Replit and requires:
- Node.js 19.x or higher
- MongoDB connection
- Supabase account for file storage

### Installation

1. **Clone or Fork this Repl**
   ```bash
   # The project is ready to run on Replit
   ```

2. **Configure Environment Variables**
   Set up the following in Replit Secrets:
   - `DATABASE_URL` - MongoDB connection string
   - `SUPABASE_URL` - Supabase project URL
   - `SUPABASE_KEY` - Supabase anon/public key
   - `SESSION_SECRET` - Random string for session encryption

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at the Replit preview URL.

### Deployment

To deploy your MasterMinds Ebooks instance:
1. Click the **Run** button to start the application
2. Use Replit's **Deployments** feature to publish your site
3. Configure custom domain if needed (optional)

## Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and API client
├── server/                 # Backend Express application
│   ├── routes.ts          # API route handlers
│   ├── mongodb.ts         # Database connection
│   ├── supabase.ts        # File storage integration
│   └── admin.ts           # Admin functionality
├── shared/                # Shared types and schemas
└── attached_assets/       # Static assets and images
```

## Usage

### For Students
1. **Browse Books**: Visit the homepage to see trending and most downloaded books
2. **Search**: Use the search bar to find specific topics or subjects
3. **Filter**: Click on O-Level or A-Level to filter by education level
4. **Download**: Click the download button on any book card
5. **Study Guides**: Visit `/study-guides` for comprehensive textbooks
6. **Past Papers**: Visit `/past-papers` for exam practice materials

### For Uploaders
1. **Create Account**: Sign up with a username and password
2. **Login**: Access your account
3. **Upload Books**: Click "Upload Book" in the navigation
4. **Fill Details**: Provide title, author, level, form, description, and tags
5. **Add Cover**: Upload a cover image (optional)
6. **Select Files**: Choose one or multiple PDF/EPUB files
7. **Submit**: Your books will be processed and made available

### For Administrators
1. **Login as Admin**: Use admin credentials
2. **Access Dashboard**: Visit `/admin` for the admin panel
3. **View Statistics**: Monitor platform usage and top contributors
4. **Manage Content**: Delete books or manage users as needed

## API Endpoints

### Public Endpoints
- `GET /api/books` - Get all books with optional filters
- `GET /api/books/trending` - Get trending books
- `GET /api/books/most-downloaded` - Get most downloaded books
- `GET /api/books/:id/download` - Download a book
- `GET /api/top-uploaders` - Get top contributors

### Protected Endpoints (Require Authentication)
- `POST /api/books/upload` - Upload new book(s)
- `GET /api/auth/me` - Get current user info
- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `POST /api/logout` - User logout

### Admin Endpoints
- `GET /api/admin/stats` - Platform statistics
- `DELETE /api/admin/books/:id` - Delete a book
- `GET /api/admin/users` - Get all users

## Design Principles

MasterMinds Ebooks follows a hybrid educational design approach:
- **Clean Interface**: Distraction-free learning environment
- **Visual Hierarchy**: Easy content discovery
- **Mobile-First**: Optimized for student accessibility
- **Trust-Building**: Professional aesthetics for academic credibility
- **Accessibility**: WCAG compliant with screen reader support

## Contributing

We welcome contributions! Here's how you can help:
1. Fork this Repl
2. Make your improvements
3. Test thoroughly
4. Share your fork or submit suggestions

## License

This project is open source and available for educational purposes.

## Support

For issues, questions, or suggestions:
- Open an issue on this Repl
- Contact the developer via the Contact page
- Check the FAQ page for common questions

## Credits

**Created by**: Darrell Mucheri  
**Platform**: Built on Replit  
**Purpose**: Supporting ZIMSEC students with accessible educational resources

---

## Quick Links

- [Home](/) - Browse all books
- [O-Level](/o-level) - O-Level resources
- [A-Level](/a-level) - A-Level resources
- [Study Guides](/study-guides) - Textbooks and guides
- [Past Papers](/past-papers) - Exam practice
- [Upload](/upload) - Share your books
- [About](/about) - Learn more about the platform

## Version

**Current Version**: 1.0.0  
**Last Updated**: 2024

---

Made with ❤️ for ZIMSEC students
