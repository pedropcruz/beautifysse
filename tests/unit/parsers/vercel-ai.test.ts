import { describe, it, expect } from 'vitest'
import { VercelAIParser } from '../../../utils/parsers/vercel-ai'

describe('Vercel AI SDK Parser', () => {
  it('should parse text parts (0:)', () => {
    const input = `0:"Hello"
0:" world"
`
    const result = VercelAIParser.parse(input)
    expect(result).toHaveLength(2)
    expect(result[0].data).toBe('Hello')
    expect(result[0].event).toBe('text')
    expect(result[1].data).toBe(' world')
  })

  it('should parse data parts (1:)', () => {
    const input = `1:{"foo":"bar"}`
    const result = VercelAIParser.parse(input)
    expect(result[0].event).toBe('data')
    expect(result[0].data).toBe('{"foo":"bar"}')
  })

  it('should parse error parts (2:)', () => {
    const input = `2:"An error occurred"`
    const result = VercelAIParser.parse(input)
    expect(result[0].event).toBe('error')
    expect(result[0].data).toBe('An error occurred')
  })

  it('should parse finish parts (d:)', () => {
    const input = `d:{"finishReason":"stop"}`
    const result = VercelAIParser.parse(input)
    expect(result[0].event).toBe('finish')
    expect(result[0].data).toBe('{"finishReason":"stop"}')
  })

  it('should detect valid stream', () => {
    expect(VercelAIParser.detect('0:"hi"')).toBe(true)
    expect(VercelAIParser.detect('data: hi')).toBe(false)
  })
})
