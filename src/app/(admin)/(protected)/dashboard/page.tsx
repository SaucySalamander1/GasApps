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
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, {session.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{session.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">
          This is a placeholder dashboard confirming authentication works end-to-end. The real
          admin dashboard (product management, content editing, etc.) will be built in Phase 4.
        </p>
      </div>
    </div>
  );
}