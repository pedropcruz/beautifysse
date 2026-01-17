<script setup lang="ts">
import type { ExportFormat } from '../../types/export'
import { downloadFile, generateFilename } from '../../utils/exporters'

const props = defineProps<{
  content: string
  format: ExportFormat
  eventCount: number
}>()

const model = defineModel<boolean>({ required: true })
const toast = useToast()

const formatLabels: Record<ExportFormat, string> = {
  json: 'JSON',
  csv: 'CSV',
  txt: 'Raw Text'
}

const mimeTypes: Record<ExportFormat, string> = {
  json: 'application/json',
  csv: 'text/csv',
  txt: 'text/plain'
}

const modalTitle = computed(() => `Export ${formatLabels[props.format]}`)
const modalDescription = computed(() => `${props.eventCount} events`)

function copyToClipboard() {
  navigator.clipboard.writeText(props.content)
  toast.add({
    title: 'Copied!',
    description: 'Content copied to clipboard.',
    color: 'success',
    duration: 3000
  })
}

function download() {
  const filename = generateFilename(props.format)
  downloadFile(props.content, filename, mimeTypes[props.format])
  toast.add({
    title: 'Downloaded!',
    description: `Saved as ${filename}`,
    color: 'success',
    duration: 3000
  })
  model.value = false
}
</script>

<template>
  <UModal
    v-model:open="model"
    :title="modalTitle"
    :description="modalDescription"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <textarea
        :value="content"
        readonly
        class="w-full h-72 p-3 font-mono text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none"
      />
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-clipboard"
        label="Copy"
        color="neutral"
        variant="outline"
        @click="copyToClipboard"
      />
      <UButton
        icon="i-lucide-download"
        label="Download"
        color="primary"
        @click="download"
      />
    </template>
  </UModal>
</template>
