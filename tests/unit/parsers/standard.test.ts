import { describe, it, expect } from 'vitest'
import { StandardParser } from '../../../utils/parsers/standard'

describe('Standard SSE Parser', () => {
  it('should parse a simple event', () => {
    const input = `data: {"foo": "bar"}
\n`
    const result = StandardParser.parse(input)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      data: '{"foo": "bar"}',
      event: 'message',
      id: '',
      retry: undefined
    })
  })

  it('should parse multiple events', () => {
    const input = `data: event1

data: event2
`
    const result = StandardParser.parse(input)
    expect(result).toHaveLength(2)
    expect(result[0].data).toBe('event1')
    expect(result[1].data).toBe('event2')
  })

  it('should handle custom event names and ids', () => {
    const input = `event: update
id: 123
data: some data
`
    const result = StandardParser.parse(input)
    expect(result[0]).toEqual({
      event: 'update',
      id: '123',
      data: 'some data',
      retry: undefined
    })
  })

  it('should concatenate multiple data lines', () => {
    const input = `data: line1
data: line2
`
    const result = StandardParser.parse(input)
    expect(result[0].data).toBe('line1\nline2')
  })

  it('should ignore comments', () => {
    const input = `: this is a comment
data: real data
`
    const result = StandardParser.parse(input)
    expect(result[0].data).toBe('real data')
  })
})
