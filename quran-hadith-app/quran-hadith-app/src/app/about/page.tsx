import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Islamic Nexus - A Dedication to Our Beloved Grandparents',
  description: 'Islamic Nexus is built in loving memory of our grandparents who guided us on the path of Islam.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Islamic Pattern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 islamic-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Heart className="w-5 h-5 text-primary animate-pulse-glow" />
              <span className="text-sm font-semibold text-primary">In Loving Memory</span>
            </div>
            <h1 className="heading-primary mb-6">
              A Dedication to Our Beloved Nanu and Nanabba
            </h1>
            <p className="bismillah-text text-3xl mb-6">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-lg text-muted-foreground italic">
              In the Name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="content-card p-8 md:p-12 rounded-2xl mb-8 page-turn-enter">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-xl font-serif text-foreground/90 leading-relaxed mb-6">
                To our dearest Nanu and Nanabba,<br />
                <span className="font-arabic text-2xl text-primary">رَحِمَهُمَا ٱللَّٰهُ</span>{' '}
                <span className="italic">(Rahimahuma Allah)</span> - May Allah have mercy upon them both
              </p>

              <p className="text-foreground/80 leading-relaxed">
                Alhamdulillah, all praise belongs to Allah (SWT) who blessed us with your presence,
                your wisdom, and your unwavering faith during your time with us. Though you have
                returned to Allah (SWT), the light of your guidance continues to illuminate our path.
                As we reflect upon the countless blessings in our lives, your guidance stands as one
                of the most precious gifts Allah bestowed upon our family.
              </p>
            </div>
          </div>

          {/* Quranic Verse 1 */}
          <div className="glass-card-premium p-6 rounded-xl mb-8 border-l-4 border-accent">
            <p className="font-arabic-uthmani text-2xl text-right mb-3 text-primary">
              وَوَصَّيْنَا ٱلْإِنسَـٰنَ بِوَٰلِدَيْهِ
            </p>
            <p className="text-muted-foreground italic text-center">
              "And We have enjoined upon man [care] for his parents..." (Quran 31:14)
            </p>
          </div>

          {/* Main Message */}
          <div className="content-card p-8 md:p-12 rounded-2xl mb-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/80 leading-relaxed mb-6">
                Allah (SWT), in His infinite mercy, kept you steadfast on the Siraat al-Mustaqeem
                (the Straight Path), and through His divine will, you became the luminous beacons
                that guided us toward righteousness. Your lives were living testimonies of faith,
                patience, and devotion to Islam.
              </p>

              <p className="text-foreground/80 leading-relaxed mb-6">
                You taught us that true wealth lies not in material possessions, but in the richness
                of Imaan (faith) and the sweetness of worshipping Allah. Through your actions, not
                just your words, you showed us how to live with dignity, integrity, and constant
                remembrance of our Creator.
              </p>
            </div>
          </div>

          {/* Lessons Learned */}
          <div className="glass-card-premium p-8 md:p-12 rounded-2xl mb-8">
            <h2 className="text-2xl font-bold mb-6 gradient-text text-center">
              From Your Footsteps, We Learned
            </h2>
            <div className="islamic-divider mb-8">
              <span className="text-2xl">✦</span>
            </div>

            <div className="space-y-4">
              {[
                'To begin each day with gratitude and end it in reflection',
                'To find solace in the five daily prayers',
                'To seek knowledge and wisdom throughout our lives',
                'To show compassion to all of Allah\'s creation',
                'To remain patient in times of difficulty, trusting in Allah\'s plan',
              ].map((lesson, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all ayah-reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-primary text-xl font-bold shrink-0">{index + 1}.</span>
                  <p className="text-foreground/80">{lesson}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legacy Section */}
          <div className="content-card p-8 md:p-12 rounded-2xl mb-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/80 leading-relaxed mb-6">
                Your duas (supplications) were shields around us, your advice has been light in our
                darkness, and your examples continue to be compasses pointing us toward Jannah. The
                seeds of faith you planted in our hearts continue to grow and flourish, Insha'Allah,
                even in your absence.
              </p>
            </div>
          </div>

          {/* Quranic Verse 2 */}
          <div className="glass-card-premium p-6 rounded-xl mb-8 border-l-4 border-accent">
            <p className="font-arabic-uthmani text-2xl text-right mb-3 text-primary">
              رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًۭا
            </p>
            <p className="text-muted-foreground italic text-center">
              "My Lord, have mercy upon them as they brought me up [when I was] small." (Quran 17:24)
            </p>
          </div>

          {/* Return to Allah */}
          <div className="content-card p-8 md:p-12 rounded-2xl mb-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/80 leading-relaxed mb-6">
                Allah (SWT) has called you back to Him, and though our hearts grieve your physical
                absence, we find comfort in knowing that you lived lives pleasing to Allah.{' '}
                <span className="font-arabic text-xl text-primary">إِنَّا لِلَّٰهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ</span>
                {' '}- <span className="italic">"Indeed, to Allah we belong and to Him we shall return."</span>{' '}
                (Quran 2:156)
              </p>

              <p className="text-foreground/80 leading-relaxed mb-6">
                This website, Islamic Nexus, is built upon the foundation of values you instilled in us.
                Every lesson shared here, every reminder posted, carries the essence of what you taught
                us—to connect people with their Deen and to spread the message of Islam with love and
                wisdom. This is our Sadaqah Jariyah (continuing charity) in your memory, a legacy that
                we pray will continue to bring blessings to your souls.
              </p>
            </div>
          </div>

          {/* Dua Section */}
          <div className="glass-card-premium p-8 md:p-12 rounded-2xl mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Our Dua for You</h2>
            <div className="islamic-divider mb-8">
              <span className="text-2xl">✦</span>
            </div>

            <div className="space-y-6 text-center">
              <p className="text-foreground/80 leading-relaxed">
                May Allah (SWT) grant you both the highest stations in Jannatul Firdaus, may He
                illuminate your graves with divine light, forgive all your sins, and expand your
                resting places. May your legacy of faith continue through generations to come, and
                may we be reunited with you in Paradise under the shade of the Most Merciful.
              </p>

              <div className="p-6 rounded-lg bg-card/50">
                <p className="font-arabic text-2xl mb-3 text-primary">
                  اللَّهُمَّ اغْفِرْ لَهُمَا وَارْحَمْهُمَا وَعَافِهِمَا وَاعْفُ عَنْهُمَا
                </p>
                <p className="text-muted-foreground italic">
                  Allahumma ighfir lahuma warhamhuma wa 'afihima wa'fu 'anhuma
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  "O Allah, forgive them, have mercy on them, grant them safety, and pardon them."
                </p>
              </div>
            </div>
          </div>

          {/* Closing Message */}
          <div className="content-card p-8 md:p-12 rounded-2xl mb-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/80 leading-relaxed mb-6">
                We continue to make dua for you in every prayer, and we strive to live in a way that
                would make you proud and earn Allah's pleasure. Your memory is a blessing, your legacy
                is our guidance.
              </p>

              <p className="text-foreground/80 leading-relaxed mb-6">
                Jazakumullah Khairan for everything you have done and continue to do. We pray that
                Allah accepts all your sacrifices and makes us worthy of your love and guidance.
              </p>

              <p className="text-xl font-serif text-foreground/90 text-center mt-8">
                With endless love, gratitude, and duas,<br />
                <span className="font-bold gradient-text">Your Grandchildren</span>
              </p>
            </div>
          </div>

          {/* Final Quranic Verse */}
          <div className="glass-card-premium p-6 rounded-xl mb-8 border-l-4 border-accent">
            <p className="font-arabic-uthmani text-2xl text-right mb-3 text-primary">
              رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّـٰتِنَا قُرَّةَ أَعْيُنٍۢ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
            </p>
            <p className="text-muted-foreground italic text-center">
              "Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us
              an example for the righteous." (Quran 25:74)
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <Home className="w-5 h-5" />
              Return to Islamic Nexus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
