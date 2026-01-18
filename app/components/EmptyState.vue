<script setup lang="ts">
</script>

<template>
  <div class="md:h-full flex flex-col items-center justify-center text-center p-4 md:p-8 text-gray-400">
    <div class="max-w-md mx-auto space-y-6">
      <div class="flex justify-center mb-4">
        <div class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-full flex">
          <UIcon
            name="i-lucide-activity"
            class="w-12 h-12 text-primary-500"
          />
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        The Ultimate Server-Sent Events Viewer
      </h2>

      <p class="text-gray-500 dark:text-gray-400">
        Debug SSE streams and Vercel AI SDK responses instantly. Just paste your raw output
        and let us do the magic.
      </p>

      <UButton
        to="/help"
        icon="i-lucide-book-open"
        label="See Examples"
        variant="soft"
        color="primary"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200">
            <UIcon
              name="i-lucide-braces"
              class="text-blue-500"
            />
            JSON Formatting
          </div>
          <p class="text-xs text-gray-500">
            Auto-detects and beautifies JSON payloads inside data chunks.
          </p>
        </div>

        <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200">
            <UIcon
              name="i-lucide-bot"
              class="text-green-500"
            />
            AI Streams
          </div>
          <p class="text-xs text-gray-500">
            Full support for Vercel AI SDK protocol (0:text, d:finish).
          </p>
        </div>

        <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200">
            <UIcon
              name="i-lucide-search"
              class="text-purple-500"
            />
            Filter & Search
          </div>
          <p class="text-xs text-gray-500">
            Quickly find errors or specific events in massive streams.
          </p>
        </div>

        <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200">
            <UIcon
              name="i-lucide-zap"
              class="text-orange-500"
            />
            Instant & Secure
          </div>
          <p class="text-xs text-gray-500">
            Everything runs client-side. Your data never leaves your browser.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
