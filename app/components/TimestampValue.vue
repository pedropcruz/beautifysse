<script setup lang="ts">
const props = defineProps<{
  value: number | string
}>()

// Detect if value is a timestamp
const timestampInfo = computed(() => {
  const val = props.value

  // Check for Unix timestamp in milliseconds (13 digits, 1970-2100 range)
  if (typeof val === 'number' && val > 1000000000000 && val < 4102444800000) {
    return { type: 'ms', date: new Date(val) }
  }

  // Check for Unix timestamp in seconds (10 digits, 1970-2100 range)
  if (typeof val === 'number' && val > 1000000000 && val < 4102444800) {
    return { type: 's', date: new Date(val * 1000) }
  }

  // Check for ISO 8601 string
  if (typeof val === 'string') {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/
    if (isoRegex.test(val)) {
      const date = new Date(val)
      if (!isNaN(date.getTime())) {
        return { type: 'iso', date }
      }
    }
  }

  return null
})

const formattedDate = computed(() => {
  if (!timestampInfo.value) return ''
  const date = timestampInfo.value.date
  return date.toISOString().replace('T', ' ').replace('Z', ' UTC')
})

const localDate = computed(() => {
  if (!timestampInfo.value) return ''
  const date = timestampInfo.value.date
  return date.toLocaleString()
})
</script>

<template>
  <span class="inline-flex items-center gap-0.5">
    <slot />
    <UTooltip
      v-if="timestampInfo"
      :ui="{ content: 'min-w-max h-auto overflow-visible' }"
    >
      <UIcon
        name="i-lucide-clock"
        class="w-3 h-3 text-gray-400 hover:text-primary-500 cursor-help"
      />
      <template #content>
        <span class="text-xs whitespace-nowrap">
          {{ formattedDate }}
          <span class="text-gray-400 ml-2">{{ localDate }}</span>
        </span>
      </template>
    </UTooltip>
  </span>
</template>
