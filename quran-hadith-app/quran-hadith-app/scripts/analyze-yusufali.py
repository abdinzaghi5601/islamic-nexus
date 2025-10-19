#!/usr/bin/env python3
"""
Exploratory Data Analysis Script for Yusuf Ali Translation
This script analyzes the Quran translation and generates insights for the analytics dashboard
"""

import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

def load_csv(filepath):
    """Load the CSV file"""
    data = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)
    return data

def analyze_prophets(data):
    """Analyze mentions of prophets in the Quran"""
    prophets = {
        'Adam': ['adam'],
        'Noah': ['noah', 'nuh'],
        'Abraham': ['abraham', 'ibrahim'],
        'Ishmael': ['ishmael', 'ismail'],
        'Isaac': ['isaac', 'ishaq'],
        'Jacob': ['jacob', 'yakub'],
        'Joseph': ['joseph', 'yusuf', 'yousuf'],
        'Moses': ['moses', 'musa'],
        'Aaron': ['aaron', 'harun'],
        'David': ['david', 'dawud', 'dawood'],
        'Solomon': ['solomon', 'sulaiman', 'sulayman'],
        'Job': ['job', 'ayub', 'ayyub'],
        'Jonah': ['jonah', 'yunus'],
        'Jesus': ['jesus', 'isa', 'christ'],
        'John': ['john', 'yahya'],
        'Zachariah': ['zachariah', 'zakariya'],
        'Elijah': ['elijah', 'elias', 'ilyas'],
        'Elisha': ['elisha', 'alyasa'],
        'Muhammad': ['muhammad', 'ahmad']
    }

    prophet_stats = {}
    for prophet, variations in prophets.items():
        count = 0
        ayahs = []
        surahs = set()

        for row in data:
            text_lower = row['Text'].lower()
            if any(var in text_lower for var in variations):
                count += sum(text_lower.count(var) for var in variations)
                ayahs.append((int(row['Surah']), int(row['Ayah'])))
                surahs.add(int(row['Surah']))

        if count > 0:
            prophet_stats[prophet] = {
                'mentions': count,
                'ayah_count': len(ayahs),
                'surah_count': len(surahs),
                'ayahs': ayahs[:10]  # Sample of ayahs
            }

    return prophet_stats

def analyze_key_concepts(data):
    """Analyze key Islamic concepts and their frequency"""
    concepts = {
        'Names of Allah': {
            'keywords': ['merciful', 'compassionate', 'forgiver', 'oft-returning',
                        'all-knowing', 'all-seeing', 'all-hearing', 'almighty'],
            'category': 'Divine Attributes'
        },
        'Belief': {
            'keywords': ['believe', 'believers', 'faith', 'faithful', 'trust'],
            'category': 'Faith & Belief'
        },
        'Worship': {
            'keywords': ['prayer', 'pray', 'worship', 'bow', 'prostrate', 'prostration'],
            'category': 'Worship'
        },
        'Charity': {
            'keywords': ['charity', 'alms', 'spend', 'give', 'poor', 'needy'],
            'category': 'Social Justice'
        },
        'Patience': {
            'keywords': ['patient', 'patience', 'persever', 'steadfast'],
            'category': 'Virtues'
        },
        'Gratitude': {
            'keywords': ['grateful', 'gratitude', 'thank', 'praise'],
            'category': 'Virtues'
        },
        'Repentance': {
            'keywords': ['repent', 'repentance', 'turn', 'forgive', 'forgiveness'],
            'category': 'Forgiveness'
        },
        'Paradise': {
            'keywords': ['garden', 'paradise', 'heaven', 'bliss', 'eternal'],
            'category': 'Hereafter'
        },
        'Hellfire': {
            'keywords': ['fire', 'hell', 'torment', 'punishment', 'penalty'],
            'category': 'Hereafter'
        },
        'Guidance': {
            'keywords': ['guide', 'guidance', 'path', 'way', 'straight'],
            'category': 'Guidance'
        }
    }

    concept_stats = {}
    for concept, info in concepts.items():
        count = 0
        ayah_refs = []

        for row in data:
            text_lower = row['Text'].lower()
            found = False
            for keyword in info['keywords']:
                if keyword in text_lower:
                    count += text_lower.count(keyword)
                    found = True

            if found:
                ayah_refs.append((int(row['Surah']), int(row['Ayah'])))

        concept_stats[concept] = {
            'count': count,
            'category': info['category'],
            'ayahs_containing': len(ayah_refs)
        }

    return concept_stats

def analyze_surah_themes(data):
    """Analyze themes by surah"""
    surah_data = defaultdict(lambda: {
        'ayah_count': 0,
        'total_words': 0,
        'avg_ayah_length': 0,
        'mentions_allah': 0,
        'mentions_believers': 0,
        'mentions_disbelievers': 0
    })

    for row in data:
        surah = int(row['Surah'])
        text = row['Text']
        text_lower = text.lower()

        surah_data[surah]['ayah_count'] += 1
        surah_data[surah]['total_words'] += len(text.split())
        surah_data[surah]['mentions_allah'] += text_lower.count('allah')
        surah_data[surah]['mentions_believers'] += text_lower.count('believe')
        surah_data[surah]['mentions_disbelievers'] += text_lower.count('reject')

    # Calculate averages
    for surah in surah_data:
        count = surah_data[surah]['ayah_count']
        surah_data[surah]['avg_ayah_length'] = surah_data[surah]['total_words'] / count if count > 0 else 0

    return dict(surah_data)

def generate_analytics_insights(data):
    """Generate comprehensive insights for analytics dashboard"""

    print("Generating analytics insights...")

    # Prophet analysis
    print("\n1. Analyzing Prophets...")
    prophet_stats = analyze_prophets(data)

    # Concept analysis
    print("2. Analyzing Key Concepts...")
    concept_stats = analyze_key_concepts(data)

    # Surah themes
    print("3. Analyzing Surah Themes...")
    surah_themes = analyze_surah_themes(data)

    # Create insights object
    insights = {
        'prophets': prophet_stats,
        'concepts': concept_stats,
        'surah_analysis': surah_themes,
        'summary': {
            'total_ayahs': len(data),
            'total_surahs': len(set(row['Surah'] for row in data)),
            'most_mentioned_prophet': max(prophet_stats.items(), key=lambda x: x[1]['mentions'])[0] if prophet_stats else None,
            'most_common_concept': max(concept_stats.items(), key=lambda x: x[1]['count'])[0] if concept_stats else None
        }
    }

    return insights

def main():
    # Load data
    csv_path = Path(__file__).parent.parent / 'en.yusufali.csv'
    print(f"Loading CSV from: {csv_path}")
    data = load_csv(csv_path)

    # Generate insights
    insights = generate_analytics_insights(data)

    # Save to JSON
    output_path = Path(__file__).parent / 'yusufali-insights.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(insights, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Insights saved to: {output_path}")

    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total Ayahs: {insights['summary']['total_ayahs']}")
    print(f"Total Surahs: {insights['summary']['total_surahs']}")
    print(f"\nMost Mentioned Prophet: {insights['summary']['most_mentioned_prophet']}")
    if insights['summary']['most_mentioned_prophet']:
        prophet = insights['summary']['most_mentioned_prophet']
        print(f"  - Mentions: {insights['prophets'][prophet]['mentions']}")
        print(f"  - Appears in {insights['prophets'][prophet]['surah_count']} surahs")

    print(f"\nMost Common Concept: {insights['summary']['most_common_concept']}")
    if insights['summary']['most_common_concept']:
        concept = insights['summary']['most_common_concept']
        print(f"  - Count: {insights['concepts'][concept]['count']}")
        print(f"  - Category: {insights['concepts'][concept]['category']}")

    print("\n" + "="*60)
    print("✅ Analysis Complete!")
    print("="*60)

if __name__ == '__main__':
    main()
