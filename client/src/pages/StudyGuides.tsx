import { Book, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import type { BookMetadata } from "@shared/schema";

export default function StudyGuides() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: books = [], isLoading } = useQuery<BookMetadata[]>({
    queryKey: ['/api/books'],
  });

  const studyGuides = books.filter(book => 
    book.bookType === "Textbook" || 
    book.bookType === "Greenbook" || 
    book.bookType === "Bluebook"
  );
  const filteredBooks = studyGuides.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl mb-6">
            <Book className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Study Guides
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive study guides, textbooks, greenbooks and bluebooks
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search study guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12"
              data-testid="input-search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading study guides...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No study guides found.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book._id} className="p-6 hover-elevate" data-testid={`card-book-${book._id}`}>
                {book.coverUrl && (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-bold text-lg mb-2" data-testid={`text-title-${book._id}`}>{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs rounded">
                    {book.bookType}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                    {book.level}
                  </span>
                </div>
                <Link href={`/?bookId=${book._id}`}>
                  <a className="text-sky-600 hover:text-sky-700 text-sm font-semibold" data-testid={`link-view-${book._id}`}>
                    View Details →
                  </a>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
