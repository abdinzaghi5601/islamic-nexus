import Link from 'next/link';
import { Heart, BookOpen, Github, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold gradient-text">Islamic Nexus</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your comprehensive Islamic knowledge platform with Quran, Hadith, Duas, and more.
              Built with love and dedication to spreading authentic Islamic knowledge.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/quran"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Read Quran
                </Link>
              </li>
              <li>
                <Link
                  href="/hadith"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse Hadith
                </Link>
              </li>
              <li>
                <Link
                  href="/duas"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Islamic Duas
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & About */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">About & Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5" />
                  Our Story & Dedication
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/abdinzaghi5601/islamic-nexus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@islamic-nexus.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 pt-6">
          {/* Dedication Notice */}
          <div className="text-center mb-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group"
            >
              <Heart className="w-4 h-4 text-primary group-hover:animate-pulse-glow" />
              <span>
                Built in loving memory of our beloved grandparents{' '}
                <span className="font-arabic text-primary">رَحِمَهُمَا ٱللَّٰهُ</span>
              </span>
            </Link>
          </div>

          {/* Copyright & Credits */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>
              © {currentYear} Islamic Nexus. All rights reserved. | Built as Sadaqah Jariyah
            </p>
            <p className="italic">
              "Indeed, to Allah we belong and to Him we shall return" (Quran 2:156)
            </p>
          </div>

          {/* Technology Notice */}
          <div className="text-center mt-4 pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground">
              Powered by Next.js, Prisma, and PostgreSQL |{' '}
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Built with Claude Code
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
