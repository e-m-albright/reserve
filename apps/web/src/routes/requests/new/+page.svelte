<script lang="ts">
import { goto } from '$app/navigation';
import { getCurrentUser, type User } from '$lib/auth';
import { createBookingRequest } from '$lib/booking';
import { onMount } from 'svelte';

let user = $state<User | null>(null);
let isLoading = $state(true);
let isSubmitting = $state(false);
let error = $state<string | null>(null);

// Form fields
let site = $state('');
let targetDate = $state('');
let timePreference = $state<'morning' | 'afternoon' | 'evening' | 'any'>('any');
let partySize = $state(2);
let notes = $state('');
let username = $state('');
let password = $state('');

onMount(async () => {
  user = await getCurrentUser();
  if (!user) {
    goto('/login');
    return;
  }
  isLoading = false;
});

async function handleSubmit(e: SubmitEvent) {
  e.preventDefault();
  error = null;
  isSubmitting = true;

  try {
    await createBookingRequest(
      {
        site,
        targetDate,
        timePreference,
        partySize,
        notes: notes || undefined,
      },
      {
        username,
        password,
      }
    );

    goto('/requests');
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to create request';
    isSubmitting = false;
  }
}

// Get tomorrow's date as minimum
const minDate = new Date();
minDate.setDate(minDate.getDate() + 1);
const minDateStr = minDate.toISOString().split('T')[0];
</script>

<svelte:head>
  <title>New Booking Request - Reserve</title>
</svelte:head>

{#if isLoading}
  <div class="flex min-h-screen items-center justify-center">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
{:else}
  <main class="min-h-screen p-8">
    <div class="mx-auto max-w-2xl">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">New Booking Request</h1>
        <p class="text-gray-600 dark:text-gray-400">Set up automated reservation monitoring</p>
      </div>

      {#if error}
        <div class="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      {/if}

      <form onsubmit={handleSubmit} class="space-y-8">
        <!-- Booking Criteria Section -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h2 class="mb-4 text-lg font-semibold">Booking Details</h2>

          <div class="space-y-4">
            <div>
              <label for="site" class="block text-sm font-medium mb-1">
                Booking Site <span class="text-red-500">*</span>
              </label>
              <select
                id="site"
                bind:value={site}
                required
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="">Select a site...</option>
                <option value="resy">Resy</option>
                <option value="opentable">OpenTable</option>
                <option value="tock">Tock</option>
                <option value="yelp">Yelp Reservations</option>
              </select>
              <p class="mt-1 text-sm text-gray-500">The reservation platform to monitor</p>
            </div>

            <div>
              <label for="targetDate" class="block text-sm font-medium mb-1">
                Target Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="targetDate"
                bind:value={targetDate}
                required
                min={minDateStr}
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <p class="mt-1 text-sm text-gray-500">When you want the reservation</p>
            </div>

            <div>
              <label for="timePreference" class="block text-sm font-medium mb-1">
                Time Preference
              </label>
              <select
                id="timePreference"
                bind:value={timePreference}
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="any">Any time</option>
                <option value="morning">Morning (before noon)</option>
                <option value="afternoon">Afternoon (noon to 5pm)</option>
                <option value="evening">Evening (after 5pm)</option>
              </select>
            </div>

            <div>
              <label for="partySize" class="block text-sm font-medium mb-1">
                Party Size
              </label>
              <input
                type="number"
                id="partySize"
                bind:value={partySize}
                required
                min="1"
                max="20"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                bind:value={notes}
                rows="3"
                maxlength="500"
                placeholder="Any special requirements or preferences..."
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">{notes.length}/500 characters</p>
            </div>
          </div>
        </div>

        <!-- Credentials Section -->
        <div class="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
          <h2 class="mb-4 text-lg font-semibold">Site Credentials</h2>
          <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Your credentials are encrypted before storage and only used for automated booking.
          </p>

          <div class="space-y-4">
            <div>
              <label for="username" class="block text-sm font-medium mb-1">
                Username/Email <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                bind:value={username}
                required
                autocomplete="off"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium mb-1">
                Password <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                bind:value={password}
                required
                autocomplete="off"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <a
            href="/requests"
            class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={isSubmitting}
            class="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if isSubmitting}
              Creating...
            {:else}
              Create Request
            {/if}
          </button>
        </div>
      </form>
    </div>
  </main>
{/if}
