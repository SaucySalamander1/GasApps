import { Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/sections/PageHeader';
import { Container } from '@/components/layout/Container';
import { CareersApplyForm } from '@/components/sections/CareersApplyForm';
import { prisma } from '@/lib/prisma';

// Jobs are managed live from the admin panel, so this page always reads the
// current DB state rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function CareersPage() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <PageHeader
        title="Careers"
        description="Join a team building the fittings and instrumentation industries depend on."
      />

      <section className="py-[var(--space-section-y)]">
        <Container>
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            Open Positions
          </h2>

          {jobs.length === 0 ? (
            <div className="border-border mt-8 flex flex-col items-center gap-3 rounded-lg border py-16 text-center">
              <Briefcase size={32} className="text-text-secondary" />
              <p className="text-text-primary font-medium">No open positions right now</p>
              <p className="text-text-secondary max-w-md text-sm">
                We don&apos;t have any active openings at the moment, but we&apos;re always
                interested in hearing from talented people. Submit a general application below.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.slug}
                  className="border-border flex flex-col gap-2 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-display font-semibold">{job.title}</p>
                    <p className="text-text-secondary text-sm">
                      {job.department} · {job.location} · {job.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-surface/50 py-[var(--space-section-y)]">
        <Container className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
            General Application
          </h2>
          <p className="text-text-secondary mt-2">
            Don&apos;t see a role that fits? Send us your information and we&apos;ll reach out when
            something matches.
          </p>
          <div className="mt-8">
            <CareersApplyForm />
          </div>
        </Container>
      </section>
    </>
  );
}