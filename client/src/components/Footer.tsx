import { BookOpen, Mail, Github, Linkedin, Heart, ExternalLink, TrendingUp, Users, Download } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
  const { data: books = [] } = useQuery<any[]>({
    queryKey: ['/api/books'],
  });

  const totalBooks = books.length;
  const totalDownloads = books.reduce((sum, book) => sum + (book.downloads || 0), 0);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-sky-950 text-white mt-20 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-sky-700/30">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="font-bold text-2xl bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                  MasterMinds Ebooks
                </div>
                <div className="text-xs text-sky-400">by Darrell Mucheri</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Empowering ZIMSEC students with accessible, high-quality educational resources for O-Level and A-Level success.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Mail, href: "#", label: "Email" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="p-3 bg-sky-900/40 hover:bg-sky-700/60 border border-sky-700/30 hover:border-sky-500/50 rounded-lg transition-all duration-300 hover:scale-110 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-6 text-sky-300">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home", testid: "link-footer-home" },
                { to: "/upload", label: "Upload Book", testid: "link-footer-upload" },
                { to: "/contact", label: "Contact Us", testid: "link-footer-contact" },
                { to: "/about", label: "About", testid: "link-footer-about" },
                { to: "/privacy", label: "Privacy Policy", testid: "link-footer-privacy" },
                { to: "/terms", label: "Terms of Service", testid: "link-footer-terms" },
                { to: "/donations", label: "Donate", testid: "link-footer-donate" }
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.to}
                    className="text-gray-400 hover:text-sky-300 transition-colors duration-200 flex items-center gap-2 group"
                    data-testid={link.testid}
                  >
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-6 text-sky-300">Resources</h3>
            <ul className="space-y-3">
              {[
                { to: "/o-level", label: "O-Level Materials", testid: "link-footer-olevel" },
                { to: "/a-level", label: "A-Level Materials", testid: "link-footer-alevel" },
                { to: "/past-papers", label: "Past Exam Papers", testid: "link-footer-pastpapers" },
                { to: "/study-guides", label: "Study Guides", testid: "link-footer-studyguides" },
                { to: "/syllabus", label: "Syllabus Documents", testid: "link-footer-syllabus" },
                { to: "/faq", label: "FAQ", testid: "link-footer-faq" }
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.to}
                    className="text-gray-400 hover:text-sky-300 transition-colors duration-200 flex items-center gap-2 group"
                    data-testid={link.testid}
                  >
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Live Stats */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-6 text-sky-300">Platform Stats</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-sky-900/40 to-blue-900/40 border border-sky-700/30 rounded-xl hover:border-sky-500/50 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">Total Books</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                  {totalBooks}+
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Download className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">Downloads</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  {totalDownloads.toLocaleString()}+
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-700/30 rounded-xl hover:border-indigo-500/50 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">Active Students</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  2K+
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © 2024 MasterMinds Ebooks. All rights reserved.
            </p>
            <p className="text-sky-400 text-sm mt-1 flex items-center gap-2 justify-center md:justify-start">
              Made with <Heart className="w-4 h-4 text-red-400 animate-pulse" /> by Darrell Mucheri
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Helping students excel since 2024</span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600"></div>
    </footer>
  );
}