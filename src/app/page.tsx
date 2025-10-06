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
      <div className="text-center mb-20">
        <h1 className="text-6xl font-bold mb-6 gradient-text">
          Quran & Hadith
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          A comprehensive Islamic knowledge base with the complete Quran, Hadith collections, and Tafsir commentary
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              href={feature.href}
              className="group glass-card hover-lift p-8 rounded-xl"
            >
              <div className="flex items-start space-x-5">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl group-hover:shadow-lg transition-all duration-300">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                  <p className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                    {feature.stats}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="glass-card p-10 rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-8">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">114</div>
            <div className="text-sm text-muted-foreground font-medium">Surahs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">6</div>
            <div className="text-sm text-muted-foreground font-medium">Hadith Books</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">4</div>
            <div className="text-sm text-muted-foreground font-medium">Translations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">2</div>
            <div className="text-sm text-muted-foreground font-medium">Tafsirs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
