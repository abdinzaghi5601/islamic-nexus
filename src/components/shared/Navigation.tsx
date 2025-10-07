'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Library, Search, Heart, Book, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [adminOpen, setAdminOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home', icon: BookOpen },
    { href: '/quran', label: 'Quran', icon: BookOpen },
    { href: '/hadith', label: 'Hadith', icon: Library },
    { href: '/duas', label: 'Duas', icon: Heart },
    { href: '/books', label: 'Books', icon: Book },
    { href: '/search', label: 'Search', icon: Search },
  ];

  const adminLinks = [
    { href: '/admin/duas/create', label: 'Add Dua' },
    { href: '/admin/books/upload', label: 'Upload Book' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent group-hover:shadow-lg transition-all duration-300">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">Islamic Library</span>
          </Link>

          <div className="flex items-center space-x-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname.startsWith('/admin')
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
              </button>

              {adminOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-background shadow-lg">
                  {adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAdminOpen(false)}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
