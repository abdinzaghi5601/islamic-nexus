# Islamic Nexus - Quran & Hadith Platform 🕌

A modern, full-stack Islamic knowledge platform built with Next.js 15, featuring the complete Quran, authentic Hadith collections, Tafsir (commentary), and an intelligent semantic search engine.

## 🌟 Features

### 📖 Quran
- **Complete Quran** - All 114 Surahs with Arabic text
- **Multiple Translations** - 4+ English translations
- **Tafsir (Commentary)** - Detailed explanations and context
- **Beautiful UI** - Clean, responsive design with Arabic typography
- **Ayah-by-Ayah Navigation** - Easy browsing and reading

### 📚 Hadith Collections
- **Six Major Books** - Sahih Bukhari, Sahih Muslim, and more
- **Authentic Hadiths** - Verified narrations with chain of transmission
- **Chapter Organization** - Browse by books and chapters
- **Grading System** - Sahih, Hasan, Da'if classifications
- **Arabic & English** - Original Arabic text with translations

### 🔍 Intelligent Search Engine
- **Semantic Search** - Understands context and related terms
  - Search "dua for health" → finds "healing", "medicine", "cure"
- **Live Autocomplete** - Real-time suggestions as you type
- **Smart Suggestions** - Never see blank results again
- **200+ Keyword Mappings** - Across 20+ Islamic topics
- **Case-Insensitive** - Works with any capitalization
- **Related Results** - Shows hadiths related to Quranic verses

#### Search Categories
- **Duas** - Supplications and prayers
- **Worship** - Salah, fasting, Hajj, Zakat
- **Morals** - Character, honesty, patience
- **Life** - Marriage, children, death, knowledge
- **Faith** - Allah, prophets, angels, judgment

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **Zustand** - State management

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM** - Type-safe database access
- **MySQL** - Relational database (Railway)
- **Server Components** - Direct database queries for optimal performance

### Deployment
- **Vercel** - Automated deployments from GitHub
- **Railway** - MySQL database hosting

## 📦 Installation

### Prerequisites
- Node.js 20+ and npm
- MySQL database (or use Railway)
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abdinzaghi5601/islamic-nexus.git
cd islamic-nexus
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="mysql://user:password@host:port/database"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Import Quran data
npm run import:quran

# Import Hadith data
npm run import:hadith

# Import Tafsir data
npm run import:tafsir
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
quran-hadith-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── search/        # Search endpoints
│   │   │   │   ├── route.ts          # Main search
│   │   │   │   └── suggestions/      # Autocomplete
│   │   │   ├── quran/         # Quran API
│   │   │   └── hadith/        # Hadith API
│   │   ├── quran/             # Quran pages
│   │   ├── hadith/            # Hadith pages
│   │   ├── search/            # Search page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   │   ├── db/               # Database (Prisma)
│   │   └── api/              # API helpers
│   └── types/                # TypeScript types
├── prisma/
│   └── schema.prisma         # Database schema
├── scripts/                  # Data import scripts
└── public/                   # Static assets
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio

# Data Import
npm run import:quran     # Import Quran data
npm run import:hadith    # Import Hadith collections
npm run import:tafsir    # Import Tafsir/commentary
```

## 🎯 Key Improvements (Recent)

### Build Optimization
- ✅ Fixed Vercel deployment issues
- ✅ Removed API fetch calls during build (ECONNREFUSED fix)
- ✅ Direct Prisma queries in Server Components
- ✅ Optimized for static generation

### Smart Search Engine
- ✅ Semantic keyword expansion (200+ mappings)
- ✅ Live autocomplete suggestions
- ✅ Smart fallback suggestions on no results
- ✅ Case-insensitive fuzzy matching
- ✅ Related content discovery

### Architecture
- ✅ Server Components for data fetching
- ✅ API routes for client-side operations only
- ✅ Type-safe database access with Prisma
- ✅ Responsive design with Tailwind CSS

## 📊 Database Schema

### Core Models
- **Surah** - Quran chapters
- **Ayah** - Quran verses
- **Translation** - Verse translations
- **Tafsir** - Commentary/explanations
- **HadithBook** - Hadith collections
- **HadithChapter** - Book chapters
- **Hadith** - Individual hadiths
- **Translator** - Translation authors
- **TafsirBook** - Commentary books

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | No |
| `NEXTAUTH_SECRET` | Auth secret key | No |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 📖 API Documentation

### Search
- `GET /api/search?q={query}&type={all|quran|hadith}` - Search content
- `GET /api/search/suggestions?q={query}` - Get suggestions

### Quran
- `GET /api/quran/surahs` - List all surahs
- `GET /api/quran/surahs/[id]?translations=1,2` - Get surah with translations
- `GET /api/quran/translators` - List translators
- `GET /api/quran/tafsir?surahNumber={n}&ayahNumber={n}` - Get tafsir

### Hadith
- `GET /api/hadith/books` - List hadith collections
- `GET /api/hadith/books/[id]?includeHadiths=true` - Get book with hadiths
- `GET /api/hadith/books/[id]/chapters/[chapterId]` - Get chapter hadiths

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Quran data from various public APIs
- Hadith collections from authentic Islamic sources
- Next.js team for the amazing framework
- Vercel for hosting platform

## 📧 Contact

**Project Repository:** [https://github.com/abdinzaghi5601/islamic-nexus](https://github.com/abdinzaghi5601/islamic-nexus)

---

Built with ❤️ for the Muslim community
