import { Metadata } from 'next';
import VocabularyListView from '@/components/vocabulary/VocabularyListView';

export const metadata: Metadata = {
  title: 'Vocabulary List | Islamic Nexus',
  description: 'Review and manage your Arabic vocabulary',
};

export default async function VocabularyListPage({
  params,
}: {
  params: { listId: string };
}) {
  // Auth check is handled client-side by the components

  return (
    <div className="container mx-auto px-4 py-8">
      <VocabularyListView listId={params.listId} />
    </div>
  );
}
