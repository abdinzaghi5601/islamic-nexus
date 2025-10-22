import Link from 'next/link';
import { BookOpen, Library, Search, Heart, Book, Sparkles, BookText, TrendingUp } from 'lucide-react';
import RandomDua from '@/components/random-dua';
import { getRandomDua } from '@/lib/api/dua-service';
import DailyContentCarousel from '@/components/DailyContentCarousel';

export default function Home() {
  // Get initial random dua for server-side rendering
  const initialDua = getRandomDua();
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
      title: 'Salah Guide',
      description: 'Complete step-by-step prayer guide with authentic duas and profound spiritual wisdom',
      icon: Heart,
      href: '/salah',
      stats: 'Learn Prayer',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Islamic Duas',
      description: 'Authentic supplications from Quran and Sunnah with transliteration and benefits',
      icon: Heart,
      href: '/duas',
      stats: '72 Duas',
      color: 'from-rose-500 to-pink-600',
    },
    {
      title: 'Islamic Books',
      description: 'Comprehensive library of Islamic literature with full-text search capability',
      icon: Book,
      href: '/books',
      stats: 'PDF Library',
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Smart Search',
      description: 'Semantic search across all content in Arabic and English',
      icon: Search,
      href: '/search',
      stats: 'AI-Powered',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Asma-ul-Husna',
      description: 'The 99 Beautiful Names of Allah with meanings and explanations',
      icon: Sparkles,
      href: '/names',
      stats: '99 Names',
      color: 'from-cyan-500 to-sky-600',
    },
    {
      title: 'Islamic Stories',
      description: 'Inspiring stories from Prophet Muhammad (Seerat), Prophets, Sahaba, and Islamic history',
      icon: BookText,
      href: '/stories',
      stats: '22 Stories',
      color: 'from-fuchsia-500 to-purple-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dedication Notice */}
      <Link
        href="/about"
        className="block mb-6 mx-auto max-w-4xl"
      >
        <div className="glass-card-premium p-4 rounded-xl hover:shadow-xl transition-all duration-300 group border-l-4 border-primary">
          <div className="flex items-center justify-center gap-3 text-sm">
            <Heart className="w-4 h-4 text-primary group-hover:animate-pulse-glow" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Built in loving memory of our beloved grandparents{' '}
              <span className="font-arabic text-primary">رَحِمَهُمَا ٱللَّٰهُ</span>
              {' '}• Click to read our dedication
            </span>
          </div>
        </div>
      </Link>

      {/* Header Section - Enhanced with new styles */}
      <div className="mb-12 text-center islamic-pattern py-12 rounded-2xl">
        <h1 className="heading-primary mb-4 animate-float">Islamic Nexus</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Your comprehensive Islamic knowledge platform with Quran, Hadith, Duas, Names of Allah, and Stories
        </p>
      </div>

      {/* Daily Content Carousel - Hero Section */}
      <div className="mb-12">
        <DailyContentCarousel />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/quran"
            className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Browse Quran
          </Link>
          <Link
            href="/hadith"
            className="px-8 py-3.5 glass-card hover:bg-muted/80 rounded-xl transition-all duration-300 font-semibold"
          >
            Explore Hadith
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
        <h2 className="text-3xl font-bold mb-2 text-center gradient-text">Explore Our Platform</h2>
        <div className="islamic-divider mb-8">
          <span className="text-2xl">✦</span>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group content-card p-8 rounded-xl"
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

      {/* Random Dua of the Day */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-2 text-center gradient-text">Dua of the Moment</h2>
        <div className="islamic-divider mb-8">
          <span className="text-2xl">✦</span>
        </div>
        <div className="max-w-3xl mx-auto">
          <RandomDua initialDua={initialDua} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-card-premium p-10 rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 gradient-text">Platform Statistics</h2>
        <div className="islamic-divider mb-10">
          <span className="text-2xl">✦</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">114</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Surahs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">6,236</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Ayahs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">6</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Hadith Books</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">72</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Duas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">99</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Divine Names</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">15</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Stories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">PDF</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Books Library</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-3">4</div>
            <div className="text-xs text-gray-900 dark:text-gray-100 font-semibold">Translations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
