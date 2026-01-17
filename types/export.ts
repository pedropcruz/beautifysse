import type { ParsedEvent } from './sse'

export interface IndexedEvent extends ParsedEvent {
  index: number
}

export interface ExportMetadata {
  exportedAt: string
  parser: string | null
  eventCount: number
  events: IndexedEvent[]
}

export type ExportFormat = 'json' | 'csv' | 'txt'
