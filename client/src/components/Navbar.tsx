
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Upload, Menu, X, Moon, Sun, BookOpen, Settings, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check if user is logged in
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#001F3F] to-[#003366] backdrop-blur-lg border-b border-sky-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex items-center gap-3 hover-elevate rounded-xl px-4 py-2 transition-all duration-300 hover:bg-white/10 group" data-testid="link-home">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none text-white group-hover:text-sky-200 transition-colors">Ruzivo Ebooks</span>
              <span className="text-xs text-sky-300 leading-none">by Darrell Mucheri</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-300 group-hover:text-sky-200 transition-colors" />
              <Input
                type="search"
                placeholder="Search books, authors..."
                className="pl-11 h-12 bg-white/10 hover:bg-white/15 border-sky-500/30 hover:border-sky-400/50 text-white placeholder:text-sky-200/70 focus:bg-white/20 transition-all duration-300 rounded-xl"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/developer">
              <Button
                variant="ghost"
                className="text-sky-200 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl text-sm font-medium"
                data-testid="button-contact"
              >
                Contact Us
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                variant="ghost"
                size="icon"
                className="text-sky-200 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl"
                data-testid="button-admin"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleDarkMode}
              className="text-sky-200 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl"
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="gap-2 text-sky-200 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl" data-testid="button-dashboard">
                    <User className="w-4 h-4" />
                    {user.username}
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg hover:shadow-sky-500/50 transition-all duration-300 hover:scale-105 rounded-xl font-semibold" data-testid="button-upload">
                    <Upload className="w-4 h-4" />
                    Upload Book
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="gap-2 text-sky-200 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl" data-testid="button-login">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg hover:shadow-sky-500/50 transition-all duration-300 hover:scale-105 rounded-xl font-semibold" data-testid="button-signup">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-sky-200 hover:text-white hover:bg-white/10 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-sky-500/20 animate-slide-in-down">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300" />
                <Input
                  type="search"
                  placeholder="Search books..."
                  className="pl-10 bg-white/10 border-sky-500/30 text-white placeholder:text-sky-200/70 rounded-xl"
                  data-testid="input-search-mobile"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleDarkMode}
                  className="text-sky-200 hover:text-white hover:bg-white/10 rounded-xl"
                  data-testid="button-theme-toggle-mobile"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <Link href="/developer" className="flex-1">
                  <Button variant="outline" className="w-full gap-2 border-sky-400/30 text-sky-200 hover:bg-white/10 rounded-xl" data-testid="button-contact-mobile">
                    Contact
                  </Button>
                </Link>
                <Link href="/upload" className="flex-1">
                  <Button className="w-full gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl font-semibold" data-testid="button-upload-mobile">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
