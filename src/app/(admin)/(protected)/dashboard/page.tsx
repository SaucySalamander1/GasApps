import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LogoutButton } from './LogoutButton';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-semibold">
            Welcome, {session.name}
          </h1>
          <p className="text-text-secondary mt-1 text-sm">{session.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="border-border bg-surface mt-8 rounded-lg border p-6">
        <p className="text-text-secondary text-sm">
          This is a placeholder dashboard confirming authentication works end-to-end. The real
          admin dashboard (product management, content editing, etc.) will be built in Phase 4.
        </p>
      </div>
    </div>
  );
}