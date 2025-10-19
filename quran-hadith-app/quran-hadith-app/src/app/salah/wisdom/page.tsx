import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles, Brain, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'The Wisdom Behind Every Movement in Salah | Islamic Nexus',
  description: 'Discover the profound spiritual wisdom, historical context, and benefits behind each action in Islamic prayer',
};

export default function SalahWisdomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-4xl mx-auto">
            <Link href="/salah">
              <Button variant="ghost" className="mb-6 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Salah
              </Button>
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                  The Wisdom Behind Every Movement
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Understanding the Profound Meaning of Salah
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Why Understanding Matters</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Salah is not just physical movements - it's a profound spiritual conversation with Allah.
              When we understand the wisdom behind each action, our prayer transforms from mere ritual
              to a deeply meaningful experience that touches our hearts and minds.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
              <p className="italic text-sm">
                "The example of one who prays without understanding is like a body without a soul."
                - Islamic Wisdom
              </p>
            </div>
          </div>

          {/* Allah's Wisdom in Commanding Salah */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">The Divine Wisdom Behind Salah</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <h3 className="font-semibold text-lg mb-3">Allah's Infinite Wisdom</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Allah does not need our worship. He is Al-Ghani (The Self-Sufficient), free from all needs. Yet He commanded us to pray five times daily. Why? Because of His infinite wisdom and mercy toward us.
                </p>
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="font-arabic text-xl mb-2 text-center leading-loose">
                    يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ
                  </p>
                  <p className="text-sm italic mb-2">Ya ayyuha an-nasu antumu al-fuqara'u ila Allahi wa Allahu huwa al-ghaniyyu al-hamid</p>
                  <p className="text-sm">
                    "O mankind, you are those in need of Allah, while Allah is the Free of need, the Praiseworthy."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">- Quran 35:15</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">The Deeper Purposes:</h3>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">1. Connection and Spiritual Nourishment</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Just as the body needs food multiple times a day, the soul needs spiritual nourishment. Salah is the food of the soul.
                  </p>
                  <div className="bg-background/50 rounded p-3 mb-3">
                    <p className="text-sm font-semibold mb-1">The Prophet (ﷺ) said:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "The coolness of my eyes was placed in prayer."
                    </p>
                    <p className="text-xs text-muted-foreground">- Musnad Ahmad 12293, authenticated by Al-Albani</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For the Prophet (ﷺ), prayer was not a burden but a source of comfort, peace, and joy. When he was distressed, he would say to Bilal: "Give us comfort with it, O Bilal" - meaning call the prayer.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">2. Training and Discipline</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Five daily prayers at fixed times train us in:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• <strong>Discipline:</strong> Rising for Fajr before dawn, stopping work for Dhuhr and Asr</li>
                    <li>• <strong>Time management:</strong> Organizing our day around prayer times</li>
                    <li>• <strong>Consistency:</strong> Maintaining worship regardless of circumstances</li>
                    <li>• <strong>Priority:</strong> Putting Allah first before worldly matters</li>
                  </ul>
                  <div className="bg-background/50 rounded p-3 mt-3">
                    <p className="text-sm font-semibold mb-1">Ibn al-Qayyim said:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "Salah is the scale that measures the state of a person's heart. Just as you pray, so is the state of your heart."
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">3. Equality Before Allah</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    In Salah, especially in congregation, the rich and poor, the ruler and the ruled, stand shoulder to shoulder in equal rows. There is no distinction based on wealth, status, or race.
                  </p>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">The Prophet (ﷺ) said:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "Straighten your rows, for the straightening of rows is part of the perfection of prayer."
                    </p>
                    <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 723</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">4. Constant Reminder of the Hereafter</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Every Salah reminds us that one day we will stand before Allah for judgment. The positions in prayer mirror the positions on the Day of Judgment.
                  </p>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">Imam Ahmad bin Hanbal said:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "When you stand to pray, pray the prayer of the one who is bidding farewell, as if you will not pray another prayer after it."
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h4 className="font-semibold mb-3">5. A Shield from Sin</h4>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2">إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ</p>
                    <p className="text-sm text-muted-foreground">"Indeed, prayer prohibits immorality and wrongdoing." (Quran 29:45)</p>
                  </div>
                  <div className="bg-background/50 rounded p-3 mb-3">
                    <p className="text-sm font-semibold mb-1">Ibn Abbas (رضي الله عنه) explained:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "Prayer stops a person from sins while they are in it, and reminds them of Allah when they are tempted afterward."
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">Hasan al-Basri said:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "Whoever does not find that his prayer stops him from evil, then he is only increasing in distance from Allah."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How Prophets Prayed */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Prayer in the Lives of the Prophets</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <p className="text-muted-foreground leading-relaxed">
                  The prophets were the best of creation, and they exemplified excellence in prayer. Learning how they approached Salah teaches us about true devotion.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3">Prophet Ibrahim (ﷺ) - The Friend of Allah</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ibrahim (ﷺ) built the Kaaba and established Makkah as a place of worship. Even in his old age, his prayer was that his offspring would maintain prayer.
                  </p>
                  <div className="bg-background/50 rounded p-3 mb-3">
                    <p className="font-arabic text-lg mb-2">رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ</p>
                    <p className="text-sm text-muted-foreground">"Our Lord, and make us Muslims [in submission] to You and from our descendants a Muslim nation [in submission] to You." (Quran 2:128)</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">Ibn Kathir said:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "Ibrahim's greatest legacy was not just building the Kaaba, but establishing the tradition of Salah that would continue until the Day of Judgment."
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3">Prophet Musa (ﷺ) - The One Who Spoke to Allah</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Musa (ﷺ) was honored by speaking to Allah directly. During Mi'raj, it was Musa who advised Prophet Muhammad (ﷺ) to ask Allah to reduce the number of prayers from fifty to five, showing his deep understanding of human nature and the importance of making worship sustainable.
                  </p>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">From Sahih al-Bukhari 349:</p>
                    <p className="text-sm text-muted-foreground italic">
                      Musa (ﷺ) said: "I know the people better than you; I dealt with Bani Israel and tested them. Go back to your Lord and ask Him to reduce it." He kept sending the Prophet (ﷺ) back out of compassion for the Ummah.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3">Prophet Dawud (ﷺ) - The One with a Beautiful Voice</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Dawud (ﷺ) was given a beautiful voice and would recite the Zabur (Psalms) in such a melodious way that birds and mountains would join him in glorification.
                  </p>
                  <div className="bg-background/50 rounded p-3 mb-3">
                    <p className="font-arabic text-lg mb-2">إِنَّا سَخَّرْنَا الْجِبَالَ مَعَهُ يُسَبِّحْنَ بِالْعَشِيِّ وَالْإِشْرَاقِ</p>
                    <p className="text-sm text-muted-foreground">"Indeed, We subjected the mountains [to praise] with him, glorifying [Allah] in the evening and after sunrise." (Quran 38:18)</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">The Prophet (ﷺ) said to Abu Musa al-Ash'ari:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "You have been given a melodious voice like that of the family of Dawud."
                    </p>
                    <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 5048</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3">Prophet Isa (ﷺ) - The Devoted Worshipper</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    From infancy, Isa (ﷺ) was commanded to pray. His life was one of continuous devotion.
                  </p>
                  <div className="bg-background/50 rounded p-3 mb-3">
                    <p className="font-arabic text-lg mb-2 leading-loose">وَأَوْصَانِي بِالصَّلَاةِ وَالزَّكَاةِ مَا دُمْتُ حَيًّا</p>
                    <p className="text-sm text-muted-foreground">"And has enjoined upon me prayer and zakah as long as I remain alive." (Quran 19:31)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The Christians distorted his message and turned him into an object of worship, but the Quran clarifies that he was a devoted servant who worshipped Allah alone through prayer.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3">Prophet Muhammad (ﷺ) - The Best Example</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The Prophet (ﷺ) was the most devoted to Salah. His prayer was so long and beautiful that it became the standard for all Muslims.
                  </p>
                  <div className="bg-background/50 rounded p-3 mb-3">
                    <p className="text-sm font-semibold mb-1">Aisha (رضي الله عنها) reported:</p>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "The Prophet (ﷺ) would stand in prayer for so long that his feet would swell. When asked why he prayed so much when Allah had already forgiven his past and future sins, he replied: 'Should I not be a grateful servant?'"
                    </p>
                    <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 4836</p>
                  </div>
                  <div className="bg-background/50 rounded p-3 mb-3">
                    <p className="text-sm font-semibold mb-1">He (ﷺ) also said:</p>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "Pray as you have seen me praying."
                    </p>
                    <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 631</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">Abdullah ibn Mas'ud (رضي الله عنه) said:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "I have seen the Messenger of Allah (ﷺ) and he does not resemble anyone among you more in prayer than so-and-so. Then we went to see that person's prayer and he would perfect his bowing and prostration."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-lg p-6 border-l-4 border-emerald-500">
                <h3 className="font-semibold text-lg mb-3">Wisdom from the Salaf on Following the Prophets' Example</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Imam Malik</strong> said: "The last part of this Ummah will not be rectified except by that which rectified its first part" - meaning following the way of the Prophet (ﷺ) and the righteous predecessors in worship.
                  </p>
                  <p>
                    <strong>Umar ibn Abdul-Aziz</strong> would cry during his prayer until his beard was soaked with tears. When asked, he said: "I remembered standing before Allah on the Day of Judgment."
                  </p>
                  <p>
                    <strong>Abu Bakr as-Siddiq (رضي الله عنه)</strong> was described as standing like a planted stick in prayer, completely still out of reverence for Allah.
                  </p>
                  <p>
                    <strong>Ali ibn Abi Talib (رضي الله عنه)</strong> said: "When the time for prayer came, his face would change color and he would say, 'The trust has come - the trust which Allah offered to the heavens, the earth, and the mountains but they refused to bear it. I have undertaken it.'"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Raising Hands - Takbir */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Raising the Hands - Takbiratul Ihram</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Spiritual Significance
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  When we raise our hands and say "Allahu Akbar," we're declaring that Allah is greater
                  than everything in our lives. This gesture symbolizes:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-muted-foreground ml-4">
                  <li>Letting go of worldly concerns</li>
                  <li>Surrendering to Allah's greatness</li>
                  <li>Entering a sacred state of worship</li>
                  <li>Throwing away distractions and sins behind us</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Psychological Benefit
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The physical act of raising hands creates a mental boundary between the worldly and
                  the sacred. It signals to our brain that we're transitioning into a different state
                  of consciousness - one focused entirely on worship.
                </p>
              </div>
            </div>
          </div>

          {/* Placing Hands on Chest */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Placing Right Hand Over Left on the Chest</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Spiritual Significance
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  This posture represents:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-muted-foreground ml-4">
                  <li>Humility and submission before Allah</li>
                  <li>The position of a servant standing before their Master</li>
                  <li>Placing hands over the heart - the center of faith</li>
                  <li>Complete focus and attention in prayer</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Historical Context
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  This was the way the Prophet Muhammad (ﷺ) stood in prayer, as narrated in authentic
                  hadiths. It reflects the natural posture of respect and attentiveness that humans have
                  adopted throughout history when standing before someone of high status.
                </p>
              </div>
            </div>
          </div>

          {/* Reciting Al-Fatihah */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Reciting Surah Al-Fatihah - The Divine Conversation</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <h3 className="font-semibold text-lg mb-3">The Most Profound Moment in Prayer</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Prophet (ﷺ) said that Allah said: "I have divided the prayer between Myself and My
                  servant into two halves, and My servant shall have what he has asked for."
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-semibold mb-1">When you say: "All praise is for Allah, Lord of the worlds"</p>
                    <p className="text-muted-foreground italic">Allah says: "My servant has praised Me."</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-semibold mb-1">When you say: "The Most Gracious, the Most Merciful"</p>
                    <p className="text-muted-foreground italic">Allah says: "My servant has extolled Me."</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-semibold mb-1">When you say: "Master of the Day of Judgment"</p>
                    <p className="text-muted-foreground italic">Allah says: "My servant has glorified Me."</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-semibold mb-1">When you say: "You alone we worship, and You alone we ask for help"</p>
                    <p className="text-muted-foreground italic">Allah says: "This is between Me and My servant, and My servant shall have what he asked for."</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="font-semibold mb-1">When you say: "Guide us to the straight path..."</p>
                    <p className="text-muted-foreground italic">Allah says: "This is for My servant, and My servant shall have what he asked for."</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  The Wisdom
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Al-Fatihah is called "Umm al-Kitab" (Mother of the Book) because it contains the essence
                  of the entire Quran. It encompasses praise, declaration of servitude, and supplication.
                  This is why it's obligatory in every rak'ah - it's our direct conversation with Allah.
                </p>
              </div>
            </div>
          </div>

          {/* Ruku - Bowing */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Ruku' (Bowing) - The Position of Reverence</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Spiritual Significance
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Bowing represents the halfway point between standing and prostration. It symbolizes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Submitting our pride and ego to Allah</li>
                  <li>Acknowledging Allah's greatness ("Subhana Rabbiyal-Adheem")</li>
                  <li>Lowering ourselves before the Most High</li>
                  <li>The beginning of complete surrender</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Physical & Health Benefits
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The bowing position allows blood to flow to the upper body and brain. The straight
                  back with hands on knees provides a gentle stretch to the spine, hamstrings, and back
                  muscles. This position, when done with tranquility, promotes flexibility and blood circulation.
                </p>
              </div>
            </div>
          </div>

          {/* Sujud - Prostration */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Sujud (Prostration) - The Closest Position to Allah</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <p className="font-semibold mb-2">
                  The Prophet Muhammad (ﷺ) said:
                </p>
                <p className="italic text-muted-foreground">
                  "The closest that a servant comes to his Lord is when he is prostrating, so make
                  abundant supplication [in that state]." [Sahih Muslim]
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Spiritual Significance
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Prostration is the pinnacle of submission and humility:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Placing the most honored part (the forehead) on the ground</li>
                  <li>Complete surrender - no part of worship is more humble</li>
                  <li>The position that most angers Satan, who refused to prostrate</li>
                  <li>Acknowledging that we are created from dust and will return to it</li>
                  <li>The highest point of closeness to Allah in this life</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Scientific & Health Benefits
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Modern science has discovered numerous benefits of prostration:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Increases blood flow to the brain, enhancing mental clarity</li>
                  <li>The position massages abdominal organs, aiding digestion</li>
                  <li>Stretches and strengthens back, thigh, and leg muscles</li>
                  <li>Grounding effect - connecting with the earth reduces stress</li>
                  <li>Regular prostration can help prevent cognitive decline</li>
                  <li>Reduces tension in neck and spine</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  The Seven Points of Contact
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We prostrate on seven body parts (forehead with nose, both hands, both knees, both feet).
                  This complete contact with the ground symbolizes total submission - not just of the mind
                  and heart, but of the entire physical body to Allah's will.
                </p>
              </div>
            </div>
          </div>

          {/* Tashahhud */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Tashahhud - The Greeting of Peace</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  The Authentic Meaning
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  When we say "As-salamu alayka ayyuhan-nabiyyu" (Peace be upon you, O Prophet), we are:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Sending greetings of peace to the Prophet Muhammad (ﷺ)</li>
                  <li>Affirming our testimony of faith (Shahadah)</li>
                  <li>Connecting with all righteous servants of Allah across time and space</li>
                  <li>Acknowledging the three pillars: Allah's rights, the Prophet's position, and our brotherhood</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Important Note on Common Misconceptions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  There are fabricated stories about Tashahhud involving a conversation during Mi'raj
                  (the night journey). These stories are not authentic and were made up centuries after
                  the Prophet (ﷺ). The true significance of Tashahhud lies in its testimony of faith
                  and greeting to the Prophet, which he himself taught to the companions.
                </p>
              </div>
            </div>
          </div>

          {/* Salawat on the Prophet */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Sending Blessings Upon the Prophet (ﷺ)</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Spiritual Significance
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Allah commands us in the Quran: "Indeed, Allah confers blessing upon the Prophet, and
                  His angels [ask Him to do so]. O you who have believed, ask [Allah to confer] blessing
                  upon him and ask [Allah to grant him] peace." (Quran 33:56)
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>It's a command from Allah Himself</li>
                  <li>For every blessing we send, Allah sends ten upon us</li>
                  <li>It purifies our hearts from jealousy and hatred</li>
                  <li>It's a means of having our own prayers answered</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tasleem */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Tasleem - Spreading Peace</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Spiritual Significance
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The prayer ends with spreading peace - "Assalamu alaikum wa rahmatullah":
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>We greet the angels on our right and left shoulders who record our deeds</li>
                  <li>We greet fellow Muslims praying beside us</li>
                  <li>We exit the sacred state of prayer with a message of peace</li>
                  <li>We carry the tranquility of prayer into the world</li>
                  <li>It reminds us that Islam's message is one of peace and mercy</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Psychological Impact
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ending with peace creates a positive mental association with prayer. We leave Salah
                  not with fear or burden, but with serenity and goodwill toward others - a beautiful
                  way to transition back to worldly activities.
                </p>
              </div>
            </div>
          </div>

          {/* Overall Benefits */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">The Holistic Benefits of Salah</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-primary">Spiritual Benefits</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Direct connection with Allah</li>
                  <li>• Purification of the heart</li>
                  <li>• Forgiveness of sins</li>
                  <li>• Protection from evil</li>
                  <li>• Strengthening of faith</li>
                  <li>• Inner peace and tranquility</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-primary">Mental Benefits</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Stress reduction</li>
                  <li>• Improved focus and concentration</li>
                  <li>• Discipline and time management</li>
                  <li>• Mindfulness and presence</li>
                  <li>• Emotional regulation</li>
                  <li>• Sense of purpose</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-primary">Physical Benefits</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Improved flexibility</li>
                  <li>• Better blood circulation</li>
                  <li>• Strengthened muscles</li>
                  <li>• Enhanced digestion</li>
                  <li>• Spinal health</li>
                  <li>• Regular exercise routine</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-primary">Social Benefits</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Unity with Muslim community</li>
                  <li>• Breaking social barriers</li>
                  <li>• Equality before Allah</li>
                  <li>• Regular social interaction (Jama'ah)</li>
                  <li>• Shared spiritual experience</li>
                  <li>• Collective consciousness</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Authentic Hadith on the Virtues of Salah */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Authentic Hadith on the Virtues of Salah</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <p className="text-sm font-semibold mb-2">The Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "The five daily prayers and from one Friday prayer to the next are an expiation for whatever sins come in between, so long as one does not commit any major sin."
                </p>
                <p className="text-xs text-muted-foreground">- Sahih Muslim 233</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">The Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "Whoever prays the two cool prayers (Asr and Fajr) will enter Paradise."
                </p>
                <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 574</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">The Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "Whoever guards the prayers, they will be light, proof and salvation for him on the Day of Resurrection. But whoever does not guard them, they will not be light, proof or salvation for him, and on the Day of Resurrection he will be with Qarun, Pharaoh, Haman and Ubayy ibn Khalaf."
                </p>
                <p className="text-xs text-muted-foreground mb-3">- Musnad Ahmad 6540, authenticated by Al-Albani</p>
                <p className="text-sm text-muted-foreground">
                  Imam Ibn al-Qayyim explained: These four were mentioned because they represent the main distractions from prayer - wealth (Qarun), power (Pharaoh), government position (Haman), and business (Ubayy ibn Khalaf).
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">The Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "When a man stands to pray, all his sins are brought and placed on his head and shoulders. Every time he bows or prostrates, some of them fall from him."
                </p>
                <p className="text-xs text-muted-foreground">- Bayhaqi in Shu'ab al-Iman, chain authenticated by Al-Albani</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">Abu Hurayrah (رضي الله عنه) reported that the Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "The prayer that is hardest for the hypocrites is Isha and Fajr. If they only knew what (reward) they contain, they would come to them even if they had to crawl."
                </p>
                <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 657, Sahih Muslim 651</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">The Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "Whoever performs ablution properly, then comes to Friday prayer, listens attentively and keeps silent, his sins between that Friday and the next will be forgiven, plus three more days. But whoever touches pebbles has engaged in idle behavior."
                </p>
                <p className="text-xs text-muted-foreground">- Sahih Muslim 857</p>
              </div>
            </div>
          </div>

          {/* Teachings of the Salaf */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Wisdom from the Salaf on Prayer</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <p className="text-sm mb-2">
                  The Salaf (righteous predecessors) were the companions of the Prophet (ﷺ) and the two generations after them. Their understanding and practice of Islam was the purest, and their devotion to Salah was unparalleled.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Umar ibn Al-Khattab (رضي الله عنه)</h4>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "A person's share in Islam is their share in prayer. Whoever takes it lightly has taken Islam lightly."
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  During his caliphate, when he was stabbed and on his deathbed, his son Abdullah came to wake him for Fajr prayer. His first words were: "Prayer? Yes, by Allah, there is no share in Islam for one who abandons prayer." Then he prayed while his wound was bleeding.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Abdullah ibn Mas'ud (رضي الله عنه)</h4>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "Whoever is pleased to meet Allah tomorrow as a Muslim, let him maintain these five prayers when the call is given for them. For Allah has legislated for your Prophet the ways of guidance, and these (prayers) are part of the ways of guidance. If you were to pray in your homes as this one who stays behind prays in his home, you would be leaving the Sunnah of your Prophet, and if you were to leave the Sunnah of your Prophet you would go astray."
                </p>
                <p className="text-xs text-muted-foreground">- Sahih Muslim 654</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Abdullah ibn Umar (رضي الله عنهما)</h4>
                <p className="text-sm text-muted-foreground italic">
                  "We used to count that only the well-known hypocrites would miss prayer. A man would be brought, being supported by two men, until he was made to stand in the row."
                </p>
                <p className="text-xs text-muted-foreground mb-2">- Sahih Muslim 654</p>
                <p className="text-sm text-muted-foreground">
                  Meaning: Even if a man was sick and couldn't walk on his own, he would be helped to come to the mosque for prayer. Only the known hypocrites would stay home.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Imam Ahmad ibn Hanbal</h4>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "If you see a man belittling any of the Sunnah, then be cautious about him."
                </p>
                <p className="text-sm text-muted-foreground">
                  He was especially strict about maintaining all aspects of prayer according to the Sunnah, considering it a sign of a person's commitment to the religion.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Ibn al-Qayyim</h4>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "Salah is the pillar of faith, the banner of Islam, and the Mi'raj of the believer. It is the joy of the eyes of the righteous and the delight of their souls. Through it, they converse intimately with their Lord, and in it they find tranquility for their hearts and rest for their bodies."
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Al-Hasan al-Basri</h4>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "If the heart finds comfort in prayer, it has found comfort in everything. And if it does not find comfort in it, it will never find comfort."
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  He also said: "The believer's prayer is his commerce with Allah. So which trader would want his trade to decrease?"
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Imam Ibn Taymiyyah</h4>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "The heart gets rusty just as metal gets rusty, and its polish is dhikr (remembrance of Allah). And the greatest dhikr is the prayer."
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Aisha (رضي الله عنها)</h4>
                <p className="text-sm text-muted-foreground italic mb-2">
                  She reported that the Prophet (ﷺ) used to talk to them and they would talk to him, but when the time for prayer came, it was as if he did not know them and they did not know him.
                </p>
                <p className="text-sm text-muted-foreground">
                  Meaning: He would be so absorbed in prayer that nothing else mattered.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <h4 className="font-semibold mb-2">Sufyan ath-Thawri</h4>
                <p className="text-sm text-muted-foreground italic">
                  "I loved to meet one of them (the Salaf) while he was in prayer more than I loved to meet him outside of prayer. Because when he was in prayer, I knew he was engaged in conversation with Allah."
                </p>
              </div>
            </div>
          </div>

          {/* Warning Against Neglecting Prayer */}
          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">The Severe Warning Against Neglecting Prayer</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-red-500/10 border-l-4 border-red-500 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">Allah says in the Quran:</p>
                <p className="font-arabic text-lg mb-2 leading-loose">
                  فَخَلَفَ مِن بَعْدِهِمْ خَلْفٌ أَضَاعُوا الصَّلَاةَ وَاتَّبَعُوا الشَّهَوَاتِ ۖ فَسَوْفَ يَلْقَوْنَ غَيًّا
                </p>
                <p className="text-sm text-muted-foreground">
                  "But there came after them successors who neglected prayer and pursued desires; so they are going to meet evil."
                </p>
                <p className="text-xs text-muted-foreground">- Quran 19:59</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">The Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "That which differentiates us from the disbelievers and hypocrites is our performance of Salah. He who abandons it becomes a disbeliever."
                </p>
                <p className="text-xs text-muted-foreground mb-3">- Sunan al-Tirmidhi 2621, authenticated by Al-Albani</p>
                <div className="bg-background/50 rounded p-3">
                  <p className="text-sm font-semibold mb-1">The scholars differed on the ruling:</p>
                  <p className="text-sm text-muted-foreground">
                    • Some said abandoning prayer out of laziness while believing in its obligation is major kufr that takes one out of Islam (the view of Imam Ahmad and others).
                    <br />
                    • Others said it's a major sin but not kufr (the view of Imam Abu Hanifa and others).
                    <br />
                    • All agreed: It is one of the most serious sins in Islam.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">Jabir (رضي الله عنه) reported that the Prophet (ﷺ) said:</p>
                <p className="text-muted-foreground italic mb-2">
                  "Between a man and shirk and kufr there stands his giving up of Salah."
                </p>
                <p className="text-xs text-muted-foreground">- Sahih Muslim 82</p>
              </div>

              <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-5">
                <p className="text-sm font-semibold mb-2">Ibn al-Qayyim wrote:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Abandoning prayer is the greatest destruction, and maintaining it is the greatest salvation. No one maintains it except a believer, and no one abandons it except a disbeliever or hypocrite."
                </p>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="glass-card-premium rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Transform Your Prayer</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
              When you understand the wisdom behind each movement, Salah transforms from a ritual
              into a profound spiritual journey. Every position becomes meaningful, every word becomes
              powerful, and every prayer becomes an opportunity to draw closer to Allah.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 max-w-2xl mx-auto border-l-4 border-primary">
              <p className="font-arabic text-xl mb-3">
                إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
              </p>
              <p className="text-sm text-muted-foreground">
                "Indeed, prayer prohibits immorality and wrongdoing."
                <br />
                <span className="text-xs">- Quran 29:45</span>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Link href="/salah/guide">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Step-by-Step Guide
              </Button>
            </Link>
            <Link href="/salah">
              <Button className="gap-2">
                Back to Salah Overview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
