import { prisma } from '@/lib/prisma';

export interface ContentTypeCount {
  label: string;
  count: number;
}

export interface MonthlyGrowth {
  month: string;
  items: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalServices: number;
  publishedPosts: number;
  openRoles: number;
  contentByType: ContentTypeCount[];
  monthlyGrowth: MonthlyGrowth[];
  totalContentItems: number;
}

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Pulls real counts straight from Postgres via Prisma. No mock numbers —
 * if a table is empty, the dashboard shows zero, not a fabricated figure.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    productCount,
    serviceCount,
    industryCount,
    projectCount,
    blogCount,
    jobCount,
    faqCount,
    resourceCount,
    certificationCount,
    recentDates,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.service.count(),
    prisma.industry.count(),
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.job.count(),
    prisma.faqItem.count(),
    prisma.resource.count(),
    prisma.certification.count(),
    getRecentCreatedDates(),
  ]);

  const contentByType: ContentTypeCount[] = [
    { label: 'Products', count: productCount },
    { label: 'Services', count: serviceCount },
    { label: 'Industries', count: industryCount },
    { label: 'Projects', count: projectCount },
    { label: 'Blog Posts', count: blogCount },
    { label: 'Jobs', count: jobCount },
    { label: 'FAQs', count: faqCount },
    { label: 'Resources', count: resourceCount },
    { label: 'Certifications', count: certificationCount },
  ];

  const totalContentItems = contentByType.reduce((sum, c) => sum + c.count, 0);

  return {
    totalProducts: productCount,
    totalServices: serviceCount,
    publishedPosts: blogCount,
    openRoles: jobCount,
    contentByType,
    monthlyGrowth: buildMonthlyGrowth(recentDates),
    totalContentItems,
  };
}

/** Collects createdAt timestamps across every content model for a growth trend. */
async function getRecentCreatedDates(): Promise<Date[]> {
  const [products, services, industries, projects, posts, jobs] = await Promise.all([
    prisma.product.findMany({ select: { createdAt: true } }),
    prisma.service.findMany({ select: { createdAt: true } }),
    prisma.industry.findMany({ select: { createdAt: true } }),
    prisma.project.findMany({ select: { createdAt: true } }),
    prisma.blogPost.findMany({ select: { createdAt: true } }),
    prisma.job.findMany({ select: { createdAt: true } }),
  ]);

  return [...products, ...services, ...industries, ...projects, ...posts, ...jobs].map(
    (row) => row.createdAt
  );
}

/** Buckets creation dates into the trailing 6 months, oldest first. */
function buildMonthlyGrowth(dates: Date[]): MonthlyGrowth[] {
  const now = new Date();
  const buckets: MonthlyGrowth[] = [];

  for (let i = 5; i >= 0; i--) {
    const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = MONTH_LABELS[bucketDate.getMonth()];

    const items = dates.filter((d) => {
      return (
        d.getFullYear() === bucketDate.getFullYear() &&
        d.getMonth() === bucketDate.getMonth()
      );
    }).length;

    buckets.push({ month: label, items });
  }

  return buckets;
}