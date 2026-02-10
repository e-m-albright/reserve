'use client';

import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  inviteCode: z.string().min(1, 'Invite code is required'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          inviteCode: data.inviteCode.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      // Redirect to dashboard/home
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign up with your invite code
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <Input
            {...register('email')}
            type="email"
            label="Email"
            placeholder="you@example.com"
            variant="bordered"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            disabled={isLoading}
          />

          <Input
            {...register('password')}
            type="password"
            label="Password"
            placeholder="••••••••"
            variant="bordered"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            disabled={isLoading}
            description="Must be at least 8 characters"
          />

          <Input
            {...register('inviteCode')}
            type="text"
            label="Invite Code"
            placeholder="INVITE-XXXX-XXXX"
            variant="bordered"
            isInvalid={!!errors.inviteCode}
            errorMessage={errors.inviteCode?.message}
            disabled={isLoading}
            description="Enter your invite code to create an account"
          />

          <Button type="submit" color="primary" size="lg" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
          <a href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
