import type { ParsedEvent } from './sse'

export interface StreamParser {
  name: string
  description: string
  parse(raw: string): ParsedEvent[]
  detect(raw: string): boolean
}
