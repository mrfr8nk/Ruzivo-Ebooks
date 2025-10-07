
import { Search, Upload, BookOpen, TrendingUp, Users, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#004C8C]">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzBoLTZWMThoMTJ2MTJoLTZ2LTZabTAgMGgtNnYxMmgxMlYzMGgtNnYtNlptLTEyIDBIMTh2MTJoMTJWMzBoLTZ2LTZabS0xMiAwSDZ2MTJoMTJWMzBoLTZ2LTZabTI0LTEyaDZWNmgtMTJ2MTJoNnYtNlptMTIgMGg2VjZoLTEydjEyaDZ2LTZabS0yNCAwaDZWNmgtMTJ2MTJoNnYtNlptLTEyIDBoNlY2SDB2MTJoNnYtNloiLz48L2c+PC9nPjwvc3ZnPg==')] animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/30 backdrop-blur-sm animate-slide-in-down">
            <BookOpen className="w-4 h-4 text-sky-300" />
            <span className="text-sm font-medium text-sky-100">Your Complete Study Resource</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-slide-in-up" data-testid="heading-hero">
            Master Your Studies with
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              ZIMSEC & Cambridge
            </span>
            <br />
            Educational Resources
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-sky-100/90 max-w-3xl mx-auto animate-fade-in" data-testid="text-hero-description">
            Access comprehensive O-Level and A-Level ebooks curated by students, for students
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-scale-in">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 transition-all group-hover:text-sky-500" />
              <Input
                placeholder="Search for books, authors, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 backdrop-blur-xl bg-white/95 border-2 border-white/30 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-sky-400 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-xl"
                data-testid="input-search"
              />
            </div>
            <Link href="/upload">
              <Button size="lg" className="gap-2 h-14 px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 hover:scale-105 rounded-xl font-semibold" data-testid="button-upload">
                <Upload className="w-5 h-5" />
                Upload Book
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-in-up">
            {[
              { label: "Total Books", value: "500+", icon: BookOpen, color: "from-sky-400 to-blue-500" },
              { label: "Downloads", value: "10K+", icon: Download, color: "from-blue-400 to-cyan-500" },
              { label: "Active Students", value: "2K+", icon: Users, color: "from-cyan-400 to-sky-500" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={i} 
                  className="group backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20 cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-sky-200 transition-colors">{stat.value}</div>
                  <div className="text-sky-100/80 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="currentColor" className="text-background"/>
        </svg>
      </div>
    </div>
  );
}
