<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  depth?: number
  searchQuery?: string
}>()

const depth = props.depth ?? 0
const isExpanded = ref(depth < 2)

const isObject = computed(() => {
  return props.data !== null && typeof props.data === 'object'
})

const valueClasses = computed(() => ({
  'text-green-600 dark:text-green-400': typeof props.data === 'string',
  'text-orange-600 dark:text-orange-400': typeof props.data === 'number',
  'text-purple-600 dark:text-purple-400': typeof props.data === 'boolean',
  'text-gray-500': props.data === null
}))

const toggle = () => {
  isExpanded.value = !isExpanded.value
}

const preview = computed(() => {
  if (Array.isArray(props.data)) {
    return `Array(${props.data.length})`
  }
  return `{ ... }`
})

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const highlight = (text: string) => {
  const safeText = escapeHtml(text)
  if (!props.searchQuery) return safeText
  const safeQuery = props.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${safeQuery})`, 'gi')
  return safeText.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-gray-100 rounded-sm px-0.5">$1</mark>'
  )
}
</script>

<template>
  <!-- Primitive values: inline span -->
  <TimestampValue
    v-if="!isObject"
    :value="data"
  >
    <span
      class="font-mono text-sm"
      :class="valueClasses"
    >
      <span
        v-if="typeof data === 'string'"
        v-html="`&quot;${highlight(data)}&quot;`"
      />
      <span
        v-else
        v-html="highlight(String(data))"
      />
    </span>
  </TimestampValue>

  <!-- Objects/Arrays: block div -->
  <div
    v-else
    class="font-mono text-sm"
  >
    <div
      class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center gap-1 rounded px-1 select-none"
      @click="toggle"
    >
      <UIcon
        :name="isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        class="w-3 h-3 text-gray-400"
      />
      <span class="text-gray-500">{{ Array.isArray(data) ? '[' : '{' }}</span>
      <span
        v-if="!isExpanded"
        class="text-gray-400 italic text-[10px] mx-1"
      >{{ preview }}</span>
    </div>

    <div
      v-if="isExpanded"
      class="pl-8 border-l border-gray-100 dark:border-gray-800 ml-1"
    >
      <div
        v-for="(value, key) in data"
        :key="key"
        class="my-0.5"
      >
        <span
          class="text-blue-600 dark:text-blue-400 mr-1"
          v-html="`${highlight(String(key))}:`"
        />
        <JsonViewer
          :data="value"
          :depth="depth + 1"
          :search-query="searchQuery"
        />
      </div>
    </div>

    <div
      v-if="isExpanded"
      class="text-gray-500 ml-5"
    >
      {{ Array.isArray(data) ? ']' : '}' }}
    </div>
    <span
      v-else
      class="text-gray-500"
    >
      {{ Array.isArray(data) ? ']' : '}' }}
    </span>
  </div>
</template>
