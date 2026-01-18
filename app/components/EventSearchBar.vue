<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  matchingCount: number
  matchingCards: number
  currentCardIndex: number
  totalEvents: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'next-match': []
}>()

const searchQuery = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const handleEnter = () => {
  emit('next-match')
}

const handleEscape = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between gap-4">
    <div class="flex items-center gap-2 flex-1">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        placeholder="Search events..."
        size="xs"
        class="w-full max-w-xs"
        @keydown.enter="handleEnter"
        @keydown.esc="handleEscape"
      />
      <div
        v-if="searchQuery && matchingCount > 0"
        class="text-xs font-mono text-gray-500 whitespace-nowrap"
      >
        {{ matchingCount }} found <span class="text-gray-400">({{ currentCardIndex + 1 }}/{{ matchingCards }} cards)</span>
      </div>
      <div
        v-else-if="searchQuery"
        class="text-xs text-red-500 whitespace-nowrap"
      >
        0 results
      </div>
    </div>
    <div class="text-xs text-gray-500 whitespace-nowrap">
      {{ totalEvents }} events
    </div>
  </div>
</template>
