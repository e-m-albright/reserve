<script lang="ts">
import { goto } from '$app/navigation';
import { login } from '$lib/auth';

let email = $state('');
let password = $state('');
let error = $state<string | null>(null);
let isLoading = $state(false);

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  isLoading = true;
  error = null;

  try {
    await login(email, password);
    goto('/');
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred';
  } finally {
    isLoading = false;
  }
}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
>
	<div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Enter your credentials to access your account
			</p>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			{#if error}
				<div
					class="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400"
				>
					{error}
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Email
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					required
					disabled={isLoading}
					class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					required
					minlength="8"
					disabled={isLoading}
					class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
			>
				{#if isLoading}
					<span class="flex items-center justify-center gap-2">
						<span
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></span>
						Signing in...
					</span>
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<div class="text-center text-sm">
			<span class="text-gray-600 dark:text-gray-400">Don't have an account? </span>
			<a href="/signup" class="font-medium text-blue-600 hover:underline dark:text-blue-400">
				Sign up
			</a>
		</div>
	</div>
</div>
