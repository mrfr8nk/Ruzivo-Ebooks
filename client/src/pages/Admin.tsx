import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users, Download, Trash2, TrendingUp, Calendar, Clock, BarChart3, PieChart, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Admin() {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [stats, setStats] = useState<any>(null);
  const [filterBookType, setFilterBookType] = useState<string>("all");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(true);
        loadStats();
        toast({ title: "Login successful" });
      } else {
        toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Login failed", variant: "destructive" });
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadStats();
      const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/admin/books/${bookId}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        toast({ title: "Book deleted successfully" });
        await loadStats();
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.error || "Failed to delete book", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete book", variant: "destructive" });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-sky-950 px-4">
        <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </CardContent>
          </Card>
        </div>
    );
  }

  const bookTypes = stats?.bookTypeDistribution ? Object.keys(stats.bookTypeDistribution) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-sky-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Monitor and manage your platform</p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Logout</Button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-sky-200/50 hover:border-sky-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-5 w-5 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-600">{stats?.totalBooks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Available in library</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200/50 hover:border-blue-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.totalDownloads || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-semibold">{stats?.todayDownloads || 0}</span> today
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200/50 hover:border-purple-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats?.totalVisitors || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time unique visits</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200/50 hover:border-green-300 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
              <Activity className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.todayVisitors || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active in last 24h</p>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-sky-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-sky-500" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sky-600">{stats?.weekVisitors || 0}</div>
              <p className="text-sm text-muted-foreground">visitors this week</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-blue-500" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.monthVisitors || 0}</div>
              <p className="text-sm text-muted-foreground">visitors this month</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Avg. Daily
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.dailyVisitors ? Math.round(stats.dailyVisitors.reduce((a: number, b: any) => a + b.visitors, 0) / 7) : 0}
              </div>
              <p className="text-sm text-muted-foreground">visitors per day (7d avg)</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-sky-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Book Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.bookTypeDistribution && Object.entries(stats.bookTypeDistribution).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <span className="text-sm font-bold text-sky-600">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.levelDistribution && Object.entries(stats.levelDistribution).map(([level, count]: [string, any]) => (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-sm">{level}</span>
                    <span className="text-sm font-bold text-blue-600">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.curriculumDistribution && Object.entries(stats.curriculumDistribution).map(([curriculum, count]: [string, any]) => (
                  <div key={curriculum} className="flex items-center justify-between">
                    <span className="text-sm">{curriculum}</span>
                    <span className="text-sm font-bold text-purple-600">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Trend Chart */}
        <Card className="mb-8 border-2 border-sky-200/50">
          <CardHeader>
            <CardTitle>Daily Visitor Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {stats?.dailyVisitors?.map((day: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs text-muted-foreground">{day.visitors}</div>
                  <div 
                    className="w-full bg-gradient-to-t from-sky-500 to-blue-400 rounded-t-lg transition-all hover:from-sky-600 hover:to-blue-500"
                    style={{ 
                      height: `${Math.max((day.visitors / Math.max(...stats.dailyVisitors.map((d: any) => d.visitors))) * 100, 5)}%` 
                    }}
                  />
                  <div className="text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Downloaded Books */}
        <Card className="border-2 border-sky-200/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Most Downloaded Books</span>
              <div className="flex items-center gap-2">
                <Label>Filter by Type:</Label>
                <Select value={filterBookType} onValueChange={setFilterBookType}>
                  <SelectTrigger className="w-40 border-sky-200 focus:border-sky-400">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {bookTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.mostDownloadedBooks?.filter((book: any) => 
                filterBookType === "all" || book.bookType === filterBookType
              ).map((book: any, index: number) => (
                <div key={book._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-800 dark:to-sky-900 rounded-lg border border-sky-200/50 hover:border-sky-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-sm text-muted-foreground">{book.author} • {book.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-sky-600">{book.downloads}</p>
                      <p className="text-xs text-muted-foreground">downloads</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBook(book._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {stats?.mostDownloadedBooks?.filter((book: any) => 
                filterBookType === "all" || book.bookType === filterBookType
              ).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No books found for the selected type</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}