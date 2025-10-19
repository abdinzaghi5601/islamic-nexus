'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { locales, localeNames, type Locale } from '@/i18n';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname if it exists
    const currentLocale = locale;
    let newPathname = pathname;

    // If pathname starts with a locale, remove it
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPathname = pathname.slice(`/${currentLocale}`.length) || '/';
    }

    // Add new locale prefix only if it's not the default
    const finalPath = newLocale === 'en'
      ? newPathname
      : `/${newLocale}${newPathname}`;

    setIsOpen(false);
    router.push(finalPath);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-lg border-2 border-[#d4af37]/20 bg-[#34495e] dark:bg-[#2c3e50] shadow-[0_8px_16px_rgba(0,0,0,0.3)] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-2">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full px-4 py-2 text-sm text-left transition-all duration-300 hover:bg-[#2c3e50] dark:hover:bg-[#1a5f3f] hover:pl-5 ${
                  locale === loc
                    ? 'bg-[#2c3e50] dark:bg-[#1a5f3f] text-[#d4af37] font-semibold'
                    : 'text-white hover:text-[#d4af37]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={loc === 'ur' ? 'font-urdu' : ''}>
                    {localeNames[loc]}
                  </span>
                  {locale === loc && (
                    <span className="ml-auto text-[#d4af37]">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
