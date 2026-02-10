<script lang="ts">
import { goto } from '$app/navigation';
import { type User, getCurrentUser, logout } from '$lib/auth';
import { onMount } from 'svelte';

let user = $state<User | null>(null);
let isLoading = $state(true);

onMount(async () => {
  user = await getCurrentUser();
  isLoading = false;
});

async function handleLogout() {
  await logout();
  user = null;
  goto('/login');
}
</script>

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div
			class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
		></div>
	</div>
{:else}
	<main class="flex min-h-screen flex-col items-center justify-center p-24">
		<div class="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
			<div class="mb-8 flex w-full items-center justify-between">
				<div>
					<h1 class="text-4xl font-bold mb-4">Reserve</h1>
					<p class="text-lg mb-2">Ethical booking assistant to help secure your slots</p>
					{#if user}
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Welcome, {user.email}
							{#if user.isAdmin}
								(Admin)
							{/if}
						</p>
					{/if}
				</div>
				{#if user}
					<button
						onclick={handleLogout}
						class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
					>
						Logout
					</button>
				{/if}
			</div>

			<div class="border-t border-gray-300 dark:border-gray-700 pt-8">
				{#if user}
					<div>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
							You're logged in! Get started:
						</p>
						<div class="flex gap-4">
							<a
								href="/requests"
								class="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
							>
								View Booking Requests
							</a>
							<a
								href="/requests/new"
								class="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
							>
								Create New Request
							</a>
						</div>
					</div>
				{:else}
					<div class="space-y-4">
						<p class="text-sm text-gray-600 dark:text-gray-400">Please sign in to continue</p>
						<div class="flex gap-4">
							<a
								href="/login"
								class="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
							>
								Sign In
							</a>
							<a
								href="/signup"
								class="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
							>
								Sign Up
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</main>
{/if}
