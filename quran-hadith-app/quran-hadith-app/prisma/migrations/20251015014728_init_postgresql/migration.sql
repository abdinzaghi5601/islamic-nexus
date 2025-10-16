-- CreateTable
CREATE TABLE "surahs" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "nameArabic" VARCHAR(100) NOT NULL,
    "nameEnglish" VARCHAR(100) NOT NULL,
    "nameTranslation" VARCHAR(200) NOT NULL,
    "revelationType" VARCHAR(20) NOT NULL,
    "numberOfAyahs" INTEGER NOT NULL,
    "bismillahPre" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surahs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayahs" (
    "id" SERIAL NOT NULL,
    "surahId" INTEGER NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "numberInQuran" INTEGER NOT NULL,
    "textArabic" TEXT NOT NULL,
    "textUthmani" TEXT NOT NULL,
    "textSimple" TEXT NOT NULL,
    "juz" INTEGER NOT NULL,
    "manzil" INTEGER NOT NULL,
    "ruku" INTEGER NOT NULL,
    "hizbQuarter" INTEGER NOT NULL,
    "sajdah" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayahs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "translatorId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translators" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "language" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tafsir_books" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "authorName" VARCHAR(200) NOT NULL,
    "language" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tafsir_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tafsir_verses" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "tafsirBookId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tafsir_verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_books" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "nameArabic" VARCHAR(200),
    "author" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "totalHadiths" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadith_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_chapters" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "nameArabic" VARCHAR(500),
    "nameEnglish" VARCHAR(500) NOT NULL,
    "intro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadith_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadiths" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "chapterId" INTEGER,
    "hadithNumber" VARCHAR(50) NOT NULL,
    "hadithInChapter" INTEGER,
    "textArabic" TEXT NOT NULL,
    "textEnglish" TEXT NOT NULL,
    "narratorChain" TEXT,
    "grade" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadiths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_ayah_references" (
    "id" SERIAL NOT NULL,
    "hadithId" INTEGER NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hadith_ayah_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "dua_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameArabic" VARCHAR(100),
    "description" TEXT,
    "icon" VARCHAR(50),
    "slug" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dua_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duas" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "titleArabic" VARCHAR(300),
    "textArabic" TEXT NOT NULL,
    "textEnglish" TEXT NOT NULL,
    "transliteration" TEXT,
    "reference" VARCHAR(500),
    "tags" TEXT,
    "benefits" TEXT,
    "occasion" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "duas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dua_bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "duaId" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dua_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "titleArabic" VARCHAR(300),
    "author" VARCHAR(200) NOT NULL,
    "authorArabic" VARCHAR(200),
    "category" VARCHAR(100) NOT NULL,
    "language" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "pdfUrl" VARCHAR(500),
    "pdfPath" VARCHAR(500),
    "totalPages" INTEGER,
    "fileSize" BIGINT,
    "coverImageUrl" VARCHAR(500),
    "publisher" VARCHAR(200),
    "publishYear" INTEGER,
    "isbn" VARCHAR(50),
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_chunks" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "chunkNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "startPosition" INTEGER,
    "endPosition" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "pageNumber" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hadithId" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadith_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surahId" INTEGER,
    "ayahId" INTEGER,
    "hadithId" INTEGER,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ayahId" INTEGER,
    "hadithId" INTEGER,
    "title" VARCHAR(200),
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayah_lessons" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "lessonText" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "tags" TEXT,
    "source" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayah_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayah_duas" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "duaId" INTEGER,
    "arabicText" TEXT NOT NULL,
    "transliteration" TEXT,
    "translation" TEXT NOT NULL,
    "occasion" VARCHAR(200),
    "benefits" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayah_duas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayah_themes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameArabic" VARCHAR(100),
    "description" TEXT,
    "slug" VARCHAR(100) NOT NULL,
    "parentThemeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayah_themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayah_theme_mappings" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,
    "relevance" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ayah_theme_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ayah_words" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "textArabic" VARCHAR(200) NOT NULL,
    "textSimplified" VARCHAR(200),
    "transliteration" VARCHAR(200),
    "rootId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayah_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_translations" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "language" VARCHAR(50) NOT NULL,
    "translation" VARCHAR(200) NOT NULL,
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_grammar" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "partOfSpeech" VARCHAR(50) NOT NULL,
    "root" VARCHAR(20),
    "form" VARCHAR(20),
    "mood" VARCHAR(50),
    "case_" VARCHAR(50),
    "number" VARCHAR(20),
    "gender" VARCHAR(20),
    "person" VARCHAR(20),
    "tense" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_grammar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_roots" (
    "id" SERIAL NOT NULL,
    "root" VARCHAR(20) NOT NULL,
    "rootSimple" VARCHAR(20) NOT NULL,
    "meaning" TEXT NOT NULL,
    "occurrences" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_roots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tajweed_rules" (
    "id" SERIAL NOT NULL,
    "ruleId" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nameArabic" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "examples" TEXT NOT NULL,
    "color" VARCHAR(20),
    "textColor" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tajweed_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tajweed_applications" (
    "id" SERIAL NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "ruleId" INTEGER NOT NULL,
    "startPosition" INTEGER NOT NULL,
    "endPosition" INTEGER NOT NULL,
    "affectedText" VARCHAR(200) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tajweed_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memorization_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "targetType" VARCHAR(50) NOT NULL,
    "startSurahId" INTEGER,
    "endSurahId" INTEGER,
    "startAyahId" INTEGER,
    "endAyahId" INTEGER,
    "targetDate" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memorization_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memorization_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "ayahId" INTEGER NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "repetitions" INTEGER NOT NULL DEFAULT 1,
    "confidence" INTEGER NOT NULL DEFAULT 3,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memorization_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memorization_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalId" TEXT,
    "ayahId" INTEGER NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReviewDate" TIMESTAMP(3) NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "recalled" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memorization_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_items" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "wordId" INTEGER,
    "rootId" INTEGER,
    "arabicText" VARCHAR(200) NOT NULL,
    "transliteration" VARCHAR(200),
    "meaning" TEXT NOT NULL,
    "example" TEXT,
    "mastery" INTEGER NOT NULL DEFAULT 0,
    "lastReviewed" TIMESTAMP(3),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wordsLearned" INTEGER NOT NULL DEFAULT 0,
    "ayahsMemorized" INTEGER NOT NULL DEFAULT 0,
    "reviewsCompleted" INTEGER NOT NULL DEFAULT 0,
    "studyMinutes" INTEGER NOT NULL DEFAULT 0,
    "tajweedPractice" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_morphology" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "stem" VARCHAR(100) NOT NULL,
    "lemma" VARCHAR(100) NOT NULL,
    "prefix" VARCHAR(50),
    "suffix" VARCHAR(50),
    "pattern" VARCHAR(50),
    "arabicPattern" VARCHAR(50),
    "englishPattern" VARCHAR(200),
    "aspects" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_morphology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arabic_dictionary" (
    "id" SERIAL NOT NULL,
    "arabic" VARCHAR(200) NOT NULL,
    "root" VARCHAR(20) NOT NULL,
    "definition" TEXT NOT NULL,
    "examples" TEXT,
    "partOfSpeech" VARCHAR(50) NOT NULL,
    "usageNotes" TEXT,
    "frequency" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arabic_dictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verb_conjugations" (
    "id" SERIAL NOT NULL,
    "rootId" INTEGER NOT NULL,
    "verbForm" VARCHAR(20) NOT NULL,
    "tense" VARCHAR(50) NOT NULL,
    "person" VARCHAR(20) NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "arabicText" VARCHAR(100) NOT NULL,
    "transliteration" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verb_conjugations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_narrators" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "nameArabic" VARCHAR(200) NOT NULL,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "reliability" VARCHAR(50),
    "biography" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadith_narrators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_chains" (
    "id" SERIAL NOT NULL,
    "hadithId" INTEGER NOT NULL,
    "narratorId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hadith_chains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "surahs_number_key" ON "surahs"("number");

-- CreateIndex
CREATE INDEX "surahs_number_idx" ON "surahs"("number");

-- CreateIndex
CREATE UNIQUE INDEX "ayahs_numberInQuran_key" ON "ayahs"("numberInQuran");

-- CreateIndex
CREATE INDEX "ayahs_surahId_idx" ON "ayahs"("surahId");

-- CreateIndex
CREATE INDEX "ayahs_juz_idx" ON "ayahs"("juz");

-- CreateIndex
CREATE INDEX "ayahs_numberInQuran_idx" ON "ayahs"("numberInQuran");

-- CreateIndex
CREATE UNIQUE INDEX "ayahs_surahId_ayahNumber_key" ON "ayahs"("surahId", "ayahNumber");

-- CreateIndex
CREATE INDEX "translations_ayahId_idx" ON "translations"("ayahId");

-- CreateIndex
CREATE INDEX "translations_translatorId_idx" ON "translations"("translatorId");

-- CreateIndex
CREATE UNIQUE INDEX "translations_ayahId_translatorId_key" ON "translations"("ayahId", "translatorId");

-- CreateIndex
CREATE INDEX "tafsir_verses_ayahId_idx" ON "tafsir_verses"("ayahId");

-- CreateIndex
CREATE INDEX "tafsir_verses_tafsirBookId_idx" ON "tafsir_verses"("tafsirBookId");

-- CreateIndex
CREATE UNIQUE INDEX "tafsir_verses_ayahId_tafsirBookId_key" ON "tafsir_verses"("ayahId", "tafsirBookId");

-- CreateIndex
CREATE INDEX "hadith_chapters_bookId_idx" ON "hadith_chapters"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "hadith_chapters_bookId_chapterNumber_key" ON "hadith_chapters"("bookId", "chapterNumber");

-- CreateIndex
CREATE INDEX "hadiths_bookId_idx" ON "hadiths"("bookId");

-- CreateIndex
CREATE INDEX "hadiths_chapterId_idx" ON "hadiths"("chapterId");

-- CreateIndex
CREATE INDEX "hadiths_grade_idx" ON "hadiths"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "hadiths_bookId_hadithNumber_key" ON "hadiths"("bookId", "hadithNumber");

-- CreateIndex
CREATE INDEX "hadith_ayah_references_hadithId_idx" ON "hadith_ayah_references"("hadithId");

-- CreateIndex
CREATE INDEX "hadith_ayah_references_ayahId_idx" ON "hadith_ayah_references"("ayahId");

-- CreateIndex
CREATE UNIQUE INDEX "hadith_ayah_references_hadithId_ayahId_key" ON "hadith_ayah_references"("hadithId", "ayahId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "dua_categories_slug_key" ON "dua_categories"("slug");

-- CreateIndex
CREATE INDEX "duas_categoryId_idx" ON "duas"("categoryId");

-- CreateIndex
CREATE INDEX "dua_bookmarks_userId_idx" ON "dua_bookmarks"("userId");

-- CreateIndex
CREATE INDEX "dua_bookmarks_duaId_idx" ON "dua_bookmarks"("duaId");

-- CreateIndex
CREATE UNIQUE INDEX "dua_bookmarks_userId_duaId_key" ON "dua_bookmarks"("userId", "duaId");

-- CreateIndex
CREATE INDEX "books_category_idx" ON "books"("category");

-- CreateIndex
CREATE INDEX "books_language_idx" ON "books"("language");

-- CreateIndex
CREATE INDEX "book_chunks_bookId_idx" ON "book_chunks"("bookId");

-- CreateIndex
CREATE INDEX "book_chunks_pageNumber_idx" ON "book_chunks"("pageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "book_chunks_bookId_pageNumber_chunkNumber_key" ON "book_chunks"("bookId", "pageNumber", "chunkNumber");

-- CreateIndex
CREATE INDEX "book_bookmarks_userId_idx" ON "book_bookmarks"("userId");

-- CreateIndex
CREATE INDEX "book_bookmarks_bookId_idx" ON "book_bookmarks"("bookId");

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "bookmarks"("userId");

-- CreateIndex
CREATE INDEX "bookmarks_ayahId_idx" ON "bookmarks"("ayahId");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_ayahId_key" ON "bookmarks"("userId", "ayahId");

-- CreateIndex
CREATE INDEX "hadith_bookmarks_userId_idx" ON "hadith_bookmarks"("userId");

-- CreateIndex
CREATE INDEX "hadith_bookmarks_hadithId_idx" ON "hadith_bookmarks"("hadithId");

-- CreateIndex
CREATE UNIQUE INDEX "hadith_bookmarks_userId_hadithId_key" ON "hadith_bookmarks"("userId", "hadithId");

-- CreateIndex
CREATE INDEX "reading_history_userId_idx" ON "reading_history"("userId");

-- CreateIndex
CREATE INDEX "reading_history_readAt_idx" ON "reading_history"("readAt");

-- CreateIndex
CREATE INDEX "notes_userId_idx" ON "notes"("userId");

-- CreateIndex
CREATE INDEX "ayah_lessons_ayahId_idx" ON "ayah_lessons"("ayahId");

-- CreateIndex
CREATE INDEX "ayah_lessons_category_idx" ON "ayah_lessons"("category");

-- CreateIndex
CREATE INDEX "ayah_duas_ayahId_idx" ON "ayah_duas"("ayahId");

-- CreateIndex
CREATE INDEX "ayah_duas_duaId_idx" ON "ayah_duas"("duaId");

-- CreateIndex
CREATE UNIQUE INDEX "ayah_themes_slug_key" ON "ayah_themes"("slug");

-- CreateIndex
CREATE INDEX "ayah_themes_parentThemeId_idx" ON "ayah_themes"("parentThemeId");

-- CreateIndex
CREATE INDEX "ayah_theme_mappings_ayahId_idx" ON "ayah_theme_mappings"("ayahId");

-- CreateIndex
CREATE INDEX "ayah_theme_mappings_themeId_idx" ON "ayah_theme_mappings"("themeId");

-- CreateIndex
CREATE UNIQUE INDEX "ayah_theme_mappings_ayahId_themeId_key" ON "ayah_theme_mappings"("ayahId", "themeId");

-- CreateIndex
CREATE INDEX "ayah_words_ayahId_idx" ON "ayah_words"("ayahId");

-- CreateIndex
CREATE INDEX "ayah_words_rootId_idx" ON "ayah_words"("rootId");

-- CreateIndex
CREATE UNIQUE INDEX "ayah_words_ayahId_position_key" ON "ayah_words"("ayahId", "position");

-- CreateIndex
CREATE INDEX "word_translations_wordId_idx" ON "word_translations"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "word_translations_wordId_language_key" ON "word_translations"("wordId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "word_grammar_wordId_key" ON "word_grammar"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "word_roots_root_key" ON "word_roots"("root");

-- CreateIndex
CREATE INDEX "word_roots_root_idx" ON "word_roots"("root");

-- CreateIndex
CREATE UNIQUE INDEX "tajweed_rules_ruleId_key" ON "tajweed_rules"("ruleId");

-- CreateIndex
CREATE INDEX "tajweed_rules_category_idx" ON "tajweed_rules"("category");

-- CreateIndex
CREATE INDEX "tajweed_applications_ayahId_idx" ON "tajweed_applications"("ayahId");

-- CreateIndex
CREATE INDEX "tajweed_applications_ruleId_idx" ON "tajweed_applications"("ruleId");

-- CreateIndex
CREATE INDEX "memorization_goals_userId_idx" ON "memorization_goals"("userId");

-- CreateIndex
CREATE INDEX "memorization_goals_status_idx" ON "memorization_goals"("status");

-- CreateIndex
CREATE INDEX "memorization_sessions_userId_idx" ON "memorization_sessions"("userId");

-- CreateIndex
CREATE INDEX "memorization_sessions_goalId_idx" ON "memorization_sessions"("goalId");

-- CreateIndex
CREATE INDEX "memorization_sessions_ayahId_idx" ON "memorization_sessions"("ayahId");

-- CreateIndex
CREATE INDEX "memorization_sessions_sessionDate_idx" ON "memorization_sessions"("sessionDate");

-- CreateIndex
CREATE INDEX "memorization_reviews_userId_idx" ON "memorization_reviews"("userId");

-- CreateIndex
CREATE INDEX "memorization_reviews_goalId_idx" ON "memorization_reviews"("goalId");

-- CreateIndex
CREATE INDEX "memorization_reviews_ayahId_idx" ON "memorization_reviews"("ayahId");

-- CreateIndex
CREATE INDEX "memorization_reviews_nextReviewDate_idx" ON "memorization_reviews"("nextReviewDate");

-- CreateIndex
CREATE INDEX "vocabulary_lists_userId_idx" ON "vocabulary_lists"("userId");

-- CreateIndex
CREATE INDEX "vocabulary_items_listId_idx" ON "vocabulary_items"("listId");

-- CreateIndex
CREATE INDEX "vocabulary_items_wordId_idx" ON "vocabulary_items"("wordId");

-- CreateIndex
CREATE INDEX "vocabulary_items_rootId_idx" ON "vocabulary_items"("rootId");

-- CreateIndex
CREATE INDEX "learning_progress_userId_idx" ON "learning_progress"("userId");

-- CreateIndex
CREATE INDEX "learning_progress_date_idx" ON "learning_progress"("date");

-- CreateIndex
CREATE UNIQUE INDEX "learning_progress_userId_date_key" ON "learning_progress"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "word_morphology_wordId_key" ON "word_morphology"("wordId");

-- CreateIndex
CREATE INDEX "word_morphology_wordId_idx" ON "word_morphology"("wordId");

-- CreateIndex
CREATE INDEX "word_morphology_stem_idx" ON "word_morphology"("stem");

-- CreateIndex
CREATE INDEX "word_morphology_lemma_idx" ON "word_morphology"("lemma");

-- CreateIndex
CREATE INDEX "arabic_dictionary_arabic_idx" ON "arabic_dictionary"("arabic");

-- CreateIndex
CREATE INDEX "arabic_dictionary_root_idx" ON "arabic_dictionary"("root");

-- CreateIndex
CREATE INDEX "arabic_dictionary_partOfSpeech_idx" ON "arabic_dictionary"("partOfSpeech");

-- CreateIndex
CREATE INDEX "verb_conjugations_rootId_idx" ON "verb_conjugations"("rootId");

-- CreateIndex
CREATE INDEX "verb_conjugations_verbForm_idx" ON "verb_conjugations"("verbForm");

-- CreateIndex
CREATE INDEX "verb_conjugations_tense_idx" ON "verb_conjugations"("tense");

-- CreateIndex
CREATE INDEX "hadith_narrators_name_idx" ON "hadith_narrators"("name");

-- CreateIndex
CREATE INDEX "hadith_narrators_reliability_idx" ON "hadith_narrators"("reliability");

-- CreateIndex
CREATE INDEX "hadith_chains_hadithId_idx" ON "hadith_chains"("hadithId");

-- CreateIndex
CREATE INDEX "hadith_chains_narratorId_idx" ON "hadith_chains"("narratorId");

-- CreateIndex
CREATE UNIQUE INDEX "hadith_chains_hadithId_position_key" ON "hadith_chains"("hadithId", "position");

-- AddForeignKey
ALTER TABLE "ayahs" ADD CONSTRAINT "ayahs_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "surahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_translatorId_fkey" FOREIGN KEY ("translatorId") REFERENCES "translators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tafsir_verses" ADD CONSTRAINT "tafsir_verses_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tafsir_verses" ADD CONSTRAINT "tafsir_verses_tafsirBookId_fkey" FOREIGN KEY ("tafsirBookId") REFERENCES "tafsir_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_chapters" ADD CONSTRAINT "hadith_chapters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "hadith_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadiths" ADD CONSTRAINT "hadiths_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "hadith_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadiths" ADD CONSTRAINT "hadiths_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "hadith_chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_ayah_references" ADD CONSTRAINT "hadith_ayah_references_hadithId_fkey" FOREIGN KEY ("hadithId") REFERENCES "hadiths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_ayah_references" ADD CONSTRAINT "hadith_ayah_references_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duas" ADD CONSTRAINT "duas_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "dua_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dua_bookmarks" ADD CONSTRAINT "dua_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dua_bookmarks" ADD CONSTRAINT "dua_bookmarks_duaId_fkey" FOREIGN KEY ("duaId") REFERENCES "duas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_chunks" ADD CONSTRAINT "book_chunks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_bookmarks" ADD CONSTRAINT "book_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_bookmarks" ADD CONSTRAINT "book_bookmarks_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_bookmarks" ADD CONSTRAINT "hadith_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_bookmarks" ADD CONSTRAINT "hadith_bookmarks_hadithId_fkey" FOREIGN KEY ("hadithId") REFERENCES "hadiths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_lessons" ADD CONSTRAINT "ayah_lessons_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_duas" ADD CONSTRAINT "ayah_duas_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_duas" ADD CONSTRAINT "ayah_duas_duaId_fkey" FOREIGN KEY ("duaId") REFERENCES "duas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_themes" ADD CONSTRAINT "ayah_themes_parentThemeId_fkey" FOREIGN KEY ("parentThemeId") REFERENCES "ayah_themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_theme_mappings" ADD CONSTRAINT "ayah_theme_mappings_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_theme_mappings" ADD CONSTRAINT "ayah_theme_mappings_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "ayah_themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_words" ADD CONSTRAINT "ayah_words_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayah_words" ADD CONSTRAINT "ayah_words_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "word_roots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_translations" ADD CONSTRAINT "word_translations_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "ayah_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_grammar" ADD CONSTRAINT "word_grammar_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "ayah_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tajweed_applications" ADD CONSTRAINT "tajweed_applications_ayahId_fkey" FOREIGN KEY ("ayahId") REFERENCES "ayahs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tajweed_applications" ADD CONSTRAINT "tajweed_applications_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "tajweed_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memorization_goals" ADD CONSTRAINT "memorization_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memorization_sessions" ADD CONSTRAINT "memorization_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memorization_sessions" ADD CONSTRAINT "memorization_sessions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "memorization_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memorization_reviews" ADD CONSTRAINT "memorization_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memorization_reviews" ADD CONSTRAINT "memorization_reviews_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "memorization_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_lists" ADD CONSTRAINT "vocabulary_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_items" ADD CONSTRAINT "vocabulary_items_listId_fkey" FOREIGN KEY ("listId") REFERENCES "vocabulary_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_items" ADD CONSTRAINT "vocabulary_items_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "word_roots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_morphology" ADD CONSTRAINT "word_morphology_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "ayah_words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verb_conjugations" ADD CONSTRAINT "verb_conjugations_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "word_roots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_chains" ADD CONSTRAINT "hadith_chains_hadithId_fkey" FOREIGN KEY ("hadithId") REFERENCES "hadiths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_chains" ADD CONSTRAINT "hadith_chains_narratorId_fkey" FOREIGN KEY ("narratorId") REFERENCES "hadith_narrators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
