import type { StreamParser } from '~/types/parser'
import type { ParsedEvent } from '~/types/sse'

export const StandardParser: StreamParser = {
  name: 'Standard SSE',
  description: 'Parses standard Server-Sent Events (data: prefix)',

  detect(raw: string): boolean {
    return raw.includes('data:') || raw.includes('event:')
  },

  parse(raw: string): ParsedEvent[] {
    const events: ParsedEvent[] = []
    const blocks = raw.replace(/\r\n/g, '\n').split(/\n\n/)

    for (const block of blocks) {
      if (!block.trim()) continue

      const lines = block.split('\n')
      const currentEvent: ParsedEvent = {
        id: '',
        event: 'message',
        data: '',
        retry: undefined
      }
      const dataBuffer: string[] = []

      for (const line of lines) {
        if (line.startsWith(':')) continue

        const colonIndex = line.indexOf(':')
        let field = ''
        let value = ''

        if (colonIndex === -1) {
          field = line
          value = ''
        } else {
          field = line.slice(0, colonIndex)
          value = line.slice(colonIndex + 1)
          if (value.startsWith(' ')) {
            value = value.slice(1)
          }
        }

        switch (field) {
          case 'id':
            currentEvent.id = value
            break
          case 'event':
            currentEvent.event = value
            break
          case 'retry': {
            const retry = parseInt(value, 10)
            if (!isNaN(retry)) currentEvent.retry = retry
            break
          }
          case 'data':
            dataBuffer.push(value)
            break
        }
      }

      if (dataBuffer.length > 0) {
        currentEvent.data = dataBuffer.join('\n')
      }

      if (currentEvent.data || currentEvent.id || currentEvent.event !== 'message') {
        events.push(currentEvent)
      }
    }

    return events
  }
}
