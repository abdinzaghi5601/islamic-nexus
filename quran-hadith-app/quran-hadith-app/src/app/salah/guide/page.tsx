import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Complete Step-by-Step Guide to Salah | Islamic Nexus',
  description: 'Learn the complete method of Islamic prayer with detailed step-by-step instructions according to the Quran and authentic Sunnah',
};

export default function SalahGuidePage() {
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                  Complete Step-by-Step Guide to Salah
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  According to the Quran and Authentic Sunnah
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Why Allah Commanded Salah */}
          <div className="glass-card-premium rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Why Allah Commanded Salah to the Believers</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <h3 className="font-semibold text-lg mb-3">The Divine Purpose</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Allah says in the Quran:
                </p>
                <div className="bg-background/50 rounded-lg p-4 mb-3">
                  <p className="font-arabic text-xl mb-2 text-center leading-loose">
                    وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
                  </p>
                  <p className="text-sm italic mb-2">Wa ma khalaqtu al-jinna wal-insa illa liya'budun</p>
                  <p className="text-sm">
                    "And I did not create the jinn and mankind except to worship Me."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">- Quran 51:56</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Salah is the most direct and purest form of worship. It is the practical manifestation of our purpose of creation - to worship Allah alone.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">The Reasons Behind the Divine Command:</h3>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">1. Remembrance of Allah</h4>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2">وَأَقِمِ الصَّلَاةَ لِذِكْرِي</p>
                    <p className="text-sm italic mb-1">Wa aqimi as-salata li-dhikri</p>
                    <p className="text-sm text-muted-foreground">"And establish prayer for My remembrance." (Quran 20:14)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Salah prevents us from forgetting our Creator in the midst of worldly distractions. Five times daily, we are called back to remember Allah.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">2. Prevention from Evil</h4>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2">إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ</p>
                    <p className="text-sm italic mb-1">Inna as-salata tanha 'an al-fahsha' wal-munkar</p>
                    <p className="text-sm text-muted-foreground">"Indeed, prayer prohibits immorality and wrongdoing." (Quran 29:45)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The Salaf explained: When you stand before Allah five times daily in complete submission, your soul is trained to avoid sin and seek righteousness.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">3. A Criterion Between Belief and Disbelief</h4>
                  <div className="mb-3">
                    <p className="text-sm font-semibold">Prophet Muhammad (ﷺ) said:</p>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "The covenant between us and them is prayer; whoever abandons it has committed disbelief."
                    </p>
                    <p className="text-xs text-muted-foreground">- Jami' at-Tirmidhi 2621, authenticated by Al-Albani</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground italic">
                      "Between a man and disbelief and polytheism is the abandonment of prayer."
                    </p>
                    <p className="text-xs text-muted-foreground">- Sahih Muslim 82</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">4. The First Matter to be Judged</h4>
                  <div className="mb-3">
                    <p className="text-sm font-semibold">The Prophet (ﷺ) said:</p>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer. If it is sound, then the rest of his deeds will be sound. And if it is bad, then the rest of his deeds will be bad."
                    </p>
                    <p className="text-xs text-muted-foreground">- Sunan al-Tirmidhi 413, authenticated by Al-Albani</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">5. Light and Purification</h4>
                  <div className="mb-3">
                    <p className="text-sm font-semibold">The Prophet (ﷺ) said:</p>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "Prayer is light."
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">- Sahih Muslim 223</p>

                    <p className="text-sm text-muted-foreground italic mb-2">
                      "If there was a river at the door of anyone of you and he took a bath in it five times a day, would you notice any dirt on him?" They said, "Not a trace of dirt would be left." The Prophet (ﷺ) added, "That is the example of the five prayers with which Allah blots out evil deeds."
                    </p>
                    <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 528</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prayer Through the Prophets */}
          <div className="glass-card-premium rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Prayer: A Command to All Prophets</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border-l-4 border-primary">
                <p className="text-muted-foreground leading-relaxed">
                  Salah was not unique to the Muslim Ummah. Allah commanded prayer to every prophet and every nation before us. While the specific format may have differed, the core act of bowing and prostrating before Allah was consistent.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🕌</span>
                    Prophet Adam (ﷺ)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Adam was the first human and the first prophet. Islamic scholars mention that when Adam was forgiven after eating from the tree, he was taught to prostrate to Allah in gratitude. This act of prostration (sujud) became part of worship from the very beginning of humanity.
                  </p>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">From the teachings of the Salaf:</p>
                    <p className="text-sm text-muted-foreground italic">
                      Ibn Kathir mentioned that Adam learned the timings of prayer from the angels, and this knowledge was passed down through his righteous children.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🕌</span>
                    Prophet Ibrahim (Abraham) (ﷺ)
                  </h3>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2">رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي</p>
                    <p className="text-sm italic mb-1">Rabbi aj'alni muqeema as-salati wa min dhurriyyati</p>
                    <p className="text-sm text-muted-foreground">"My Lord, make me an establisher of prayer, and [many] from my descendants." (Quran 14:40)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ibrahim (ﷺ) prayed for himself and his offspring to establish prayer. The Kaaba that he built with his son Ismail became the Qiblah for prayer. His legacy of prayer continues in his descendants through both lines - including Prophet Muhammad (ﷺ).
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🕌</span>
                    Prophet Ismail (Ishmael) (ﷺ)
                  </h3>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2">وَكَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ وَكَانَ عِندَ رَبِّهِ مَرْضِيًّا</p>
                    <p className="text-sm italic mb-1">Wa kana ya'muru ahlahu bis-salati waz-zakati wa kana 'inda rabbihi mardiyya</p>
                    <p className="text-sm text-muted-foreground">"And he used to enjoin on his people prayer and zakah and was to his Lord pleasing." (Quran 19:55)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ismail (ﷺ) was known for commanding his family to establish prayer. He settled in Makkah and his descendants continued the tradition of prayer at the Kaaba.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🕌</span>
                    Prophet Musa (Moses) (ﷺ)
                  </h3>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2">وَأَقِمِ الصَّلَاةَ لِذِكْرِي</p>
                    <p className="text-sm text-muted-foreground">"And establish prayer for My remembrance." (Quran 20:14)</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    This command was given directly to Musa (ﷺ) during his encounter with Allah at Mount Sinai. Allah commanded him to establish prayer as a means of remembrance.
                  </p>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2">وَأَوْحَيْنَا إِلَىٰ مُوسَىٰ وَأَخِيهِ أَن تَبَوَّآ لِقَوْمِكُمَا بِمِصْرَ بُيُوتًا وَاجْعَلُوا بُيُوتَكُمْ قِبْلَةً وَأَقِيمُوا الصَّلَاةَ</p>
                    <p className="text-sm text-muted-foreground">"And We inspired to Moses and his brother, 'Settle your people in Egypt in houses and make your houses [facing the] qiblah and establish prayer.'" (Quran 10:87)</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🕌</span>
                    Prophet Isa (Jesus) (ﷺ)
                  </h3>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2 leading-loose">وَجَعَلَنِي مُبَارَكًا أَيْنَ مَا كُنتُ وَأَوْصَانِي بِالصَّلَاةِ وَالزَّكَاةِ مَا دُمْتُ حَيًّا</p>
                    <p className="text-sm italic mb-1">Wa ja'alani mubarakan ayna ma kuntu wa awsani bis-salati waz-zakati ma dumtu hayya</p>
                    <p className="text-sm text-muted-foreground">"And He has made me blessed wherever I am and has enjoined upon me prayer and zakah as long as I remain alive." (Quran 19:31)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These were among the first words Prophet Isa (ﷺ) spoke as a miracle while still in the cradle. Even as an infant, he declared that Allah had commanded him to establish prayer throughout his life.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">🕌</span>
                    Prophet Muhammad (ﷺ) - The Final Command
                  </h3>
                  <div className="mb-3">
                    <p className="text-sm font-semibold">The Mi'raj - When Salah Was Prescribed:</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      On the night of the Mi'raj (ascension), the Prophet Muhammad (ﷺ) was taken beyond the seven heavens to meet Allah. There, Allah prescribed fifty prayers upon the believers. After consultation with Musa (ﷺ), who knew the nature of people from experience with Bani Israel, the Prophet (ﷺ) returned several times until it was reduced to five. However, Allah decreed:
                    </p>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "They are five, but they are [equal to] fifty in reward, for the decree with Me does not change."
                    </p>
                    <p className="text-xs text-muted-foreground">- Sahih al-Bukhari 349, Sahih Muslim 162</p>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <p className="text-sm font-semibold mb-1">The Uniqueness of This Command:</p>
                    <p className="text-sm text-muted-foreground">
                      All other commandments were sent down through the angel Jibril. But Salah was so important that it was commanded directly to the Prophet (ﷺ) by Allah, without any intermediary, in the highest of heavens.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-5">
                  <h3 className="font-semibold text-lg mb-3">Other Prophets Mentioned in the Quran</h3>
                  <div className="mb-3">
                    <p className="font-arabic text-lg mb-2 leading-loose">وَجَعَلْنَاهُمْ أَئِمَّةً يَهْدُونَ بِأَمْرِنَا وَأَوْحَيْنَا إِلَيْهِمْ فِعْلَ الْخَيْرَاتِ وَإِقَامَ الصَّلَاةِ وَإِيتَاءَ الزَّكَاةِ</p>
                    <p className="text-sm text-muted-foreground">"And We made them leaders guiding by Our command. And We inspired to them the doing of good deeds, establishment of prayer, and giving of zakah." (Quran 21:73)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This verse refers to Ibrahim, Ishaq, and Ya'qub (ﷺ). Allah made it clear that establishing prayer was part of the divine revelation to all prophets.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-lg p-6 border-l-4 border-emerald-500">
                <h3 className="font-semibold text-lg mb-3">Teaching of the Salaf on Prayer Through the Ages</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Imam Ibn Kathir</strong> said: "Prayer has been legislated in every religion, though the manner and number may have differed. The essence of standing before Allah in submission is universal to all prophets."
                  </p>
                  <p>
                    <strong>Imam Ibn Taymiyyah</strong> explained: "The people of every prophet were commanded to pray, for it is the most fundamental act of worship that directly connects the servant to the Creator."
                  </p>
                  <p>
                    <strong>Ibn al-Qayyim</strong> wrote: "Prayer is the pole of the religion. Every prophet from Adam to Muhammad established it, though the Ummah of Muhammad was given the most complete and perfect form."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card-premium rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">The 9 Conditions of Salah</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">1. Islam</h3>
                <p className="text-muted-foreground">Being a Muslim is the first condition.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">2. Sanity (Aql)</h3>
                <p className="text-muted-foreground">Being of sound mind and intellect.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">3. Discernment (Tamyeez)</h3>
                <p className="text-muted-foreground">Ability to distinguish right from wrong.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">4. Purification from Impurity (Hadath)</h3>
                <p className="text-muted-foreground">Having wudu (ablution) or ghusl (ritual bath) when required.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">5. Removal of Impurity (Najaasah)</h3>
                <p className="text-muted-foreground">Ensuring body, clothes, and place of prayer are clean.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">6. Covering the Awrah</h3>
                <p className="text-muted-foreground">Proper modest covering. For men: navel to knees. For women: entire body except face and hands.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">7. Entering Prayer Time</h3>
                <p className="text-muted-foreground">Praying after the time for that prayer has begun.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">8. Facing the Qiblah</h3>
                <p className="text-muted-foreground">Facing the direction of the Kaaba in Makkah.</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">9. Intention (Niyyah)</h3>
                <p className="text-muted-foreground">Intending to pray in your heart (not spoken out loud).</p>
              </div>
            </div>
          </div>

          <div className="glass-card-premium rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">The 14 Pillars of Salah</h2>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>1. <strong>Qiyam (Standing)</strong> - for those who are able</p>
              <p>2. <strong>Takbiratul-Ihram</strong> - Saying "Allahu Akbar" to begin</p>
              <p>3. <strong>Reciting Al-Fatihah</strong> - In every rak'ah</p>
              <p>4. <strong>Ruku' (Bowing)</strong> - Bending with hands on knees</p>
              <p>5. <strong>Rising from Ruku'</strong></p>
              <p>6. <strong>Standing upright after Ruku'</strong></p>
              <p>7. <strong>Sujud (Prostration)</strong> - Prostrating on seven body parts</p>
              <p>8. <strong>Rising from Sujud</strong></p>
              <p>9. <strong>Sitting between two prostrations</strong></p>
              <p>10. <strong>Tranquility in all pillars</strong> - Calmness in each position</p>
              <p>11. <strong>Final Tashahhud</strong> - Sitting and reciting At-Tahiyyat</p>
              <p>12. <strong>Sitting for final Tashahhud</strong></p>
              <p>13. <strong>Sending blessings on the Prophet (ﷺ)</strong></p>
              <p>14. <strong>Tasleem</strong> - Saying the salams to conclude</p>
            </div>
          </div>

          <div className="glass-card-premium rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Step-by-Step Prayer Instructions</h2>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">1. Takbiratul-Ihram (Opening Takbir)</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Stand facing the Qiblah</li>
                  <li>• Raise your hands to shoulder or ear level with palms facing forward</li>
                  <li>• Say: <strong className="text-foreground">"Allahu Akbar"</strong> (Allah is the Greatest)</li>
                  <li>• Place your right hand over your left hand on your chest</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">2. Opening Duas (Thana) - Optional but Highly Recommended</h3>
                <p className="text-muted-foreground mb-4">The Prophet (ﷺ) used different opening duas. Choose any of the following authentic options:</p>

                {/* Option 1 - Most Common */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Option 1 - Most Common (Sahih)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ
                    </p>
                    <p className="text-sm italic mb-2">
                      Subhanakallahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk
                    </p>
                    <p className="text-sm">
                      Glory be to You, O Allah, and praise be to You. Blessed is Your Name and Exalted is Your Majesty. There is no deity worthy of worship except You.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Narrated by Abu Sa'eed al-Khudri (Tirmidhi, Abu Dawud, Ibn Majah)
                    </p>
                  </div>
                </div>

                {/* Option 2 - Longer Version */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Option 2 - Longer Version (Authentic)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ
                    </p>
                    <p className="text-sm italic mb-2">
                      Allahumma ba'id bayni wa bayna khatayaya kama ba'adta baynal-mashriqi wal-maghrib. Allahumma naqqini min khatayaya kama yunaqqath-thawbul-abyadu minad-danas. Allahum-maghsilni min khatayaya bil-ma'i wath-thalji wal-barad
                    </p>
                    <p className="text-sm">
                      O Allah, separate me from my sins as You have separated the East from the West. O Allah, cleanse me of my sins as a white garment is cleansed of filth. O Allah, wash away my sins with water, snow, and hail.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (744) and Sahih Muslim (598) - The Prophet (ﷺ) used to say this in obligatory prayers
                    </p>
                  </div>
                </div>

                {/* Option 3 - For Night Prayer */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Option 3 - For Night Prayer/Tahajjud (Authentic)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ رَبَّ جِبْرَائِيلَ وَمِيكَائِيلَ وَإِسْرَافِيلَ، فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، أَنْتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِيمَا كَانُوا فِيهِ يَخْتَلِفُونَ، اهْدِنِي لِمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ بِإِذْنِكَ، إِنَّكَ تَهْدِي مَنْ تَشَاءُ إِلَى صِرَاطٍ مُسْتَقِيمٍ
                    </p>
                    <p className="text-sm italic mb-2">
                      Allahumma Rabba Jibra'ila wa Mika'ila wa Israfil, Fatiras-samawati wal-ard, 'Alimal-ghaybi wash-shahadah, Anta tahkumu bayna 'ibadika fima kanu fihi yakhtalifun, ihdini limakh-tulifa fihi minal-haqqi bi'idhnik, innaka tahdi man tasha'u ila siratin mustaqim
                    </p>
                    <p className="text-sm">
                      O Allah, Lord of Jibril, Mika'il and Israfil, Creator of the heavens and the earth, Knower of the unseen and the seen, You judge between Your servants concerning that wherein they differ. Guide me to the truth by Your leave, in that which they differ, for indeed You guide whom You will to the Straight Path.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Muslim (770) - The Prophet (ﷺ) used to say this when he stood up to pray at night (Tahajjud)
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">3. Ta'awwudh and Bismillah</h3>
                <div className="bg-muted/50 rounded-lg p-4 mb-3">
                  <p className="font-arabic text-xl mb-2 text-center">
                    أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
                  </p>
                  <p className="text-sm italic mb-2">A'udhu billahi minash-shaytanir-rajeem</p>
                  <p className="text-sm">I seek refuge in Allah from Satan, the accursed.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-xl mb-2 text-center">
                    بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </p>
                  <p className="text-sm italic mb-2">Bismillahir-Rahmanir-Raheem</p>
                  <p className="text-sm">In the name of Allah, the Most Gracious, the Most Merciful.</p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">4. Recite Surah Al-Fatihah</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm mb-2"><strong>This is obligatory in every rak'ah.</strong></p>
                  <p className="font-arabic text-lg mb-2 leading-loose">
                    ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ ٱهْدِنَا ٱلصِّرَ‌ٰطَ ٱلْمُسْتَقِيمَ ۝ صِرَ‌ٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ
                  </p>
                  <p className="text-sm mt-3">
                    [Translation] Praise be to Allah, Lord of the worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.
                  </p>
                  <p className="text-xs mt-2"><strong>Say: Ameen</strong> (softly)</p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">5. Recite Additional Surah or Verses</h3>
                <p className="text-muted-foreground">After Al-Fatihah, recite any portion from the Quran (recommended in first two rak'ahs)</p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">6. Ruku' (Bowing)</h3>
                <ul className="space-y-3 text-muted-foreground mb-4">
                  <li>• Raise hands and say: <strong className="text-foreground">"Allahu Akbar"</strong></li>
                  <li>• Bow down with back straight and hands on knees</li>
                  <li>• Say at least once (recommended 3 or more times):</li>
                </ul>

                {/* Basic Dhikr - Minimum */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Basic Dhikr (Minimum - At least once)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center">
                      سُبْحَانَ رَبِّيَ الْعَظِيمِ
                    </p>
                    <p className="text-sm italic mb-2">Subhana Rabbiyal-Adheem</p>
                    <p className="text-sm">Glory be to my Lord, the Most Great.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Obligatory minimum. Say 3 times for Sunnah.
                    </p>
                  </div>
                </div>

                {/* Additional Dhikr Option 1 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dhikr Option 1 (Highly Recommended)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ
                    </p>
                    <p className="text-sm italic mb-2">Subhana Rabbiyal-Adheem wa bihamdih</p>
                    <p className="text-sm">Glory be to my Lord, the Most Great, and with His praise.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Adding "wa bihamdih" increases the reward
                    </p>
                  </div>
                </div>

                {/* Additional Dhikr Option 2 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dhikr Option 2 (For longer prayers)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي
                    </p>
                    <p className="text-sm italic mb-2">Subhanakallahumma Rabbana wa bihamdik, Allahum-maghfir li</p>
                    <p className="text-sm">Glory be to You, O Allah, our Lord, and with Your praise. O Allah, forgive me.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (794) and Sahih Muslim (484) - The Prophet (ﷺ) used to say this frequently in his Ruku' and Sujud
                    </p>
                  </div>
                </div>

                {/* Additional Dhikr Option 3 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dhikr Option 3 (Complete version)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ
                    </p>
                    <p className="text-sm italic mb-2">Subboohun Quddoosun Rabbul-mala'ikati war-rooh</p>
                    <p className="text-sm">Most Glorious, Most Holy, Lord of the angels and the Spirit.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Muslim (487) - The Prophet (ﷺ) used to say this in his Ruku' and Sujud
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">7. Rising from Ruku'</h3>

                {/* While Rising */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">While Rising (Obligatory)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center">
                      سَمِعَ اللهُ لِمَنْ حَمِدَهُ
                    </p>
                    <p className="text-sm italic mb-2">Sami'Allahu liman hamidah</p>
                    <p className="text-sm">Allah hears those who praise Him.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Obligatory to say while rising from Ruku'
                    </p>
                  </div>
                </div>

                {/* When Standing - Basic */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">When Standing Upright - Basic (Obligatory)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center">
                      رَبَّنَا وَلَكَ الْحَمْدُ
                    </p>
                    <p className="text-sm italic mb-2">Rabbana wa lakal-hamd</p>
                    <p className="text-sm">Our Lord, all praise is for You.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari and Muslim - Basic obligatory statement
                    </p>
                  </div>
                </div>

                {/* Additional Option 1 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dua Option 1 (Highly Recommended)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ
                    </p>
                    <p className="text-sm italic mb-2">Rabbana wa lakal-hamdu hamdan katheeran tayyiban mubarakan feeh</p>
                    <p className="text-sm">Our Lord, to You belongs all praise, an abundant, beautiful and blessed praise.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (799) - A man said this and the Prophet (ﷺ) said he saw thirty-some angels racing to write it down
                    </p>
                  </div>
                </div>

                {/* Additional Option 2 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dua Option 2 (Complete version)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ
                    </p>
                    <p className="text-sm italic mb-2">Rabbana lakal-hamdu mil'as-samawati wa mil'al-ardi wa mil'a ma shi'ta min shay'in ba'd</p>
                    <p className="text-sm">Our Lord, to You belongs all praise, filling the heavens, filling the earth, and filling whatever else You will.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Muslim (477) - The Prophet (ﷺ) used to say this
                    </p>
                  </div>
                </div>

                {/* Additional Option 3 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dua Option 3 (Extended version)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ، أَهْلَ الثَّنَاءِ وَالْمَجْدِ، أَحَقُّ مَا قَالَ الْعَبْدُ، وَكُلُّنَا لَكَ عَبْدٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ
                    </p>
                    <p className="text-sm italic mb-2">Rabbana lakal-hamdu mil'as-samawati wa mil'al-ardi wa mil'a ma shi'ta min shay'in ba'd. Ahlath-thana'i wal-majd, ahaqqu ma qalal-'abd, wa kulluna laka 'abd. Allahumma la mani'a lima a'tayt, wa la mu'tiya lima mana't, wa la yanfa'u dhal-jaddi minkal-jadd</p>
                    <p className="text-sm">Our Lord, to You belongs all praise, filling the heavens, filling the earth, and filling whatever else You will. You are the most deserving of praise and glory, the truest thing a servant can say, and we are all Your servants. O Allah, there is none who can withhold what You give, and none can give what You withhold, and no wealth or majesty can benefit anyone, for all wealth and majesty belong to You.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Muslim (477) - Complete version the Prophet (ﷺ) used to say
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">8. First Sujud (Prostration)</h3>

                {/* Important Note */}
                <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mb-6">
                  <p className="font-semibold text-primary mb-2">⭐ IMPORTANT: The Closest Position to Allah</p>
                  <p className="text-sm text-muted-foreground">
                    The Prophet (ﷺ) said: <strong>"The closest that a servant is to his Lord is when he is in prostration, so make abundant supplication therein."</strong> (Sahih Muslim 482). Sujud is the best time to make dua for all your needs!
                  </p>
                </div>

                <ul className="space-y-3 text-muted-foreground mb-4">
                  <li>• Say: <strong className="text-foreground">"Allahu Akbar"</strong> and go down to prostration</li>
                  <li>• Prostrate on 7 body parts: forehead & nose, both palms, both knees, toes of both feet</li>
                  <li>• Say at least once (recommended 3 or more times):</li>
                </ul>

                {/* Basic Dhikr - Minimum */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Basic Dhikr (Minimum - At least once)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center">
                      سُبْحَانَ رَبِّيَ الأَعْلَى
                    </p>
                    <p className="text-sm italic mb-2">Subhana Rabbiyal-A'la</p>
                    <p className="text-sm">Glory be to my Lord, the Most High.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Obligatory minimum. Say 3 times for Sunnah.
                    </p>
                  </div>
                </div>

                {/* Additional Dhikr Option 1 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dhikr Option 1 (Highly Recommended)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      سُبْحَانَ رَبِّيَ الأَعْلَى وَبِحَمْدِهِ
                    </p>
                    <p className="text-sm italic mb-2">Subhana Rabbiyal-A'la wa bihamdih</p>
                    <p className="text-sm">Glory be to my Lord, the Most High, and with His praise.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Adding "wa bihamdih" increases the reward
                    </p>
                  </div>
                </div>

                {/* Additional Dhikr Option 2 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dhikr Option 2 (For longer prayers)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي
                    </p>
                    <p className="text-sm italic mb-2">Subhanakallahumma Rabbana wa bihamdik, Allahum-maghfir li</p>
                    <p className="text-sm">Glory be to You, O Allah, our Lord, and with Your praise. O Allah, forgive me.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (794) and Sahih Muslim (484) - The Prophet (ﷺ) used to say this frequently in his Ruku' and Sujud
                    </p>
                  </div>
                </div>

                {/* Additional Dhikr Option 3 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dhikr Option 3 (Complete version)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ
                    </p>
                    <p className="text-sm italic mb-2">Subboohun Quddoosun Rabbul-mala'ikati war-rooh</p>
                    <p className="text-sm">Most Glorious, Most Holy, Lord of the angels and the Spirit.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Muslim (487) - The Prophet (ﷺ) used to say this in his Ruku' and Sujud
                    </p>
                  </div>
                </div>

                {/* Special Duas in Sujud */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">⭐ Special Duas to Make in Sujud (Highly Recommended)</p>
                  <p className="text-xs text-muted-foreground mb-3">After the obligatory dhikr, you can make these powerful duas:</p>

                  {/* Dua 1 */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 mb-3 border-l-4 border-primary">
                    <p className="text-xs font-semibold text-primary mb-2">1. For Forgiveness</p>
                    <p className="font-arabic text-lg mb-2 text-center leading-loose">
                      اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ
                    </p>
                    <p className="text-xs italic mb-1">Allahum-maghfir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa 'alaniyatahu wa sirrahu</p>
                    <p className="text-xs">O Allah, forgive me all my sins, the minor and the major, the first and the last, the open and the secret.</p>
                    <p className="text-xs text-muted-foreground mt-1"><strong>Source:</strong> Sahih Muslim (483)</p>
                  </div>

                  {/* Dua 2 */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 mb-3 border-l-4 border-primary">
                    <p className="text-xs font-semibold text-primary mb-2">2. For This Life and the Hereafter</p>
                    <p className="font-arabic text-lg mb-2 text-center leading-loose">
                      اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ
                    </p>
                    <p className="text-xs italic mb-1">Allahumma inni as'aluka minal-khayri kullihi 'ajilihi wa ajilihi, ma 'alimtu minhu wa ma lam a'lam. Wa a'udhu bika minash-sharri kullihi 'ajilihi wa ajilihi, ma 'alimtu minhu wa ma lam a'lam</p>
                    <p className="text-xs">O Allah, I ask You for all that is good, in this world and in the Hereafter, what I know of it and what I do not know. And I seek refuge in You from all evil, in this world and in the Hereafter, what I know of it and what I do not know.</p>
                    <p className="text-xs text-muted-foreground mt-1"><strong>Source:</strong> Sahih Ibn Majah (3846)</p>
                  </div>

                  {/* Dua 3 */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 mb-3 border-l-4 border-primary">
                    <p className="text-xs font-semibold text-primary mb-2">3. For Guidance and Provision</p>
                    <p className="font-arabic text-lg mb-2 text-center leading-loose">
                      اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ
                    </p>
                    <p className="text-xs italic mb-1">Allahumma inni zalamtu nafsi zulman kathiran wa la yaghfirudh-dhunuba illa Ant, faghfir li maghfiratan min 'indik warhamni, innaka Antal-Ghafurur-Rahim</p>
                    <p className="text-xs">O Allah, I have greatly wronged myself and no one forgives sins but You. So grant me forgiveness from You and have mercy on me. Surely, You are Forgiving, Merciful.</p>
                    <p className="text-xs text-muted-foreground mt-1"><strong>Source:</strong> Sahih Bukhari (834) and Sahih Muslim (2705) - The Prophet (ﷺ) taught this to Abu Bakr</p>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    💡 <strong>Tip:</strong> You can make dua in your own language in Sujud for any of your personal needs - health, family, guidance, provision, protection, etc. This is one of the best times for acceptance of dua!
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">9. Sitting Between Two Prostrations</h3>
                <ul className="space-y-3 text-muted-foreground mb-4">
                  <li>• Say: <strong className="text-foreground">"Allahu Akbar"</strong> and sit up</li>
                  <li>• Sit on your left foot with right foot upright</li>
                  <li>• Say at least once (recommended to repeat):</li>
                </ul>

                {/* Basic Dua - Minimum */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Basic Dua (Minimum)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center">
                      رَبِّ اغْفِرْ لِي
                    </p>
                    <p className="text-sm italic mb-2">Rabbi-ghfir li</p>
                    <p className="text-sm">My Lord, forgive me.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Say at least once, recommended twice
                    </p>
                  </div>
                </div>

                {/* Additional Dua Option 1 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dua Option 1 (Recommended)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      رَبِّ اغْفِرْ لِي وَارْحَمْنِي
                    </p>
                    <p className="text-sm italic mb-2">Rabbi-ghfir li warhamni</p>
                    <p className="text-sm">My Lord, forgive me and have mercy on me.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Authentic - Adds request for mercy
                    </p>
                  </div>
                </div>

                {/* Additional Dua Option 2 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dua Option 2 (More Complete)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَاجْبُرْنِي وَعَافِنِي وَارْزُقْنِي
                    </p>
                    <p className="text-sm italic mb-2">Rabbi-ghfir li warhamni wahdini wajburni wa 'afini warzuqni</p>
                    <p className="text-sm">My Lord, forgive me, have mercy on me, guide me, support me, give me health, and provide for me.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sunan Abu Dawud (850), Tirmidhi (284), Ibn Majah (898) - Authentic Hadith
                    </p>
                  </div>
                </div>

                {/* Additional Dua Option 3 */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Additional Dua Option 3 (Most Complete)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي وَاجْبُرْنِي وَارْفَعْنِي
                    </p>
                    <p className="text-sm italic mb-2">Allahum-maghfir li warhamni wahdini wa 'afini warzuqni wajburni warfa'ni</p>
                    <p className="text-sm">O Allah, forgive me, have mercy on me, guide me, grant me health, provide for me, support me, and raise me in status.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Ibn Majah (898), graded Sahih by al-Albani. Comprehensive dua covering all needs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">10. Second Sujud</h3>
                <p className="text-muted-foreground mb-3">• Say: <strong className="text-foreground">"Allahu Akbar"</strong> and perform the second prostration exactly like the first</p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">11. Continue for Additional Rak'ahs</h3>
                <p className="text-muted-foreground">• After the second sujud, rise for the next rak'ah saying "Allahu Akbar"</p>
                <p className="text-muted-foreground mt-2">• Repeat steps 4-10 for each rak'ah</p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">12. Tashahhud (At-Tahiyyat)</h3>
                <p className="text-muted-foreground mb-3">Sit after every 2 rak'ahs and in the final sitting, recite:</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-lg mb-2 leading-loose">
                    ٱلتَّحِيَّاتُ لِلَّهِ وَٱلصَّلَوَاتُ وَٱلطَّيِّبَاتُ، ٱلسَّلَامُ عَلَيْكَ أَيُّهَا ٱلنَّبِيُّ وَرَحْمَةُ ٱللَّهِ وَبَرَكَاتُهُ، ٱلسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ ٱللَّهِ ٱلصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
                  </p>
                  <p className="text-sm mt-3">
                    All compliments, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no deity worthy of worship except Allah, and I bear witness that Muhammad is His servant and messenger.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">13. Salawat on the Prophet (ﷺ)</h3>
                <p className="text-muted-foreground mb-3">In the final sitting only, continue with:</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-lg mb-2 leading-loose">
                    ٱللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. ٱللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ
                  </p>
                  <p className="text-sm mt-3">
                    O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">14. Duas Before Tasleem (Highly Recommended)</h3>
                <p className="text-muted-foreground mb-4">After Tashahhud and Salawat, before saying Salaam, make these important duas. The Prophet (ﷺ) specifically taught these:</p>

                {/* Seeking Refuge from 4 Things */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">⭐ Essential Dua - Seeking Refuge from 4 Things (Highly Emphasized)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ
                    </p>
                    <p className="text-sm italic mb-2">
                      Allahumma inni a'udhu bika min 'adhabi jahannam, wa min 'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal
                    </p>
                    <p className="text-sm">
                      O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah (Dajjal).
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (1377) and Sahih Muslim (588) - The Prophet (ﷺ) STRONGLY emphasized this dua in every prayer
                    </p>
                  </div>
                </div>

                {/* For This World and Hereafter */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Dua for This World and Hereafter (Very Common)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
                    </p>
                    <p className="text-sm italic mb-2">
                      Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaaban-nar
                    </p>
                    <p className="text-sm">
                      Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Quran 2:201 - The most comprehensive dua, frequently recited by the Prophet (ﷺ)
                    </p>
                  </div>
                </div>

                {/* Abu Bakr's Dua */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Abu Bakr's Dua (Taught by the Prophet ﷺ)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ
                    </p>
                    <p className="text-sm italic mb-2">
                      Allahumma inni zalamtu nafsi zulman kathiran wa la yaghfirudh-dhunuba illa Ant, faghfir li maghfiratan min 'indik warhamni, innaka Antal-Ghafurur-Rahim
                    </p>
                    <p className="text-sm">
                      O Allah, I have greatly wronged myself and no one forgives sins but You. So grant me forgiveness from You and have mercy on me. Surely, You are Forgiving, Merciful.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (834) and Sahih Muslim (2705) - The Prophet (ﷺ) specifically taught this to Abu Bakr as-Siddiq
                    </p>
                  </div>
                </div>

                {/* For Forgiveness and Guidance */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Comprehensive Dua for Forgiveness and Guidance</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَسْرَفْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، لَا إِلَهَ إِلَّا أَنْتَ
                    </p>
                    <p className="text-sm italic mb-2">
                      Allahum-maghfir li ma qaddamtu wa ma akhkhartu, wa ma asrartu wa ma a'lantu, wa ma asraftu, wa ma Anta a'lamu bihi minni. Antal-Muqaddimu wa Antal-Mu'akhkhir, la ilaha illa Ant
                    </p>
                    <p className="text-sm">
                      O Allah, forgive me what I have sent before me and what I have left behind me, what I have concealed and what I have done openly, what I have done in excess, and what You are better aware of than I. You are the One who puts forward and You are the One who delays. There is no deity worthy of worship except You.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Muslim (771) - The Prophet (ﷺ) used to say this in his night prayers
                    </p>
                  </div>
                </div>

                {/* For Help in Dhikr and Worship */}
                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Dua for Help in Worship (Mu'adh ibn Jabal's Dua)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ
                    </p>
                    <p className="text-sm italic mb-2">
                      Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik
                    </p>
                    <p className="text-sm">
                      O Allah, help me to remember You, to thank You, and to worship You in the best manner.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih - Abu Dawud (1522), an-Nasa'i (1303) - The Prophet (ﷺ) told Mu'adh: "By Allah, I love you" and taught him to never leave this dua after every prayer
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 bg-primary/5 p-3 rounded-lg">
                  💡 <strong>Important:</strong> You can say all of these duas, or choose the ones you prefer. The Prophet (ﷺ) used different duas at different times. The most emphasized is the first one (seeking refuge from 4 things).
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">15. Tasleem (Concluding the Prayer)</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Turn your head to the right and say:</li>
                  <li className="ml-4"><strong className="text-foreground">"Assalamu alaikum wa rahmatullah"</strong></li>
                  <li className="ml-4 text-sm">(Peace and mercy of Allah be upon you)</li>
                  <li>• Turn your head to the left and say the same</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-card-premium rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Post-Prayer Dhikr</h2>

            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">1. Seek forgiveness (3 times):</p>
                <p className="font-arabic text-xl mb-2">أَسْتَغْفِرُ اللهَ</p>
                <p className="text-sm">Astaghfirullah (I seek forgiveness from Allah)</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">2. Then say:</p>
                <p className="font-arabic text-lg mb-2 leading-loose">
                  اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ
                </p>
                <p className="text-sm">
                  O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honor.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">3. Tasbih (33 times each):</p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Subhan'Allah</strong> (Glory be to Allah) - 33 times</li>
                  <li>• <strong>Alhamdulillah</strong> (All praise is for Allah) - 33 times</li>
                  <li>• <strong>Allahu Akbar</strong> (Allah is the Greatest) - 33 times</li>
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">4. Complete 100 with:</p>
                <p className="font-arabic text-lg mb-2 leading-loose">
                  لَا إِلَٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ
                </p>
                <p className="text-sm">
                  There is no deity worthy of worship except Allah alone, without partner. To Him belongs the dominion and to Him belongs all praise, and He is Able to do all things.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">5. Ayatul Kursi (Highly recommended after every Fard prayer):</p>
                <p className="text-sm text-muted-foreground">
                  Recite Ayatul Kursi (Quran 2:255). The Prophet (ﷺ) said: "Whoever recites it after every obligatory prayer, nothing prevents him from entering Paradise except death."
                </p>
              </div>
            </div>
          </div>

          {/* Special Prayers Section */}
          <div className="glass-card-premium rounded-2xl p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Special Prayers & Supplications</h2>
            </div>

            <div className="space-y-10">
              {/* Witr Prayer and Dua Qunoot */}
              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-bold mb-4 text-accent">1. Witr Prayer & Dua Qunoot</h3>
                <p className="text-muted-foreground mb-4">
                  Witr is an emphasized Sunnah prayer performed after Isha, consisting of an odd number of rak'ahs (usually 1, 3, or 5). Dua Qunoot is recited in the last rak'ah before or after Ruku'.
                </p>

                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">⭐ Dua Qunoot (Traditional Version)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ
                    </p>
                    <p className="text-sm italic mb-2 mt-3">
                      Allahumma-hdini fiman hadayt, wa 'afini fiman 'afayt, wa tawallani fiman tawallayt, wa barik li fima a'tayt, wa qini sharra ma qadayt, fa innaka taqdi wa la yuqda 'alayk, wa innahu la yadhillu man walayt, wa la ya'izzu man 'adayt, tabarakta Rabbana wa ta'alayt
                    </p>
                    <p className="text-sm">
                      O Allah, guide me among those You have guided, pardon me among those You have pardoned, befriend me among those You have befriended, bless me in what You have granted, and save me from the evil that You have decreed. Indeed, You decree, and none can pass decree upon You. For indeed, he whom You befriend can never be humiliated, and he whom You take as an enemy can never be honored. Blessed are You, our Lord, and Exalted.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sunan Abu Dawud (1425), Tirmidhi (464), authenticated by scholars
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Dua Qunoot Nazilah (For Calamities & Hardships)</p>
                  <p className="text-xs text-muted-foreground mb-3">This special Qunoot is recited during times of calamity, war, or severe hardship affecting the Muslim community:</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      اللَّهُمَّ أَنْجِ الْمُسْتَضْعَفِينَ مِنَ الْمُؤْمِنِينَ، اللَّهُمَّ اشْدُدْ وَطْأَتَكَ عَلَى مُضَرَ، اللَّهُمَّ اجْعَلْهَا عَلَيْهِمْ سِنِينَ كَسِنِي يُوسُفَ، اللَّهُمَّ عَذِّبْ كَفَرَةَ أَهْلِ الْكِتَابِ الَّذِينَ يَصُدُّونَ عَنْ سَبِيلِكَ
                    </p>
                    <p className="text-sm italic mb-2 mt-3">
                      Allahumma anjil-mustad'afina minal-mu'minin. Allahum-ashdud wat'ataka 'ala Mudar. Allahum-aj'alha 'alayhim sinina ka-sini Yusuf. Allahumma 'adhdhib kafaratal-ahlil-kitabi alladhina yasudduna 'an sabilik
                    </p>
                    <p className="text-sm">
                      O Allah, save the oppressed and weak believers. O Allah, intensify Your grip on Mudar (tribe). O Allah, afflict them with years of famine like the years of Yusuf. O Allah, punish the disbelievers among the People of the Book who hinder others from Your path.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (1006) - The Prophet (ﷺ) made this dua during Qunoot Nazilah
                    </p>
                  </div>
                </div>
              </div>

              {/* Tahajjud Prayer */}
              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-bold mb-4 text-accent">2. Tahajjud (Night Prayer)</h3>
                <p className="text-muted-foreground mb-4">
                  Tahajjud is the most virtuous voluntary prayer, performed in the last third of the night. The Prophet (ﷺ) said: "The best prayer after the obligatory prayers is the night prayer" (Sahih Muslim 1163).
                </p>

                <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mb-4">
                  <p className="font-semibold text-primary mb-2">⭐ Best Time for Tahajjud</p>
                  <p className="text-sm text-muted-foreground">
                    The last third of the night, when Allah descends to the lowest heaven and says: "Who is calling upon Me that I may answer him? Who is asking from Me that I may give him? Who is seeking My forgiveness that I may forgive him?" (Sahih Bukhari 1145)
                  </p>
                </div>

                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">Opening Dua for Tahajjud (When You Wake Up)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-xl mb-2 text-center leading-loose">
                      الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ
                    </p>
                    <p className="text-sm italic mb-2">
                      Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur
                    </p>
                    <p className="text-sm">
                      All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (6312) - Say this when waking up for Tahajjud
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">How to Pray Tahajjud</p>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Pray in sets of 2 rak'ahs (minimum 2, can go up to 8 or more)</li>
                    <li>• The Prophet (ﷺ) usually prayed 11 rak'ahs total</li>
                    <li>• End with Witr (1 or 3 rak'ahs)</li>
                    <li>• Use the special Tahajjud opening dua (mentioned in Step 2 of prayer guide above)</li>
                    <li>• Recite longer portions of Quran if possible</li>
                    <li>• Make abundant dua in Sujud</li>
                  </ul>
                </div>
              </div>

              {/* Duha Prayer */}
              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-bold mb-4 text-accent">3. Salat ad-Duha (Forenoon Prayer)</h3>
                <p className="text-muted-foreground mb-4">
                  A voluntary prayer performed after sunrise (about 15-20 minutes) until just before Dhuhr. It brings immense blessings and rewards.
                </p>

                <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mb-4">
                  <p className="font-semibold text-primary mb-2">⭐ Virtues of Duha Prayer</p>
                  <p className="text-sm text-muted-foreground">
                    The Prophet (ﷺ) said: "Every morning there is a charity due from every joint in your body. Every tasbih is charity, every tahmid is charity, every tahlil is charity, commanding good is charity, forbidding evil is charity, and in place of all this, two rak'ahs of Duha are sufficient." (Sahih Muslim 720)
                  </p>
                </div>

                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">How to Pray Duha</p>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Minimum: 2 rak'ahs</li>
                    <li>• Recommended: 4 or 8 rak'ahs</li>
                    <li>• Pray in sets of 2 rak'ahs</li>
                    <li>• Best time: When the sun rises high and the day gets hot (mid-morning)</li>
                    <li>• Recite any surahs you wish after Al-Fatihah</li>
                  </ul>
                </div>
              </div>

              {/* Salat al-Istikhara */}
              <div className="border-l-4 border-accent pl-6">
                <h3 className="text-xl font-bold mb-4 text-accent">4. Salat al-Istikhara (Prayer for Guidance)</h3>
                <p className="text-muted-foreground mb-4">
                  A 2-rak'ah prayer performed when you need to make an important decision. The Prophet (ﷺ) said: "If any one of you is concerned about a decision, let him pray two rak'ahs of non-obligatory prayer, then say..." (Sahih Bukhari 1162)
                </p>

                <div className="mb-6">
                  <p className="font-semibold text-primary mb-3">How to Perform Istikhara</p>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4 mb-4">
                    <li>• Make wudu and pray 2 rak'ahs (like any voluntary prayer)</li>
                    <li>• After completing the prayer and saying Salaam, recite the Istikhara dua</li>
                    <li>• Make your specific request/decision in the dua</li>
                    <li>• Trust Allah's plan - proceed with your decision and watch for ease or difficulty</li>
                    <li>• You don't need to see a dream - guidance comes through ease in the matter</li>
                  </ul>

                  <p className="font-semibold text-primary mb-3">⭐ Dua al-Istikhara (Complete)</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-arabic text-lg mb-2 text-center leading-loose">
                      اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ [mention your matter here] خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِي الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ
                    </p>
                    <p className="text-sm italic mb-2 mt-3">
                      Allahumma inni astakhiruka bi'ilmik, wa astaqdiruka bi-qudratik, wa as'aluka min fadlikal-'adhim, fa innaka taqdiru wa la aqdir, wa ta'lamu wa la a'lam, wa Anta 'Allamul-ghuyub. Allahumma in kunta ta'lamu anna hadhal-amra [mention your matter] khayrun li fi dini wa ma'ashi wa 'aqibati amri faqdurhu li wa yassirhu li thumma barik li fih. Wa in kunta ta'lamu anna hadhal-amra sharrun li fi dini wa ma'ashi wa 'aqibati amri fasrifhu 'anni wasrifni 'anh, waqdur liyal-khayra haythu kana thumma ardini bih
                    </p>
                    <p className="text-sm">
                      O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty. For You have power and I have none. You know and I know not. You are the Knower of hidden things. O Allah, if You know that this matter [mention your specific matter] is good for me in my religion, my livelihood, and the end of my affair, then decree it for me, facilitate it for me, and bless me in it. And if You know that this matter is bad for me in my religion, my livelihood, and the end of my affair, then turn it away from me and turn me away from it, and decree for me what is good wherever it may be, and cause me to be pleased with it.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Source:</strong> Sahih Bukhari (1162) - The complete Istikhara dua taught by the Prophet (ﷺ)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Mistakes and Etiquettes Section */}
          <div className="glass-card-premium rounded-2xl p-8 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Common Mistakes & Prayer Etiquettes</h2>
            </div>

            <div className="space-y-10">
              {/* Common Mistakes */}
              <div className="border-l-4 border-destructive pl-6">
                <h3 className="text-xl font-bold mb-4 text-destructive">❌ Common Mistakes to Avoid</h3>

                <div className="space-y-4">
                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">1. Not Placing All Seven Body Parts Properly in Sujud</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Not placing the nose on the ground, or lifting feet/knees off the ground.<br/>
                      <strong>Correct:</strong> All 7 body parts must touch the ground: forehead, nose, both palms, both knees, and toes of both feet.
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">2. Praying Without Proper Covering (Awrah)</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Men praying with clothes that don't cover from navel to knees, or women not covering properly.<br/>
                      <strong>Correct:</strong> Men must cover at minimum from navel to knees. Women must cover everything except face and hands.
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">3. Rushing Through Prayer (Not Maintaining Tranquility)</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Moving too fast, not staying still in positions, pecking like a crow in Sujud.<br/>
                      <strong>Correct:</strong> Maintain calmness (Tuma'neenah) in each position. The Prophet (ﷺ) told a man: "Go back and pray, for you have not prayed" because he rushed. (Sahih Bukhari 757)
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">4. Not Reciting Al-Fatihah Properly</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Skipping Al-Fatihah or not reciting it in every rak'ah.<br/>
                      <strong>Correct:</strong> Al-Fatihah is REQUIRED in every rak'ah. The Prophet (ﷺ) said: "There is no prayer for the one who does not recite the Opening of the Book (Al-Fatihah)" (Sahih Bukhari 756)
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">5. Incorrect Position of Hands During Standing</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Letting hands hang by sides or placing them incorrectly.<br/>
                      <strong>Correct:</strong> Place right hand over left hand on the chest (according to authentic hadith in Sahih Ibn Khuzaymah)
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">6. Raising Hands at Wrong Times</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Raising hands during Sujud or at incorrect times.<br/>
                      <strong>Correct:</strong> Raise hands only at: (1) Opening Takbir, (2) Going to Ruku', (3) Rising from Ruku', (4) Standing after first Tashahhud
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">7. Looking Around or Up During Prayer</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Looking at ceiling, people, or around the room.<br/>
                      <strong>Correct:</strong> Look at the place of Sujud (where you prostrate). The Prophet (ﷺ) warned: "Let those who raise their gaze during prayer stop doing so, or their sight will be taken away" (Sahih Muslim 428)
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">8. Praying in Impure Clothing or Place</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Praying with najasah (impurity) on body, clothes, or prayer spot.<br/>
                      <strong>Correct:</strong> Ensure body, clothes, and place of prayer are all clean and pure
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">9. Not Following the Imam Properly (in Congregation)</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Moving before the Imam or at the same time.<br/>
                      <strong>Correct:</strong> The Prophet (ﷺ) said: "The Imam is to be followed. Say Takbir when he says it, bow when he bows, and prostrate when he prostrates" (Sahih Bukhari 734)
                    </p>
                  </div>

                  <div className="bg-destructive/10 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">10. Forgetting Dua Before Tasleem</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Mistake:</strong> Making Salam immediately after Salawat without any dua.<br/>
                      <strong>Correct:</strong> Make at least the essential dua (seeking refuge from 4 things) before Tasleem. This is strongly emphasized.
                    </p>
                  </div>
                </div>
              </div>

              {/* Etiquettes */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">✓ Prayer Etiquettes (Adab)</h3>

                <div className="space-y-6">
                  {/* Before Prayer */}
                  <div>
                    <p className="font-semibold text-primary mb-3">Before Starting Prayer:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li>• Make sure you have proper wudu (ablution)</li>
                      <li>• Face the Qiblah (direction of Ka'bah in Makkah)</li>
                      <li>• Pray on time - don't delay unnecessarily</li>
                      <li>• Choose a clean, quiet place free from distractions</li>
                      <li>• Use Siwak (tooth stick) if available - the Prophet (ﷺ) said: "If it were not that it would be difficult on my Ummah, I would have ordered them to use the siwak for every prayer" (Sahih Bukhari 887)</li>
                      <li>• Dress modestly and neatly - Allah is most deserving of beautification</li>
                      <li>• Remove anything distracting from in front of you</li>
                    </ul>
                  </div>

                  {/* During Prayer */}
                  <div>
                    <p className="font-semibold text-primary mb-3">During Prayer:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li>• <strong>Maintain Khushu' (Humility & Focus):</strong> The Prophet (ﷺ) said: "Allah does not accept the prayer of a person who does not bring his heart to presence along with his body" (Sunan Abu Dawud 904)</li>
                      <li>• Think about the meaning of what you're reciting</li>
                      <li>• Remember you are standing before Allah - imagine you see Him</li>
                      <li>• Keep your eyes on the place of prostration</li>
                      <li>• Avoid excessive movement - only what is necessary</li>
                      <li>• Don't scratch, yawn, or fidget unnecessarily</li>
                      <li>• Recite in a moderate voice during loud prayers (not too loud or too soft)</li>
                      <li>• Take your time - don't rush</li>
                      <li>• If you need to cough or sneeze, do so quietly</li>
                    </ul>
                  </div>

                  {/* Special Etiquettes */}
                  <div>
                    <p className="font-semibold text-primary mb-3">Special Etiquettes:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li>• <strong>In Congregation:</strong> Stand shoulder to shoulder, close the gaps, straighten the rows. The Prophet (ﷺ) emphasized: "Straighten your rows or Allah will cause discord among you" (Sahih Bukhari 717)</li>
                      <li>• <strong>For Women:</strong> It's better to pray at home unless there's a need. The Prophet (ﷺ) said: "The best rows for men are the first rows... and the best rows for women are the last rows" (Sahih Muslim 440)</li>
                      <li>• <strong>Praying at Home:</strong> Pray voluntary prayers at home when possible. The Prophet (ﷺ) said: "The best prayer is the prayer at home, except the obligatory prayers" (Sahih Bukhari 731)</li>
                      <li>• <strong>Use a Sutrah:</strong> Place something in front of you (like a chair or stick) when praying alone to prevent people from walking in front of you</li>
                      <li>• <strong>Don't Pass in Front:</strong> Never walk in front of someone praying. The Prophet (ﷺ) said: "If the one who passes in front of a praying person knew what was upon him, it would be better for him to wait for forty than to pass in front of him" (Sahih Bukhari 510)</li>
                    </ul>
                  </div>

                  {/* After Prayer */}
                  <div>
                    <p className="font-semibold text-primary mb-3">After Prayer:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li>• Immediately say "Astaghfirullah" three times</li>
                      <li>• Make the post-prayer adhkar (mentioned earlier)</li>
                      <li>• Don't rush to leave - sit calmly for a moment</li>
                      <li>• Make personal duas in your own language</li>
                      <li>• Recite Quran if you have time</li>
                      <li>• Try to maintain the spiritual state throughout the day</li>
                    </ul>
                  </div>

                  {/* Attitude Towards Prayer */}
                  <div className="bg-primary/5 rounded-lg p-4 mt-4">
                    <p className="font-semibold text-primary mb-2">⭐ The Attitude of the Heart:</p>
                    <p className="text-sm text-muted-foreground">
                      The Prophet (ﷺ) said: "Prayer is the comfort of my eye" (Sunan an-Nasa'i 3940). Approach prayer with love, not as a burden. Remember, it's your direct connection with Allah, your Creator. It's not just physical movements - it's a spiritual journey five times a day. The more you focus on quality over quantity, the more you'll taste the sweetness of Salah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card-premium rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Number of Rak'ahs for Each Prayer</h2>

            <div className="grid gap-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="font-semibold">Fajr</span>
                <span className="text-muted-foreground">2 Sunnah + 2 Fard</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="font-semibold">Dhuhr</span>
                <span className="text-muted-foreground">4 Sunnah + 4 Fard + 2 Sunnah</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="font-semibold">Asr</span>
                <span className="text-muted-foreground">4 Fard</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="font-semibold">Maghrib</span>
                <span className="text-muted-foreground">3 Fard + 2 Sunnah</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="font-semibold">Isha</span>
                <span className="text-muted-foreground">4 Fard + 2 Sunnah + 3 Witr</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/salah/wisdom">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
                Explore the Wisdom Behind Each Movement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
