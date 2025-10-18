# Quranic Arabic Corpus Importer

This directory contains scripts to download, parse, and import Quranic Arabic Corpus data into your PostgreSQL database.

## 📚 Data Source

**Quranic Arabic Corpus** - http://corpus.quran.com/
- Provides word-by-word morphological analysis of the Quran
- Includes grammatical features, roots, and linguistic annotations
- Data is available in XML format under Creative Commons license

## 🚀 Quick Start

### Option 1: Import All 114 Surahs (Recommended)

```bash
npm run corpus:import
```

This will:
1. Download the complete morphology XML file (~10MB)
2. Parse all 114 surahs with word-by-word analysis
3. Import ~77,000 words into your database
4. Takes approximately 10-15 minutes

### Option 2: Test with Sample Data (First 10 Surahs)

```bash
npm run corpus:import:sample
```

Faster test run with first 10 surahs (~5,000 words)

### Option 3: Custom Range

```bash
npm run corpus:import -- --start 1 --end 20
```

Import surahs 1-20 only

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run corpus:download` | Download XML data only |
| `npm run corpus:parse` | Parse XML and display sample output |
| `npm run corpus:import` | Full pipeline (download → parse → import) |
| `npm run corpus:import:sample` | Import first 10 surahs only |

## 🔧 Command-Line Options

```bash
npm run corpus:import -- [options]

Options:
  --start <number>      Start from surah number (default: 1)
  --end <number>        End at surah number (default: 114)
  --clear               Clear existing corpus data before import
  --skip-download       Skip download step (use existing XML file)
  --help                Show help message
```

## 📊 What Gets Imported

### Tables Populated:

1. **`ayah_words`** - Every word in the Quran
   - Position, Arabic text, transliteration
   - Links to roots and ayahs

2. **`word_roots`** - Unique Arabic root words
   - Root letters (e.g., ك ت ب for "write")
   - Occurrence count across Quran

3. **`word_grammar`** - Grammatical analysis
   - Part of speech (Verb, Noun, Particle, etc.)
   - Case (Nominative, Accusative, Genitive)
   - Gender, Number, Person, Tense, Mood
   - Verb forms (I-X)

4. **`word_morphology`** - Morphological breakdown
   - Stem, Lemma, Prefix, Suffix
   - Word patterns

## 🎯 Expected Results

After import, your Corpus Analytics tab will show:

- **~77,000** total words
- **~1,800** unique root words
- **Top roots**: الله, قال, كان, etc.
- **Part-of-speech distribution**: Verbs, Nouns, Particles
- **Verb forms**: Form I (most common), Form II, Form IV, etc.
- **Gender/Number distribution**: Masculine/Feminine, Singular/Dual/Plural

## ⚙️ Technical Details

### XML Structure

The Quranic Arabic Corpus uses this structure:

```xml
<quran>
  <sura index="1">
    <aya index="1">
      <word>
        <segment form="bi" tag="PREFIX" />
        <segment form="ismi" tag="N" root="س م و" />
        <segment form="i" tag="SUFFIX" />
      </word>
    </aya>
  </sura>
</quran>
```

### Import Process

1. **Download** - Fetches complete XML file from corpus.quran.com
2. **Parse** - Extracts words, segments, roots, and features
3. **Import** - Inserts data into PostgreSQL with proper relationships

### Performance

- **Download**: ~30 seconds (10MB file)
- **Parse**: ~1-2 minutes (77,000 words)
- **Import**: ~8-12 minutes (database inserts with relationships)
- **Total**: ~15 minutes for full Quran

## 🐛 Troubleshooting

### Error: "File not found"
```bash
# Download the XML file first
npm run corpus:download
```

### Error: "Ayah not found in database"
Make sure you've imported the Quran text first:
```bash
npm run import:quran
```

### Want to start over?
```bash
# Clear existing data and reimport
npm run corpus:import -- --clear
```

### Import taking too long?
```bash
# Test with smaller dataset first
npm run corpus:import -- --start 1 --end 1  # Just Al-Fatiha
```

## 📁 File Structure

```
scripts/corpus/
├── README.md                    # This file
├── download-corpus-data.ts      # Downloads XML from corpus.quran.com
├── parse-morphology.ts          # Parses XML to extract linguistic data
├── import-to-database.ts        # Imports parsed data to PostgreSQL
└── index.ts                     # Master script (runs all steps)
```

## 🔗 Resources

- **Quranic Arabic Corpus**: http://corpus.quran.com/
- **Documentation**: http://corpus.quran.com/documentation/
- **Morphology Tags**: http://corpus.quran.com/documentation/tagset.jsp

## 📝 License

The Quranic Arabic Corpus is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

## 🤝 Credits

Data provided by the **Quranic Arabic Corpus** project (Kais Dukes, 2009-2024)
