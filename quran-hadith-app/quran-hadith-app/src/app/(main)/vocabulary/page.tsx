import { Metadata } from 'next';
import VocabularyLists from '@/components/vocabulary/VocabularyLists';

export const metadata: Metadata = {
  title: 'Arabic Vocabulary Builder | Islamic Nexus',
  description: 'Build and review your Arabic vocabulary with custom word lists',
};

export default async function VocabularyPage() {
  // Auth check is handled client-side by the components

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Arabic Vocabulary Builder
        </h1>
        <p className="text-muted-foreground">
          Create custom word lists and track your Arabic learning progress
        </p>
      </div>

      <VocabularyLists />
    </div>
  );
}
