'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Map of route segments to readable names
const segmentNames: Record<string, string> = {
  quran: 'Quran',
  hadith: 'Hadith',
  duas: 'Duas',
  books: 'Books',
  names: "Names of Allah",
  stories: 'Stories',
  search: 'Search',
  admin: 'Admin',
  study: 'Study',
  chapter: 'Chapter',
  upload: 'Upload',
  archive: 'Archive',
  create: 'Create',
};

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  // If custom items provided, use those
  if (items && items.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
        <ol className="flex items-center gap-2 flex-wrap text-sm">
          {items.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <li>
                {item.current ? (
                  <span className="font-medium text-foreground">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
    );
  }

  // Auto-generate breadcrumbs from pathname
  if (!pathname || pathname === '/') {
    return null; // Don't show breadcrumbs on home page
  }

  const segments = pathname.split('/').filter(Boolean);

  // Don't show if only one segment and it's a main page
  if (segments.length === 1) {
    return null;
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Try to get a readable name for the segment
    let label = segmentNames[segment] || segment;

    // If it's a number, it might be an ID - try to make it more readable
    if (!isNaN(Number(segment))) {
      // For Quran surah numbers
      if (segments[index - 1] === 'quran' && index === 1) {
        label = `Surah ${segment}`;
      }
      // For Hadith book IDs
      else if (segments[index - 1] === 'hadith' && index === 1) {
        label = `Book ${segment}`;
      }
      // For chapter IDs
      else if (segments[index - 1] === 'chapter') {
        label = `Chapter ${segment}`;
      }
      // For any other numeric segment
      else {
        label = segment;
      }
    }

    // Capitalize first letter if not already formatted
    if (label === segment && label.length > 0) {
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }

    breadcrumbItems.push({
      label,
      href: currentPath,
      current: index === segments.length - 1,
    });
  });

  return (
    <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap text-sm bg-muted/30 rounded-lg px-4 py-3 backdrop-blur-sm">
        {breadcrumbItems.map((item, index) => (
          <Fragment key={item.href}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <li className="flex items-center gap-2">
              {index === 0 && <Home className="h-4 w-4 text-muted-foreground" />}
              {item.current ? (
                <span className="font-semibold text-foreground">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
