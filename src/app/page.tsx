import Link from 'next/link';
import { BookOpen, Library, Search, Heart } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Complete Quran',
      description: '114 Surahs with multiple English translations and comprehensive tafsir commentary',
      icon: BookOpen,
      href: '/quran',
      stats: '6,236 Ayahs',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Hadith Collections',
      description: 'Authentic narrations from the six major hadith books with Arabic and English text',
      icon: Library,
      href: '/hadith',
      stats: 'Six Major Books',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Islamic Duas',
      description: 'Authentic supplications from Quran and Sunnah with transliteration and benefits',
      icon: Heart,
      href: '/duas',
      stats: '50+ Duas',
      color: 'from-rose-500 to-pink-600',
    },
    {
      title: 'Smart Search',
      description: 'Semantic search across Quran, Hadith, and Duas in Arabic and English',
      icon: Search,
      href: '/search',
      stats: 'AI-Powered',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section - Matching Quran/Hadith style */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 gradient-text">Islamic Nexus</h1>
        <p className="text-muted-foreground text-lg">
          Your comprehensive Islamic knowledge platform with Quran, Hadith, and Duas
        </p>
      </div>

      {/* Hero Banner */}
      <div className="glass-card p-12 rounded-2xl mb-12 text-center bg-gradient-to-br from-primary/5 to-accent/5">
        <h2 className="text-5xl font-bold mb-6 gradient-text">
          Discover Islamic Knowledge
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Access the complete Quran with translations and tafsir, authentic Hadith collections, and curated Islamic supplications - all in one beautiful platform
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/quran"
            className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Browse Quran
          </Link>
          <Link
            href="/search"
            className="px-8 py-3.5 glass-card hover:bg-muted/80 rounded-xl transition-all duration-300 font-semibold"
          >
            Search Everything
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Platform</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group glass-card hover-lift p-8 rounded-xl"
              >
                <div className="flex items-start space-x-5">
                  <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl group-hover:shadow-lg transition-all duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
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
      </div>

      {/* Quick Stats */}
      <div className="glass-card p-10 rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-10 gradient-text">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text mb-3">114</div>
            <div className="text-sm text-muted-foreground font-semibold">Surahs</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text mb-3">6,236</div>
            <div className="text-sm text-muted-foreground font-semibold">Ayahs</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text mb-3">6</div>
            <div className="text-sm text-muted-foreground font-semibold">Hadith Books</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text mb-3">50+</div>
            <div className="text-sm text-muted-foreground font-semibold">Duas</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text mb-3">4</div>
            <div className="text-sm text-muted-foreground font-semibold">Translations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
