'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthGuard } from '../components/AuthGuard';
import { type User, getCurrentUser, logout } from '../lib/auth';

function HomeContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="mb-8 flex w-full items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Reserve</h1>
            <p className="text-lg mb-2">Ethical booking assistant to help secure your slots</p>
            {user && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.email}
                {user.isAdmin && ' (Admin)'}
              </p>
            )}
          </div>
          {user && (
            <Button color="danger" variant="flat" onPress={handleLogout}>
              Logout
            </Button>
          )}
        </div>
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
          {user ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                You're logged in! Next steps:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Configure booking preferences</li>
                <li>Set up booking site credentials</li>
                <li>Create booking requests</li>
                <li>Monitor request status</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Please sign in to continue</p>
              <div className="flex gap-4">
                <Button color="primary" onPress={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button variant="flat" onPress={() => router.push('/signup')}>
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthGuard requireAuth={false}>
      <HomeContent />
    </AuthGuard>
  );
}
