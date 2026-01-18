<script setup lang="ts">
import type { ExportFormat } from '../../types/export'

defineProps<{
  hasInput: boolean
  hasEvents: boolean
  isSharing: boolean
  exportOptions: { label: string, value: string, icon: string }[]
}>()

const emit = defineEmits<{
  share: []
  export: [format: ExportFormat]
}>()
</script>

<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 flex items-center justify-around z-50">
    <UButton
      v-if="hasInput"
      :loading="isSharing"
      icon="i-lucide-share-2"
      label="Share"
      size="xs"
      color="white"
      variant="solid"
      @click="emit('share')"
    />
    <UDropdownMenu
      v-if="hasEvents"
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
          @click="emit('export', item.value as ExportFormat)"
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
</template>
