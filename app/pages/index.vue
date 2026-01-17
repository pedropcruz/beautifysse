<script setup lang="ts">
import { detectParser, AvailableParsers } from '../../utils/parsers'
import {
  exportToJSON,
  exportToCSV,
  exportToRawText,
  downloadFile,
  generateFilename
} from '../../utils/exporters'
import { getExampleById } from '../../data/examples'
import type { ParsedEvent } from '../../types/sse'
import type { StreamParser } from '../../types/parser'
import type { ExportFormat } from '../../types/export'

const rawInput = ref('')
const selectedParserName = ref<string>('auto')
const searchQuery = ref('')
const currentMatchIndex = ref(0)

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isSharing = ref(false)

const showExportModal = ref(false)
const exportContent = ref('')
const exportFormat = ref<ExportFormat>('json')

// TODO: Re-enable when @nuxtjs/seo schema-org bug is fixed
// useSchemaOrg([
//   defineWebPage({
//     name: 'Beautify Event Stream',
//     description:
//       'The ultimate tool to visualize, debug, and format Server-Sent Events (SSE) and Vercel AI SDK streams.'
//   })
// ])

const activeParser = computed<StreamParser | null>(() => {
  if (selectedParserName.value === 'auto') {
    return detectParser(rawInput.value)
  }
  return AvailableParsers.find(p => p.name === selectedParserName.value) || null
})

const allEvents = computed<ParsedEvent[]>(() => {
  if (!activeParser.value || !rawInput.value) return []
  return activeParser.value.parse(rawInput.value)
})

const matchingEvents = computed(() => {
  if (!searchQuery.value) return []
  const lowerQuery = searchQuery.value.toLowerCase()
  return allEvents.value
    .map((e, index) => {
      const isMatch
        = e.data.toLowerCase().includes(lowerQuery)
          || e.event.toLowerCase().includes(lowerQuery)
          || e.id?.toLowerCase().includes(lowerQuery)
      return isMatch ? index : -1
    })
    .filter(i => i !== -1)
})

onMounted(async () => {
  const exampleId = route.query.example as string
  if (exampleId) {
    const example = getExampleById(exampleId)
    if (example) {
      rawInput.value = example.stream
    }
    return
  }

  const shareId = route.query.s as string
  if (shareId) {
    try {
      const data = await $fetch<{ content: string }>(`/api/stream/${shareId}`)
      if (data && data.content) {
        rawInput.value = data.content
      }
    } catch {
      toast.add({
        title: 'Error',
        description: 'Failed to load shared stream. It may have expired.',
        color: 'error',
        duration: 5000
      })
    }
  }
})

const handleSearchEnter = () => {
  if (matchingEvents.value.length === 0) return

  if (currentMatchIndex.value >= matchingEvents.value.length - 1) {
    currentMatchIndex.value = 0
  } else {
    currentMatchIndex.value++
  }

  const targetIndex = matchingEvents.value[currentMatchIndex.value]
  if (targetIndex !== undefined) {
    scrollToEvent(targetIndex)
  }
}

const shareStream = async () => {
  if (!rawInput.value) return
  isSharing.value = true
  try {
    const res = await $fetch<{ id: string }>('/api/share', {
      method: 'POST',
      body: { content: rawInput.value }
    })

    // Update URL without reload
    router.push({ query: { ...route.query, s: res.id } })

    // Copy to clipboard
    const shareUrl = `${window.location.origin}/?s=${res.id}`
    await navigator.clipboard.writeText(shareUrl)

    toast.add({
      title: 'Link Copied!',
      description: 'Share URL has been copied to your clipboard.',
      color: 'success',
      duration: 3000
    })
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to create share link.',
      color: 'error',
      duration: 5000
    })
  } finally {
    isSharing.value = false
  }
}

watch(searchQuery, () => {
  currentMatchIndex.value = 0
  if (matchingEvents.value.length > 0) {
    const targetIndex = matchingEvents.value[0]
    if (targetIndex !== undefined) {
      scrollToEvent(targetIndex)
    }
  }
})

const scrollToEvent = (index: number) => {
  const el = document.getElementById(`event-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.add({
    title: 'Copied!',
    description: 'Event data copied to clipboard.',
    color: 'success',
    duration: 2000
  })
}

const isJson = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

const highlightText = (text: string) => {
  if (!searchQuery.value) return text
  const safeQuery = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeQuery})`, 'gi')
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-gray-100 rounded-sm px-0.5">$1</mark>'
  )
}

const parserOptions = computed(() => [
  { label: 'Auto Detect', value: 'auto' },
  ...AvailableParsers.map(p => ({ label: p.name, value: p.name }))
])

const exportOptions = [
  { label: 'JSON', value: 'json', icon: 'i-lucide-braces' },
  { label: 'CSV', value: 'csv', icon: 'i-lucide-table' },
  { label: 'Raw Text', value: 'txt', icon: 'i-lucide-file-text' }
]

function handleExport(format: ExportFormat) {
  const parserName = activeParser.value?.name ?? null

  if (format === 'csv') {
    const content = exportToCSV(allEvents.value)
    const filename = generateFilename('csv')
    downloadFile(content, filename, 'text/csv')
    toast.add({
      title: 'Downloaded!',
      description: `Saved as ${filename}`,
      color: 'success',
      duration: 3000
    })
    return
  }

  switch (format) {
    case 'json':
      exportContent.value = exportToJSON(allEvents.value, parserName)
      break
    case 'txt':
      exportContent.value = exportToRawText(rawInput.value)
      break
  }

  exportFormat.value = format
  showExportModal.value = true
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
    <header
      class="p-3 md:p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-wrap items-center justify-between gap-2 md:gap-4"
    >
      <div class="flex items-center gap-2 md:gap-4">
        <h1 class="font-bold text-lg md:text-xl flex items-center gap-2">
          <UIcon
            name="i-lucide-activity"
            class="text-primary-500"
          />
          <span class="hidden sm:inline">Beautify Event Stream</span>
          <span class="sm:hidden">Beautify SSE</span>
        </h1>

        <USelect
          v-model="selectedParserName"
          :items="parserOptions"
          option-attribute="label"
          value-attribute="value"
          class="w-28 md:w-40"
          size="xs"
        />

        <UBadge
          v-if="activeParser && selectedParserName === 'auto' && rawInput"
          color="gray"
          variant="subtle"
          size="xs"
          class="hidden md:flex"
        >
          Detected: {{ activeParser.name }}
        </UBadge>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <div class="flex items-center gap-2">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Find"
            size="xs"
            class="w-24 md:w-48"
            @keydown.enter="handleSearchEnter"
          />
          <div
            v-if="searchQuery && matchingEvents.length > 0"
            class="text-xs font-mono text-gray-500 whitespace-nowrap"
          >
            {{ currentMatchIndex + 1 }}/{{ matchingEvents.length }}
          </div>
          <div
            v-else-if="searchQuery"
            class="text-xs text-red-500 whitespace-nowrap hidden md:block"
          >
            0 results
          </div>
        </div>
        <div class="text-xs md:text-sm text-gray-500 whitespace-nowrap">
          {{ allEvents.length }} Events
        </div>
        <div class="hidden md:flex items-center gap-2">
          <UButton
            v-if="rawInput"
            :loading="isSharing"
            icon="i-lucide-share-2"
            label="Share"
            size="xs"
            color="white"
            variant="solid"
            @click="shareStream"
          />
          <UDropdownMenu
            v-if="allEvents.length > 0"
            :items="exportOptions"
            :popper="{ placement: 'bottom-end' }"
          >
            <UButton
              icon="i-lucide-download"
              label="Export"
              size="xs"
              color="white"
              variant="solid"
              trailing-icon="i-lucide-chevron-down"
            />
            <template #item="{ item }">
              <button
                class="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                @click="handleExport(item.value as ExportFormat)"
              >
                <UIcon
                  :name="item.icon"
                  class="w-4 h-4"
                />
                {{ item.label }}
              </button>
            </template>
          </UDropdownMenu>
          <UButton
            to="/help"
            icon="i-lucide-help-circle"
            size="xs"
            color="neutral"
            variant="ghost"
            aria-label="Help and examples"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col md:flex-row overflow-hidden pb-14 md:pb-0">
      <div
        class="w-full md:w-1/3 p-4 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-45 md:min-h-0"
      >
        <div class="flex items-center justify-between mb-2">
          <label class="font-medium text-sm text-gray-700 dark:text-gray-200">Raw Stream Input</label>
          <NuxtLink
            v-if="!rawInput"
            to="/help"
            class="text-xs text-gray-400 hover:text-primary-500 transition-colors"
          >
            New to SSE? See examples →
          </NuxtLink>
          <UButton
            v-else
            icon="i-lucide-x"
            label="Clear"
            size="xs"
            color="primary"
            variant="ghost"
            @click="rawInput = ''"
          />
        </div>
        <UTextarea
          v-model="rawInput"
          placeholder="Paste your raw SSE stream here...
data: hello
data: world

OR Vercel AI Protocol:
0: &quot;Hello&quot;"
          class="flex-1 font-mono text-sm md:text-xs"
          :ui="{ wrapper: 'h-full min-h-[120px]', base: 'h-full resize-none' }"
        />
      </div>

      <div class="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950 scroll-smooth">
        <div
          v-if="allEvents.length === 0"
          class="md:h-full flex flex-col items-center justify-center text-center p-4 md:p-8 text-gray-400"
        >
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
              <div
                class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div
                  class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200"
                >
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

              <div
                class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div
                  class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200"
                >
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

              <div
                class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div
                  class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200"
                >
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

              <div
                class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div
                  class="flex items-center gap-2 font-semibold mb-1 text-gray-700 dark:text-gray-200"
                >
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

        <div
          v-else
          class="space-y-4 max-w-4xl mx-auto"
        >
          <div
            v-for="(event, index) in allEvents"
            :id="`event-${index}`"
            :key="index"
            class="bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden transition-all duration-300"
            :class="[
              searchQuery && matchingEvents[currentMatchIndex] === index
                ? 'ring-2 ring-primary-500 border-primary-500 dark:border-primary-500'
                : 'border-gray-200 dark:border-gray-800'
            ]"
          >
            <div
              class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs"
            >
              <div class="flex items-center gap-3">
                <span class="font-bold text-primary-600 dark:text-primary-400">#{{ index + 1 }}</span>
                <UBadge
                  v-if="event.event !== 'message'"
                  color="orange"
                  variant="subtle"
                  size="xs"
                >
                  <span v-html="highlightText(event.event)" />
                </UBadge>
                <UBadge
                  v-if="event.id"
                  color="gray"
                  variant="solid"
                  size="xs"
                >
                  ID: <span v-html="highlightText(event.id)" />
                </UBadge>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="event.data.length > 50"
                  class="text-gray-400 text-[10px]"
                >
                  {{ (event.data.length / 1024).toFixed(1) }}KB
                </span>
                <UButton
                  icon="i-lucide-copy"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="opacity-50 hover:opacity-100 transition-opacity"
                  @click="copyToClipboard(event.data)"
                />
              </div>
            </div>

            <div class="p-4 overflow-x-auto">
              <div v-if="isJson(event.data)">
                <JsonViewer
                  :data="JSON.parse(event.data)"
                  :search-query="searchQuery"
                />
              </div>
              <pre
                v-else
                class="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                v-html="highlightText(event.data)"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Bottom Bar -->
    <div
      class="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 flex items-center justify-around z-50"
    >
      <UButton
        v-if="rawInput"
        :loading="isSharing"
        icon="i-lucide-share-2"
        label="Share"
        size="xs"
        color="white"
        variant="solid"
        @click="shareStream"
      />
      <UDropdownMenu
        v-if="allEvents.length > 0"
        :items="exportOptions"
        :popper="{ placement: 'top' }"
      >
        <UButton
          icon="i-lucide-download"
          label="Export"
          size="xs"
          color="white"
          variant="solid"
        />
        <template #item="{ item }">
          <button
            class="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            @click="handleExport(item.value as ExportFormat)"
          >
            <UIcon
              :name="item.icon"
              class="w-4 h-4"
            />
            {{ item.label }}
          </button>
        </template>
      </UDropdownMenu>
      <UButton
        to="/help"
        icon="i-lucide-help-circle"
        label="Help"
        size="xs"
        color="neutral"
        variant="ghost"
      />
      <ThemeToggle />
    </div>

    <footer
      class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 text-center text-xs text-gray-500 hidden md:block"
    >
      done by
      <a
        href="https://pedropcruz.pt"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary-500 transition-colors"
      >pedropcruz.pt</a>
    </footer>

    <ExportPreviewModal
      v-model="showExportModal"
      :content="exportContent"
      :format="exportFormat"
      :event-count="allEvents.length"
    />
  </div>
</template>
