<script setup lang="ts">
import type { ParsedEvent } from '../../types/sse'

const props = defineProps<{
  event: ParsedEvent
  index: number
  isHighlighted: boolean
  searchQuery: string
}>()

const toast = useToast()

const isJson = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

const highlightText = (text: string) => {
  if (!props.searchQuery) return text
  const safeQuery = props.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeQuery})`, 'gi')
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-gray-100 rounded-sm px-0.5">$1</mark>'
  )
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.event.data)
  toast.add({
    title: 'Copied!',
    description: 'Event data copied to clipboard.',
    color: 'success',
    duration: 2000
  })
}
</script>

<template>
  <div
    :id="`event-${index}`"
    class="bg-white dark:bg-gray-900 rounded-lg border shadow-sm overflow-hidden transition-all duration-300"
    :class="[
      isHighlighted
        ? 'ring-2 ring-primary-500 border-primary-500 dark:border-primary-500'
        : 'border-gray-200 dark:border-gray-800'
    ]"
  >
    <div class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
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
          @click="copyToClipboard"
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
</template>
