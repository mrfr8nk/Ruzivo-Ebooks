import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X, Filter, BookOpen, TrendingUp, Sparkles, Library, Tag } from "lucide-react";
import type { Book } from "@/lib/api";

const SUBJECT_TAGS = [
  "mathematics", "physics", "chemistry", "biology", "english",
  "history", "geography", "commerce", "accounts", "computer-science"
];

const RESOURCE_TYPE_TAGS = [
  "question-paper", "marking-scheme", "syllabus", "textbook", "notes"
];

export default function Home() {
  // Get search query from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearchQuery = urlParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [filterCurriculum, setFilterCurriculum] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterBookType, setFilterBookType] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: allBooks = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredAndSortedBooks = allBooks
    .filter(book => {
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = searchQuery === "" || 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        (book as any).description?.toLowerCase().includes(searchLower) ||
        book.curriculum?.toLowerCase().includes(searchLower) ||
        book.level.toLowerCase().includes(searchLower) ||
        book.form.toLowerCase().includes(searchLower) ||
        ((book as any).tags || []).some((tag: string) => tag.toLowerCase().includes(searchLower));

      const matchesCurriculum = filterCurriculum === "all" || book.curriculum === filterCurriculum;
      const matchesLevel = filterLevel === "all" || book.level === filterLevel;
      const matchesBookType = filterBookType === "all" || (book as any).bookType === filterBookType;

      const bookTags = (book as any).tags || [];
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => bookTags.includes(tag));

      return matchesSearch && matchesCurriculum && matchesLevel && matchesBookType && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case "oldest":
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case "downloads":
          return b.downloads - a.downloads;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const trendingBooks = allBooks
    .filter(book => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(book.uploadedAt) >= weekAgo;
    })
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-sky-950 dark:to-blue-950">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Form Preference Selector */}
        <div className="mb-6 backdrop-blur-xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-2xl p-6 border-2 border-sky-300/50 dark:border-sky-600/50 shadow-lg animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Personalize Your Experience</h3>
                <p className="text-sm text-muted-foreground">Select your form to get tailored book recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full md:w-40 bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 hover:border-sky-400 transition-all rounded-xl h-12 font-medium">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="O-Level">O-Level</SelectItem>
                  <SelectItem value="A-Level">A-Level</SelectItem>
                </SelectContent>
              </Select>
              {filterLevel !== "all" && (
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40 bg-white dark:bg-gray-800 border-2 border-sky-300 dark:border-sky-600 hover:border-sky-400 transition-all rounded-xl h-12 font-medium">
                    <SelectValue placeholder="Select Form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Forms</SelectItem>
                    {filterLevel === "O-Level" ? (
                      <>
                        <SelectItem value="Form 1">Form 1</SelectItem>
                        <SelectItem value="Form 2">Form 2</SelectItem>
                        <SelectItem value="Form 3">Form 3</SelectItem>
                        <SelectItem value="Form 4">Form 4</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Lower 6">Lower 6</SelectItem>
                        <SelectItem value="Upper 6">Upper 6</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div id="search-section" className="mb-12 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-2xl p-6 border-2 border-sky-200/50 dark:border-sky-700/50 shadow-xl animate-slide-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-500" />
              <Input
                id="main-search-input"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-700 focus:border-sky-400 transition-all rounded-xl"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 w-12 backdrop-blur border-2 transition-all duration-300 rounded-xl ${showFilters ? 'bg-sky-500 text-white border-sky-500 hover:bg-sky-600' : 'bg-white dark:bg-gray-800 border-sky-200 dark:border-sky-700 hover:border-sky-400'}`}
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </Button>
          </div>

          {/* Active search term display */}
          {searchQuery && (
            <div className="mb-4 flex items-center gap-2 animate-fade-in">
              <span className="text-sm text-gray-600 dark:text-gray-400">Searching for:</span>
              <Badge variant="secondary" className="gap-2">
                <span className="font-medium">{searchQuery}</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? 'result' : 'results'})
              </span>
            </div>
          )}

          {showFilters && (
            <div className="space-y-6 animate-slide-in-down">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-sky-700 dark:text-sky-300">Book Type</label>
                  <Select value={filterBookType} onValueChange={setFilterBookType}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 transition-all rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Textbook">Textbook</SelectItem>
                      <SelectItem value="Past Exam Paper">Past Exam Paper</SelectItem>
                      <SelectItem value="Greenbook">Greenbook</SelectItem>
                      <SelectItem value="Bluebook">Bluebook</SelectItem>
                      <SelectItem value="Syllabus">Syllabus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 transition-all rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="downloads">Most Downloaded</SelectItem>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-sky-700 dark:text-sky-300">Curriculum</label>
                  <Select value={filterCurriculum} onValueChange={setFilterCurriculum}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 transition-all rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Curricula</SelectItem>
                      <SelectItem value="ZIMSEC">ZIMSEC</SelectItem>
                      <SelectItem value="Cambridge">Cambridge</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-sky-700 dark:text-sky-300">Level</label>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-2 border-sky-200 dark:border-sky-700 hover:border-sky-400 transition-all rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="O-Level">O-Level</SelectItem>
                      <SelectItem value="A-Level">A-Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3 pt-4 border-t border-sky-200 dark:border-sky-700">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-sky-700 dark:text-sky-300 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Filter by Tags
                  </label>
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTags([])}
                      className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
                    >
                      Clear Tags
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Subject</p>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_TAGS.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover-elevate"
                          onClick={() => toggleTag(tag)}
                          data-testid={`tag-${tag}`}
                        >
                          {tag.replace(/-/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Resource Type</p>
                    <div className="flex flex-wrap gap-2">
                      {RESOURCE_TYPE_TAGS.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover-elevate"
                          onClick={() => toggleTag(tag)}
                          data-testid={`tag-${tag}`}
                        >
                          {tag.replace(/-/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">Active filters: {selectedTags.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-lg text-muted-foreground">
              Search results for: <span className="font-semibold text-foreground">"{searchQuery}"</span>
              {filteredAndSortedBooks.length > 0 ? ` (${filteredAndSortedBooks.length} found)` : ' (No results)'}
            </p>
          </div>
        )}

        {/* Trending Section - Carousel */}
        {trendingBooks.length > 0 && (
          <section className="mb-16 animate-fade-in overflow-hidden">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2" data-testid="heading-trending">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                Trending This Week
              </h2>
              <p className="text-muted-foreground">Most popular books among students right now - Swipe to explore</p>
            </div>
            
            {/* Horizontal Scrolling Carousel */}
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide hover:scrollbar-default px-2">
                {trendingBooks.map((book, index) => (
                  <div 
                    key={book._id} 
                    className="flex-shrink-0 w-72 snap-center animate-scale-in hover:scale-105 transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative group">
                      {/* Comic-style card with shadow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                      <div className="relative">
                        <BookCard id={book._id!} {...book} isTrending />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Gradient fade on edges */}
              <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-sky-50 via-sky-50/50 to-transparent dark:from-gray-900 dark:via-gray-900/50 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-sky-50 via-sky-50/50 to-transparent dark:from-gray-900 dark:via-gray-900/50 pointer-events-none"></div>
            </div>
            
            {/* Scroll indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {trendingBooks.slice(0, 8).map((_, index) => (
                <div 
                  key={index}
                  className="w-2 h-2 rounded-full bg-orange-300 dark:bg-orange-600 opacity-50"
                ></div>
              ))}
            </div>
          </section>
        )}

        {/* You May Also Like Section */}
        {allBooks.length > 0 && (
          <section className="mb-16 animate-fade-in">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                Recommended For You
              </h2>
              <p className="text-muted-foreground">Handpicked selections based on your preferences</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allBooks.slice(0, 4).map((book, index) => (
                <div key={book._id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <BookCard id={book._id!} {...book} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Books Section */}
        <section className="animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2" data-testid="heading-all-books">
                  <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl">
                    <Library className="w-7 h-7 text-white" />
                  </div>
                  Complete Library
                  <span className="text-2xl font-semibold text-sky-600 dark:text-sky-400">
                    ({filteredAndSortedBooks.length})
                  </span>
                </h2>
                <p className="text-muted-foreground">Browse our entire collection of educational resources</p>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-600"></div>
              <p className="mt-4 text-muted-foreground">Loading books...</p>
            </div>
          ) : filteredAndSortedBooks.length === 0 ? (
            <div className="text-center py-20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-2xl border-2 border-sky-200/50 dark:border-sky-700/50">
              <p className="text-xl text-muted-foreground">No books found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAndSortedBooks.map((book, index) => (
                <div key={book._id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <BookCard id={book._id!} {...book} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}