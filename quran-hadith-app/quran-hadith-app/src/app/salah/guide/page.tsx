import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
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
                <h3 className="text-xl font-bold mb-4">2. Opening Dua (Optional but recommended)</h3>
                <div className="bg-muted/50 rounded-lg p-4 mb-3">
                  <p className="font-arabic text-xl mb-2 text-center">
                    سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ
                  </p>
                  <p className="text-sm italic mb-2">
                    Subhanakallahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk
                  </p>
                  <p className="text-sm">
                    Glory be to You, O Allah, and praise be to You. Blessed is Your Name and Exalted is Your Majesty. There is no deity worthy of worship except You.
                  </p>
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
                  <li>• Say at least once (recommended 3 times):</li>
                </ul>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-xl mb-2 text-center">
                    سُبْحَانَ رَبِّيَ الْعَظِيمِ
                  </p>
                  <p className="text-sm italic mb-2">Subhana Rabbiyal-Adheem</p>
                  <p className="text-sm">Glory be to my Lord, the Most Great.</p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">7. Rising from Ruku'</h3>
                <ul className="space-y-3 text-muted-foreground mb-4">
                  <li>• While rising, say:</li>
                </ul>
                <div className="bg-muted/50 rounded-lg p-4 mb-3">
                  <p className="font-arabic text-xl mb-2 text-center">
                    سَمِعَ اللهُ لِمَنْ حَمِدَهُ
                  </p>
                  <p className="text-sm italic mb-2">Sami'Allahu liman hamidah</p>
                  <p className="text-sm">Allah hears those who praise Him.</p>
                </div>
                <ul className="space-y-3 text-muted-foreground mb-4">
                  <li>• When standing upright, say:</li>
                </ul>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-xl mb-2 text-center">
                    رَبَّنَا وَلَكَ الْحَمْدُ
                  </p>
                  <p className="text-sm italic mb-2">Rabbana wa lakal-hamd</p>
                  <p className="text-sm">Our Lord, all praise is for You.</p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">8. First Sujud (Prostration)</h3>
                <ul className="space-y-3 text-muted-foreground mb-4">
                  <li>• Say: <strong className="text-foreground">"Allahu Akbar"</strong> and go down to prostration</li>
                  <li>• Prostrate on 7 body parts: forehead & nose, both palms, both knees, toes of both feet</li>
                  <li>• Say at least once (recommended 3 times):</li>
                </ul>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-xl mb-2 text-center">
                    سُبْحَانَ رَبِّيَ الأَعْلَى
                  </p>
                  <p className="text-sm italic mb-2">Subhana Rabbiyal-A'la</p>
                  <p className="text-sm">Glory be to my Lord, the Most High.</p>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold mb-4">9. Sitting Between Two Prostrations</h3>
                <ul className="space-y-3 text-muted-foreground mb-4">
                  <li>• Say: <strong className="text-foreground">"Allahu Akbar"</strong> and sit up</li>
                  <li>• Sit on your left foot with right foot upright</li>
                  <li>• Say:</li>
                </ul>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-xl mb-2 text-center">
                    رَبِّ اغْفِرْ لِي
                  </p>
                  <p className="text-sm italic mb-2">Rabbi-ghfir li</p>
                  <p className="text-sm">My Lord, forgive me.</p>
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
                <h3 className="text-xl font-bold mb-4">14. Dua Before Tasleem (Recommended)</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-arabic text-xl mb-2 text-center">
                    رَبَّنَا آتِنَا فِي ٱلدُّنْيَا حَسَنَةً وَفِي ٱلْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ
                  </p>
                  <p className="text-sm mt-3">
                    Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.
                  </p>
                </div>
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
