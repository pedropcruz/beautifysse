import type { StreamParser } from '~/types/parser'
import type { ParsedEvent } from '~/types/sse'

export const VercelAIParser: StreamParser = {
  name: 'Vercel AI SDK',
  description: 'Parses Vercel AI Data Stream Protocol (0:"text", d:{})',

  detect(raw: string): boolean {
    const lines = raw.split('\n').filter(l => l.trim())
    if (lines.length === 0) return false
    return lines.some(line => /^([0-9]|d):/.test(line))
  },

  parse(raw: string): ParsedEvent[] {
    const events: ParsedEvent[] = []
    const lines = raw.split('\n')

    for (const line of lines) {
      if (!line.trim()) continue

      const colonIndex = line.indexOf(':')
      if (colonIndex === -1) continue

      const type = line.slice(0, colonIndex)
      const contentRaw = line.slice(colonIndex + 1)

      let content = contentRaw
      try {
        if (contentRaw.startsWith('"') && contentRaw.endsWith('"')) {
          content = JSON.parse(contentRaw)
        } else {
          content = contentRaw
        }
      } catch {
        // keep raw if parse fails
      }

      let eventType = 'message'
      switch (type) {
        case '0':
          eventType = 'text'
          break
        case '1':
          eventType = 'data'
          break
        case '2':
          eventType = 'error'
          break
        case '3':
          eventType = 'tool_call'
          break
        case '8':
          eventType = 'annotation'
          break
        case 'd':
          eventType = 'finish'
          break
        default:
          eventType = `type-${type}`
          break
      }

      events.push({
        id: '',
        event: eventType,
        data: typeof content === 'string' ? content : JSON.stringify(content),
        retry: undefined
      })
    }

    return events
  }
}
