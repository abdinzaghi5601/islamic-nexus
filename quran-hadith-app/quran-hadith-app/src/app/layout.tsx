import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import SessionProvider from "@/components/SessionProvider";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { OfflineIndicator } from "@/components/OfflineIndicator";

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

export const metadata: Metadata = {
  title: "Islamic Nexus - Quran & Hadith",
  description: "Your comprehensive Islamic knowledge base with complete Quran translations, tafsir, and authentic Hadith collections from the six major books",
  applicationName: "Islamic Nexus",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Islamic Nexus",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Islamic Nexus",
    title: "Islamic Nexus - Quran & Hadith",
    description: "Your comprehensive Islamic knowledge base with complete Quran translations, tafsir, and authentic Hadith collections",
  },
  twitter: {
    card: "summary",
    title: "Islamic Nexus - Quran & Hadith",
    description: "Your comprehensive Islamic knowledge base with complete Quran translations, tafsir, and authentic Hadith collections",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${scheherazade.variable} antialiased`}
      >
        <SessionProvider>
          <ScrollToAnchor />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <OfflineIndicator />
        </SessionProvider>
      </body>
    </html>
  );
}
