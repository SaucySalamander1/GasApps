import { prisma } from '@/lib/prisma';
import { FaqPageClient } from './FaqPageClient';

// FAQs are managed live from the admin panel, so this page always reads the
// current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function FaqPage() {
  const dbItems = await prisma.faqItem.findMany({ orderBy: { createdAt: 'asc' } });

  const items = dbItems.map((i) => ({
    question: i.question,
    answer: i.answer,
    category: i.category,
  }));

  return <FaqPageClient items={items} />;
}