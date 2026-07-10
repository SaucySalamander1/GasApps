'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="border-border hover:border-accent text-text-primary rounded-md border px-4 py-2 text-sm font-medium transition-colors"
    >
      Sign Out
    </button>
  );
}