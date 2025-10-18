import Link from 'next/link';
import { BookOpen, Heart, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Complete Guide to Salah (Prayer) | Islamic Nexus',
  description: 'Learn the complete method of Islamic prayer with step-by-step guidance and understand the profound wisdom behind every movement',
};

export default function SalahPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>

        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <BookOpen className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="gradient-text">Salah</span>
              <br />
              <span className="text-2xl md:text-3xl text-muted-foreground font-normal">
                The Pillar of Islam
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master the art of Islamic prayer through comprehensive guides that combine authentic Islamic teachings
              with deep spiritual wisdom
            </p>

            {/* Hadith Quote */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl font-arabic text-center mb-3">
                "صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي"
              </p>
              <p className="text-sm md:text-base italic text-muted-foreground">
                "Pray as you have seen me praying."
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                - Prophet Muhammad (ﷺ) [Sahih Al-Bukhari]
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Two Comprehensive Guides</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've created two detailed guides to help you perfect your Salah - one focusing on the practical steps,
              and another exploring the deep spiritual wisdom behind every movement
            </p>
          </div>

          {/* Guide Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Complete Guide Card */}
            <div className="group glass-card-premium rounded-2xl overflow-hidden hover-lift">
              <div className="p-8 space-y-6">
                {/* Icon Header */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Complete Step-by-Step Guide</h3>
                    <p className="text-sm text-muted-foreground">According to Quran & Authentic Sunnah</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  A comprehensive, easy-to-follow guide covering every aspect of Salah - from prerequisites
                  to post-prayer dhikr. Perfect for beginners and those seeking to perfect their prayer.
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">What You'll Learn:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>The 9 Conditions and 14 Pillars of Salah</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Detailed step-by-step instructions with Arabic, transliteration, and translation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Authentic duas and supplications from the Sunnah</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Post-prayer dhikr and remembrance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Prayer times and number of Rak'ahs for each Salah</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href="/salah/guide" className="block">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                    Read the Complete Guide
                  </Button>
                </Link>

                {/* Sources Note */}
                <p className="text-xs text-muted-foreground italic">
                  Compiled from works of Ibn Baaz, Al-Albani, Ibn Uthaimeen, and scholars of the Salaf
                </p>
              </div>
            </div>

            {/* Wisdom Guide Card */}
            <div className="group glass-card-premium rounded-2xl overflow-hidden hover-lift">
              <div className="p-8 space-y-6">
                {/* Icon Header */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                    <Heart className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">The Wisdom Behind Every Movement</h3>
                    <p className="text-sm text-muted-foreground">Understanding the Profound Meaning</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  Discover the deep spiritual wisdom, historical context, and psychological benefits behind
                  each action in Salah - from Takbeer to Tasleem.
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">Explore the Wisdom of:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Why we raise our hands and place them on our chest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>The divine conversation that happens during Al-Fatiha</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>The profound meaning of Ruku' and Sujud positions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>The authentic story behind Tashahhud (not the fabricated one)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Psychological and physical benefits of each movement</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href="/salah/wisdom" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
                    Explore the Wisdom
                  </Button>
                </Link>

                {/* Note */}
                <p className="text-xs text-muted-foreground italic">
                  Based on authentic Islamic sources and scholarly interpretations
                </p>
              </div>
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Recommended Learning Path</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">
                  1
                </div>
                <h4 className="font-semibold">Start with the Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Learn the correct method and memorize the essential supplications
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">
                  2
                </div>
                <h4 className="font-semibold">Practice Daily</h4>
                <p className="text-sm text-muted-foreground">
                  Apply what you've learned in your five daily prayers
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto">
                  3
                </div>
                <h4 className="font-semibold">Deepen Understanding</h4>
                <p className="text-sm text-muted-foreground">
                  Read the wisdom guide to enhance your spiritual connection
                </p>
              </div>
            </div>
          </div>

          {/* Importance Section */}
          <div className="mt-12 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Why Is Salah Important?</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Salah is the second pillar of Islam and the first deed that will be judged on the Day of Resurrection.
                It is the direct link between the believer and Allah, performed five times daily at prescribed times.
              </p>
              <p>
                The Prophet Muhammad (ﷺ) said: <em>"The difference between a believer and a disbeliever is the prayer."</em>
                [Sahih Muslim]
              </p>
              <p className="font-semibold text-primary">
                Perfect your Salah, and Allah will perfect your life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
