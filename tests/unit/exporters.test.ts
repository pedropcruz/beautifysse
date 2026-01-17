import { describe, it, expect } from 'vitest'
import {
  exportToJSON,
  exportToCSV,
  exportToRawText,
  generateFilename
} from '../../utils/exporters'
import type { ParsedEvent } from '../../types/sse'

const mockEvents: ParsedEvent[] = [
  { id: '1', event: 'message', data: 'Hello world', retry: undefined },
  { id: '2', event: 'update', data: '{"foo": "bar"}', retry: 1000 }
]

describe('exportToJSON', () => {
  it('should export events with metadata', () => {
    const result = JSON.parse(exportToJSON(mockEvents, 'Standard SSE'))

    expect(result.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    expect(result.parser).toBe('Standard SSE')
    expect(result.eventCount).toBe(2)
    expect(result.events).toHaveLength(2)
  })

  it('should add index to each event starting from 1', () => {
    const result = JSON.parse(exportToJSON(mockEvents, null))

    expect(result.events[0].index).toBe(1)
    expect(result.events[1].index).toBe(2)
  })

  it('should preserve all event fields', () => {
    const result = JSON.parse(exportToJSON(mockEvents, null))

    expect(result.events[0]).toMatchObject({
      id: '1',
      event: 'message',
      data: 'Hello world'
    })
  })

  it('should handle null parser name', () => {
    const result = JSON.parse(exportToJSON(mockEvents, null))

    expect(result.parser).toBeNull()
  })

  it('should handle empty events array', () => {
    const result = JSON.parse(exportToJSON([], 'Test'))

    expect(result.eventCount).toBe(0)
    expect(result.events).toEqual([])
  })
})

describe('exportToCSV', () => {
  it('should create CSV with headers', () => {
    const result = exportToCSV(mockEvents)
    const lines = result.split('\n')

    expect(lines[0]).toBe('index,event,id,data,retry')
  })

  it('should export event data in correct columns', () => {
    const result = exportToCSV(mockEvents)
    const lines = result.split('\n')

    expect(lines[1]).toBe('1,message,1,Hello world,')
    expect(lines[2]).toBe('2,update,2,"{""foo"": ""bar""}",1000')
  })

  it('should escape fields containing commas', () => {
    const events: ParsedEvent[] = [
      { id: '1', event: 'test', data: 'hello, world', retry: undefined }
    ]
    const result = exportToCSV(events)
    const lines = result.split('\n')

    expect(lines[1]).toContain('"hello, world"')
  })

  it('should escape fields containing quotes', () => {
    const events: ParsedEvent[] = [
      { id: '1', event: 'test', data: 'say "hello"', retry: undefined }
    ]
    const result = exportToCSV(events)
    const lines = result.split('\n')

    expect(lines[1]).toContain('"say ""hello"""')
  })

  it('should escape fields containing newlines', () => {
    const events: ParsedEvent[] = [
      { id: '1', event: 'test', data: 'line1\nline2', retry: undefined }
    ]
    const result = exportToCSV(events)

    expect(result).toContain('"line1\nline2"')
  })

  it('should handle empty events array', () => {
    const result = exportToCSV([])

    expect(result).toBe('index,event,id,data,retry')
  })
})

describe('exportToRawText', () => {
  it('should return input unchanged', () => {
    const input = 'data: hello\n\ndata: world'
    const result = exportToRawText(input)

    expect(result).toBe(input)
  })

  it('should preserve whitespace and special characters', () => {
    const input = '  data: {"key": "value"}\n\n\tevent: test\n'
    const result = exportToRawText(input)

    expect(result).toBe(input)
  })
})

describe('generateFilename', () => {
  it('should generate filename with json extension', () => {
    const result = generateFilename('json')

    expect(result).toMatch(/^sse-export-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/)
  })

  it('should generate filename with csv extension', () => {
    const result = generateFilename('csv')

    expect(result).toMatch(/^sse-export-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.csv$/)
  })

  it('should generate filename with txt extension', () => {
    const result = generateFilename('txt')

    expect(result).toMatch(/^sse-export-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.txt$/)
  })
})
