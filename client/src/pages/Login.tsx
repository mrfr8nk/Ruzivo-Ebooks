import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });

      // Set user data in cache before redirecting
      queryClient.setQueryData(['/api/auth/me'], data.user);
      
      // Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setLocation('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-sky-950 dark:to-blue-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-2 border-sky-200/50 dark:border-sky-700/50 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Student Login
          </CardTitle>
          <CardDescription>Login to upload and manage your books</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                disabled={isLoading}
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                disabled={isLoading}
                data-testid="input-password"
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading} data-testid="button-login">
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setLocation('/signup')}
                className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
              >
                Sign up here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
