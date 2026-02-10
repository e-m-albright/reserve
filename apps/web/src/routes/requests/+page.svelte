<script lang="ts">
import { goto } from '$app/navigation';
import { getCurrentUser, type User } from '$lib/auth';
import {
  deleteBookingRequest,
  formatStatus,
  getStatusColor,
  listBookingRequests,
  type BookingRequest,
} from '$lib/booking';
import { onMount } from 'svelte';

let user = $state<User | null>(null);
let requests = $state<BookingRequest[]>([]);
let isLoading = $state(true);
let error = $state<string | null>(null);

onMount(async () => {
  user = await getCurrentUser();
  if (!user) {
    goto('/login');
    return;
  }

  try {
    requests = await listBookingRequests();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load requests';
  } finally {
    isLoading = false;
  }
});

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this request?')) return;

  try {
    await deleteBookingRequest(id);
    requests = requests.filter((r) => r.id !== id);
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to delete request');
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<svelte:head>
  <title>Booking Requests - Reserve</title>
</svelte:head>

{#if isLoading}
  <div class="flex min-h-screen items-center justify-center">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
{:else}
  <main class="min-h-screen p-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Booking Requests</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage your reservation requests</p>
        </div>
        <a
          href="/requests/new"
          class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          New Request
        </a>
      </div>

      {#if error}
        <div class="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      {/if}

      {#if requests.length === 0}
        <div class="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-4 text-lg font-medium">No booking requests</h3>
          <p class="mt-2 text-gray-500 dark:text-gray-400">Get started by creating a new booking request.</p>
          <a
            href="/requests/new"
            class="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
          >
            Create Request
          </a>
        </div>
      {:else}
        <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Site</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Target Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Party Size</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {#each requests as request (request.id)}
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td class="whitespace-nowrap px-6 py-4">
                    <span class="font-medium">{request.criteria.site}</span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {request.criteria.targetDate}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {request.criteria.partySize}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getStatusColor(request.status)}">
                      {formatStatus(request.status)}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(request.createdAt)}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <a
                      href="/requests/{request.id}"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      View
                    </a>
                    {#if request.status === 'pending'}
                      <button
                        onclick={() => handleDelete(request.id)}
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <div class="mt-8">
        <a
          href="/"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Home
        </a>
      </div>
    </div>
  </main>
{/if}
