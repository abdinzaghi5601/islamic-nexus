import Link from 'next/link';
import { BookOpen, Library, Search, BookMarked } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Complete Quran',
      description: '114 Surahs with 4 English translations and 2 comprehensive tafsirs',
      icon: BookOpen,
      href: '/quran',
      stats: '6,236 Ayahs',
    },
    {
      title: 'Hadith Collections',
      description: 'The six major hadith books with Arabic and English text',
      icon: Library,
      href: '/hadith',
      stats: '34,532 Hadiths',
    },
    {
      title: 'Tafsir Commentary',
      description: 'Scholarly interpretations from Ibn Kathir and Maarif-ul-Quran',
      icon: BookMarked,
      href: '/quran',
      stats: '12,472 Verses',
    },
    {
      title: 'Search Everything',
      description: 'Search across Quran, Hadith, and Tafsir in both Arabic and English',
      icon: Search,
      href: '/search',
      stats: 'Full-text Search',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Quran & Hadith</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive Islamic knowledge base with the complete Quran, Hadith collections, and Tafsir commentary
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              href={feature.href}
              className="group p-6 border rounded-lg hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">{feature.description}</p>
                  <p className="text-sm font-medium text-primary">{feature.stats}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold">114</div>
          <div className="text-sm text-muted-foreground">Surahs</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">6</div>
          <div className="text-sm text-muted-foreground">Hadith Books</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">4</div>
          <div className="text-sm text-muted-foreground">Translations</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">2</div>
          <div className="text-sm text-muted-foreground">Tafsirs</div>
        </div>
      </div>
    </div>
  );
}
