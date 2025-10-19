import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'ur'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ur: 'اردو',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  // Import all translation files
  const [
    common,
    quran,
    hadith,
    salah,
    duas,
    names,
    stories,
    home,
    analytics,
    books,
  ] = await Promise.all([
    import(`../locales/${locale}/common.json`),
    import(`../locales/${locale}/quran.json`),
    import(`../locales/${locale}/hadith.json`),
    import(`../locales/${locale}/salah.json`),
    import(`../locales/${locale}/duas.json`),
    import(`../locales/${locale}/names.json`),
    import(`../locales/${locale}/stories.json`),
    import(`../locales/${locale}/home.json`),
    import(`../locales/${locale}/analytics.json`),
    import(`../locales/${locale}/books.json`),
  ]);

  return {
    messages: {
      ...common.default,
      quran: quran.default,
      hadith: hadith.default,
      salah: salah.default,
      duas: duas.default,
      names: names.default,
      stories: stories.default,
      home: home.default,
      analytics: analytics.default,
      books: books.default,
    },
  };
});
