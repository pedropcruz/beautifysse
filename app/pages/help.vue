<script setup lang="ts">
import { STREAM_EXAMPLES } from '../../data/examples'

const router = useRouter()

function tryExample(id: string) {
  router.push({ path: '/', query: { example: id } })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <UIcon
            name="i-lucide-activity"
            class="text-primary-500"
          />
          Beautify Event Stream
        </NuxtLink>
        <ThemeToggle />
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <section class="mb-12">
        <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          What are Server-Sent Events?
        </h1>

        <div class="prose dark:prose-invert max-w-none">
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
            <strong>Server-Sent Events (SSE)</strong> is a standard that allows servers to push data to web clients over HTTP.
            Unlike WebSockets, SSE is unidirectional - the server sends events to the client.
          </p>

          <div class="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div class="text-xs text-gray-400 mb-2 font-mono">
              Basic SSE Format
            </div>
            <pre class="text-sm text-green-400 font-mono whitespace-pre-wrap">event: message
data: {"hello": "world"}

data: Just data, no event type

event: custom-event
id: 123
data: With event type and ID</pre>
          </div>

          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Each event can have:
          </p>

          <ul class="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
            <li><code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">data:</code> The payload (required)</li>
            <li><code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">event:</code> Custom event type (optional, defaults to "message")</li>
            <li><code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">id:</code> Event identifier (optional)</li>
            <li><code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">retry:</code> Reconnection time in ms (optional)</li>
          </ul>

          <p class="text-gray-600 dark:text-gray-300">
            SSE is widely used for <strong>AI streaming responses</strong> (OpenAI, Anthropic, Vercel AI SDK),
            real-time feeds, notifications, and live updates.
          </p>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Supported Formats
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Click "Try this" to see how Beautify Event Stream parses each format.
        </p>

        <div class="space-y-6">
          <div
            v-for="example in STREAM_EXAMPLES"
            :key="example.id"
            class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-4">
              <div>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">
                  {{ example.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ example.description }}
                </p>
              </div>
              <UButton
                icon="i-lucide-play"
                label="Try this"
                size="sm"
                color="primary"
                @click="tryExample(example.id)"
              />
            </div>
            <div class="bg-gray-950 p-4 overflow-x-auto">
              <pre class="text-xs text-gray-300 font-mono whitespace-pre-wrap">{{ example.stream }}</pre>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-12 text-center">
        <UButton
          to="/"
          icon="i-lucide-arrow-left"
          label="Back to Tool"
          size="lg"
          variant="outline"
        />
      </section>
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center text-xs text-gray-500 mt-12">
      done by
      <a
        href="https://pedropcruz.pt"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary-500 transition-colors"
      >pedropcruz.pt</a>
    </footer>
  </div>
</template>
