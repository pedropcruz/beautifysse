import type { ParsedEvent } from '../types/sse'
import type { ExportMetadata, ExportFormat } from '../types/export'

export function exportToJSON(events: ParsedEvent[], parserName: string | null): string {
  const data: ExportMetadata = {
    exportedAt: new Date().toISOString(),
    parser: parserName,
    eventCount: events.length,
    events: events.map((event, index) => ({ index: index + 1, ...event }))
  }
  return JSON.stringify(data, null, 2)
}

export function exportToCSV(events: ParsedEvent[]): string {
  const headers = ['index', 'event', 'id', 'data', 'retry']
  const rows = events.map((event, index) => [
    index + 1,
    escapeCSVField(event.event),
    escapeCSVField(event.id),
    escapeCSVField(event.data),
    event.retry ?? ''
  ].join(','))

  return [headers.join(','), ...rows].join('\n')
}

export function exportToRawText(rawInput: string): string {
  return rawInput
}

function escapeCSVField(value: string): string {
  if (value === null || value === undefined) return ''

  const stringValue = String(value)
  const needsQuotes = stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')

  return needsQuotes ? `"${stringValue.replace(/"/g, '""')}"` : stringValue
}

export function generateFilename(format: ExportFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  return `sse-export-${timestamp}.${format}`
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
