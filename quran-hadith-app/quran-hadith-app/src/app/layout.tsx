import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri, Scheherazade_New, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import SessionProvider from "@/components/SessionProvider";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Amiri - Classical Arabic font with excellent Quranic text support
const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
});

// Scheherazade New - Uthmani-style font designed for Arabic text
const scheherazade = Scheherazade_New({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-scheherazade",
});

// Noto Nastaliq Urdu - Beautiful Urdu font
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-urdu",
});

export const metadata: Metadata = {
  title: "Islamic Library - Quran & Hadith",
  description: "Your comprehensive Islamic knowledge base with complete Quran translations, tafsir, and authentic Hadith collections from the six major books",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale = 'en' } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${scheherazade.variable} ${notoNastaliqUrdu.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>
            <ScrollToAnchor />
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
