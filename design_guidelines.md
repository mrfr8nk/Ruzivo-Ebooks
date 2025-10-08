# MasterMinds Ebooks - Design Guidelines

## Design Approach

**Selected Approach:** Hybrid - Education-Focused Design System with Modern Visual Appeal

Drawing inspiration from modern educational platforms (Coursera, Khan Academy, Google Classroom) combined with contemporary web design principles. The platform prioritizes clarity, accessibility, and student engagement while maintaining professional aesthetics.

**Core Principles:**
- Clean, distraction-free learning environment
- Strong visual hierarchy for easy content discovery
- Trust-building design for academic credibility
- Mobile-first for student accessibility

---

## Color Palette

### Light Mode
- **Primary Brand:** 220 85% 55% (Deep Blue - academic, trustworthy)
- **Primary Hover:** 220 85% 45%
- **Secondary Accent:** 160 70% 45% (Teal - success, downloads)
- **Background:** 0 0% 98%
- **Surface/Cards:** 0 0% 100%
- **Text Primary:** 220 15% 15%
- **Text Secondary:** 220 10% 45%
- **Border:** 220 15% 88%

### Dark Mode
- **Primary Brand:** 220 85% 65%
- **Primary Hover:** 220 85% 75%
- **Secondary Accent:** 160 70% 55%
- **Background:** 220 18% 10%
- **Surface/Cards:** 220 15% 14%
- **Text Primary:** 220 10% 95%
- **Text Secondary:** 220 10% 65%
- **Border:** 220 15% 22%

### Semantic Colors
- **O-Level Badge:** 45 100% 55% (Orange)
- **A-Level Badge:** 260 80% 60% (Purple)
- **Trending Indicator:** 15 90% 55% (Red-Orange)
- **Download Count:** 160 70% 45% (Teal)

---

## Typography

**Font Family:**
- Primary: 'Inter' (Google Fonts) - clean, modern, highly readable
- Monospace: 'JetBrains Mono' (for metadata, codes)

**Scale:**
- Display (Hero): text-5xl md:text-6xl font-bold (48px/60px desktop)
- H1 (Page Titles): text-4xl font-bold (36px)
- H2 (Section Headers): text-3xl font-semibold (30px)
- H3 (Card Titles): text-xl font-semibold (20px)
- Body: text-base (16px) leading-relaxed
- Small/Meta: text-sm (14px)
- Tiny/Labels: text-xs (12px)

---

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 (cards), p-8 (sections)
- Section spacing: py-16 md:py-24
- Gap between elements: gap-6 or gap-8
- Container max-width: max-w-7xl

**Grid Systems:**
- Book Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Feature Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Upload Form: Single column with max-w-2xl

---

## Component Library

### Navigation
- Fixed top navbar with logo, search bar, and upload CTA
- Transparent background with backdrop blur on scroll
- Mobile: Hamburger menu with slide-in drawer
- Categories dropdown: O-Level/A-Level with form numbers

### Hero Section (Homepage)
- Large hero with gradient background (primary to secondary)
- Heading: "Your Complete ZIMSEC Study Resource" 
- Subheading: "Access O-Level and A-Level ebooks curated by students, for students"
- Search bar (prominent, centered)
- Stats row: Total books, Downloads this month, Active students

### Book Cards
- Aspect ratio: 3:4 for book cover thumbnails
- Shadow: hover:shadow-xl transition
- Badge overlay: Level (O/A) and Form number
- Bottom section: Title, Author, Download count, Trending indicator
- Rounded corners: rounded-lg

### Upload Section
- Multi-step form with progress indicator
- File dropzone with drag-and-drop (prominent dashed border)
- Fields: Book name, Author name, Level dropdown, Form dropdown, Cover upload
- Preview pane showing book card as user fills form

### Trending & Most Downloaded Sections
- Horizontal scrollable carousel on mobile
- Grid layout on desktop
- "Fire" icon for trending books
- Download count with arrow indicator showing trend

### Search & Filters
- Sticky filter bar below nav
- Quick filters: All, O-Level, A-Level, By Subject
- Advanced filters: Form number, Author, Recently added

### Book Detail Page
- Large book cover on left (40% width)
- Metadata on right: Title, Author credits, Level/Form, Description
- Download button (prominent, primary color)
- Related books section at bottom

### Footer
- Three columns: About, Quick Links, Contact
- Creator credit: "Created by Darrell Mucheri"
- Social links and platform stats

---

## Images

**Hero Section:**
- Large background image (1920x800px): Students studying with books/tablets in modern library setting
- Overlay: gradient from primary color (opacity 90%) to transparent
- Alternative: Abstract geometric pattern with education iconography

**Book Covers:**
- Placeholder: 300x400px with subject icon and level badge
- User uploads: Cropped to 3:4 aspect ratio
- Fallback: Gradient background with book title in large typography

**Empty States:**
- Illustration: Stack of books with magnifying glass for "no search results"
- Upload prompt: Cloud upload icon with friendly message

---

## Animations & Interactions

**Micro-interactions:**
- Book cards: scale(1.02) on hover with shadow increase
- Buttons: Smooth color transition on hover (200ms)
- Upload dropzone: Pulsing border on drag-over
- Download button: Success checkmark animation after click

**Page Transitions:**
- Fade in content sections on scroll (subtle, once per session)
- Skeleton loaders for book grids while fetching

**Avoid:**
- Excessive parallax effects
- Distracting background animations
- Auto-playing media

---

## Accessibility

- All form inputs with visible labels
- Color contrast ratio minimum 4.5:1
- Keyboard navigation for all interactive elements
- Screen reader friendly book cards with descriptive alt text
- Focus indicators with primary color ring
- Dark mode toggle in user preferences

---

## Responsive Breakpoints

- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full grid layouts, sidebar filters)