'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // The server can fail before it ever reaches our JSON.stringify'd
      // error response (e.g. a thrown error during module init, or a
      // platform-level 500 in production). Don't let .json() throwing
      // in that case get swallowed into a generic, undebuggable message.
      let data: { error?: string; success?: boolean } = {};
      const rawBody = await response.text();
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        console.error('Login response was not JSON:', response.status, rawBody);
        setError(`Server error (${response.status}). Check the server logs / Network tab.`);
        return;
      }

      if (!response.ok) {
        setError(data.error ?? `Login failed (${response.status})`);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="border-border bg-surface w-full max-w-sm rounded-lg border p-8 shadow-sm">
        <h1 className="font-display text-text-primary text-xl font-semibold">GasApps Admin</h1>
        <p className="text-text-secondary mt-1 text-sm">Sign in to manage your site.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-text-primary mb-1.5 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-text-primary mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}