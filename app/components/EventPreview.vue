<script setup lang="ts">
import type { ParsedEvent } from '../../types/sse'

const props = defineProps<{
  events: ParsedEvent[]
}>()

const searchQuery = ref('')
const currentMatchIndex = ref(0)

// Count occurrences in a string
const countOccurrences = (text: string, query: string): number => {
  if (!query) return 0
  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  return (text.match(regex) || []).length
}

// Get cards that match and total occurrence count
const searchResults = computed(() => {
  if (!searchQuery.value) return { matchingCards: [], totalOccurrences: 0 }

  const matchingCards: number[] = []
  let totalOccurrences = 0

  props.events.forEach((e, index) => {
    const dataCount = countOccurrences(e.data, searchQuery.value)
    const eventCount = countOccurrences(e.event, searchQuery.value)
    const idCount = e.id ? countOccurrences(e.id, searchQuery.value) : 0
    const cardTotal = dataCount + eventCount + idCount

    if (cardTotal > 0) {
      matchingCards.push(index)
      totalOccurrences += cardTotal
    }
  })

  return { matchingCards, totalOccurrences }
})

const matchingEvents = computed(() => searchResults.value.matchingCards)
const totalOccurrences = computed(() => searchResults.value.totalOccurrences)

watch(searchQuery, () => {
  currentMatchIndex.value = 0
  if (matchingEvents.value.length > 0) {
    const targetIndex = matchingEvents.value[0]
    if (targetIndex !== undefined) {
      scrollToEvent(targetIndex)
    }
  }
})

const handleNextMatch = () => {
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

const scrollToEvent = (index: number) => {
  const el = document.getElementById(`event-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const isHighlighted = (index: number): boolean => {
  return !!(searchQuery.value && matchingEvents.value[currentMatchIndex.value] === index)
}
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
    <!-- Search Bar (only when events exist) -->
    <EventSearchBar
      v-if="events.length > 0"
      v-model="searchQuery"
      :matching-count="totalOccurrences"
      :matching-cards="matchingEvents.length"
      :current-card-index="currentMatchIndex"
      :total-events="events.length"
      @next-match="handleNextMatch"
    />

    <!-- Content -->
    <div class="flex-1 p-4 overflow-y-auto scroll-smooth">
      <EmptyState v-if="events.length === 0" />

      <div
        v-else
        class="space-y-4 max-w-4xl mx-auto"
      >
        <EventCard
          v-for="(event, index) in events"
          :key="index"
          :event="event"
          :index="index"
          :is-highlighted="isHighlighted(index)"
          :search-query="searchQuery"
        />
      </div>
    </div>
  </div>
</template>
