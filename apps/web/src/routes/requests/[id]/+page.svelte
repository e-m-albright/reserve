<script lang="ts">
import { goto } from '$app/navigation';
import { getCurrentUser, type User } from '$lib/auth';
import {
  deleteBookingRequest,
  formatStatus,
  getBookingRequest,
  getStatusColor,
  type BookingRequest,
} from '$lib/booking';
import { onMount } from 'svelte';

interface Props {
  data: { id: string };
}

let { data }: Props = $props();

let user = $state<User | null>(null);
let request = $state<BookingRequest | null>(null);
let isLoading = $state(true);
let error = $state<string | null>(null);

const id = data.id;

onMount(async () => {
  user = await getCurrentUser();
  if (!user) {
    goto('/login');
    return;
  }

  try {
    request = await getBookingRequest(id);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load request';
  } finally {
    isLoading = false;
  }
});

async function handleDelete() {
  if (!confirm('Are you sure you want to delete this request?')) return;

  try {
    await deleteBookingRequest(id);
    goto('/requests');
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to delete request');
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimePreference(pref: string): string {
  const labels: Record<string, string> = {
    morning: 'Morning (before noon)',
    afternoon: 'Afternoon (noon to 5pm)',
    evening: 'Evening (after 5pm)',
    any: 'Any time',
  };
  return labels[pref] || pref;
}
</script>

<svelte:head>
  <title>Booking Request - Reserve</title>
</svelte:head>

{#if isLoading}
  <div class="flex min-h-screen items-center justify-center">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
{:else if error}
  <main class="min-h-screen p-8">
    <div class="mx-auto max-w-2xl">
      <div class="rounded-lg bg-red-50 p-6 text-red-700 dark:bg-red-900/20 dark:text-red-400">
        <h2 class="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
      <div class="mt-4">
        <a
          href="/requests"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Requests
        </a>
      </div>
    </div>
  </main>
{:else if request}
  <main class="min-h-screen p-8">
    <div class="mx-auto max-w-2xl">
      <div class="mb-6">
        <a
          href="/requests"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Requests
        </a>
      </div>

      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Booking Request</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">ID: {request.id}</p>
        </div>
        <span class="inline-flex rounded-full px-3 py-1 text-sm font-semibold {getStatusColor(request.status)}">
          {formatStatus(request.status)}
        </span>
      </div>

      <!-- Details Card -->
      <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">Booking Details</h2>
        </div>
        <div class="p-6">
          <dl class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Site</dt>
              <dd class="mt-1 text-lg font-medium capitalize">{request.criteria.site}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Target Date</dt>
              <dd class="mt-1 text-lg font-medium">{request.criteria.targetDate}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Time Preference</dt>
              <dd class="mt-1">{formatTimePreference(request.criteria.timePreference)}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Party Size</dt>
              <dd class="mt-1">{request.criteria.partySize} people</dd>
            </div>
            {#if request.criteria.notes}
              <div class="col-span-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                <dd class="mt-1">{request.criteria.notes}</dd>
              </div>
            {/if}
          </dl>
        </div>
      </div>

      <!-- Timestamps -->
      <div class="mt-6 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">Timeline</h2>
        </div>
        <div class="p-6">
          <dl class="space-y-3">
            <div class="flex justify-between">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Created</dt>
              <dd class="text-sm">{formatDate(request.createdAt)}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-sm text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd class="text-sm">{formatDate(request.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Result (if completed) -->
      {#if request.status === 'completed' && request.result}
        <div class="mt-6 rounded-lg border border-green-200 dark:border-green-800 overflow-hidden">
          <div class="bg-green-50 dark:bg-green-900/20 px-6 py-4 border-b border-green-200 dark:border-green-800">
            <h2 class="text-lg font-semibold text-green-700 dark:text-green-400">Booking Confirmed</h2>
          </div>
          <div class="p-6 bg-green-50/50 dark:bg-green-900/10">
            <pre class="text-sm overflow-auto">{JSON.stringify(request.result, null, 2)}</pre>
          </div>
        </div>
      {/if}

      <!-- Error (if failed) -->
      {#if request.status === 'failed' && request.error}
        <div class="mt-6 rounded-lg border border-red-200 dark:border-red-800 overflow-hidden">
          <div class="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
            <h2 class="text-lg font-semibold text-red-700 dark:text-red-400">Error</h2>
          </div>
          <div class="p-6 bg-red-50/50 dark:bg-red-900/10">
            <p class="text-red-700 dark:text-red-400">{request.error}</p>
          </div>
        </div>
      {/if}

      <!-- Actions -->
      {#if request.status === 'pending'}
        <div class="mt-8 flex justify-end">
          <button
            onclick={handleDelete}
            class="rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete Request
          </button>
        </div>
      {/if}
    </div>
  </main>
{/if}
