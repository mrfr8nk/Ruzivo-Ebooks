import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Upload, User, BookOpen } from "lucide-react";
import BookCard from "@/components/BookCard";
import type { Book } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  // Get user's books
  const { data: myBooks = [], isLoading: isLoadingBooks } = useQuery<Book[]>({
    queryKey: ['/api/auth/my-books'],
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoadingUser && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to access your dashboard",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [user, isLoadingUser, setLocation, toast]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-sky-950 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-600 dark:border-sky-700 dark:border-t-sky-400"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-sky-950 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-2 border-sky-200/50 dark:border-sky-700/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome, {user.username}!
                    </h1>
                    <p className="text-muted-foreground">Manage your uploads and account</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setLocation('/upload')}
                    className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                    data-testid="button-upload"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Book
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2 border-2 border-sky-300 dark:border-sky-700"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-2 border-sky-200/50 dark:border-sky-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                {myBooks.length}
              </div>
              <p className="text-xs text-muted-foreground">Books you've uploaded</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-2 border-sky-200/50 dark:border-sky-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {myBooks.reduce((sum, book) => sum + book.downloads, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Times your books were downloaded</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-2 border-sky-200/50 dark:border-sky-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Username</CardTitle>
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {user.username}
              </div>
              <p className="text-xs text-muted-foreground">Your credit name</p>
            </CardContent>
          </Card>
        </div>

        {/* My Books */}
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-2 border-sky-200/50 dark:border-sky-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">My Uploads</CardTitle>
              <Badge variant="outline" className="text-lg px-4 py-1">
                {myBooks.length} {myBooks.length === 1 ? 'Book' : 'Books'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingBooks ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-200 border-t-sky-600 dark:border-sky-700 dark:border-t-sky-400"></div>
                <p className="mt-4 text-muted-foreground">Loading your books...</p>
              </div>
            ) : myBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-semibold text-muted-foreground mb-2">No uploads yet</p>
                <p className="text-muted-foreground mb-4">Start sharing your knowledge with the community</p>
                <Button
                  onClick={() => setLocation('/upload')}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Your First Book
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myBooks.map((book) => (
                  <BookCard key={book._id} id={book._id!} {...book} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
