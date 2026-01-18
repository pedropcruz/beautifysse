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

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isSharing = ref(false)

const showExportModal = ref(false)
const exportContent = ref('')
const exportFormat = ref<ExportFormat>('json')

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

const shareStream = async () => {
  if (!rawInput.value) return
  isSharing.value = true
  try {
    const res = await $fetch<{ id: string }>('/api/share', {
      method: 'POST',
      body: { content: rawInput.value }
    })

    router.push({ query: { ...route.query, s: res.id } })

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
    <!-- Header -->
    <header class="p-3 md:p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-wrap items-center justify-between gap-2 md:gap-4">
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

    <!-- Main Content -->
    <main class="flex-1 flex flex-col md:flex-row overflow-hidden pb-14 md:pb-0">
      <!-- Left Panel: Raw Input -->
      <div class="w-full md:w-1/3 p-4 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-45 md:min-h-0">
        <div class="flex items-center justify-between mb-2">
          <label class="font-medium text-sm text-gray-700 dark:text-gray-200">Raw Stream Input</label>
          <NuxtLink
            v-if="!rawInput"
            to="/help"
            class="text-xs text-gray-400 hover:text-primary-500 transition-colors"
          >
            New to SSE? See examples
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

      <!-- Right Panel: Event Preview -->
      <EventPreview :events="allEvents" />
    </main>

    <!-- Mobile Bottom Bar -->
    <MobileBottomBar
      :has-input="!!rawInput"
      :has-events="allEvents.length > 0"
      :is-sharing="isSharing"
      :export-options="exportOptions"
      @share="shareStream"
      @export="handleExport"
    />

    <!-- Footer -->
    <AppFooter />

    <!-- Export Modal -->
    <ExportPreviewModal
      v-model="showExportModal"
      :content="exportContent"
      :format="exportFormat"
      :event-count="allEvents.length"
    />
  </div>
</template>
