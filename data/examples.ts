export interface StreamExample {
  id: string
  name: string
  description: string
  stream: string
}

export const STREAM_EXAMPLES: StreamExample[] = [
  {
    id: 'standard',
    name: 'Standard SSE',
    description: 'The basic Server-Sent Events format as defined by the W3C specification.',
    stream: `event: message
data: {"status":"connected","user":"john_doe"}

event: update
data: {"count":42,"timestamp":"2024-01-15T10:30:00Z"}

event: message
data: {"status":"processing"}

data: Simple text without event type

event: done
data: {"status":"complete"}`
  },
  {
    id: 'vercel-ai',
    name: 'Vercel AI SDK',
    description: 'The streaming protocol used by Vercel AI SDK with prefixed message types (0: text, e: error, d: done).',
    stream: `0:"Hello"
0:" there"
0:"!"
0:" How"
0:" can"
0:" I"
0:" help"
0:" you"
0:" today"
0:"?"
e:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":15},"isContinued":false}
d:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":15}}`
  },
  {
    id: 'openai',
    name: 'OpenAI Streaming',
    description: 'The SSE format used by OpenAI chat completions API with delta chunks.',
    stream: `data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]`
  },
  {
    id: 'anthropic',
    name: 'Anthropic Streaming',
    description: 'The SSE format used by Anthropic Claude API with content block deltas.',
    stream: `data: {"type":"message_start","message":{"id":"msg_01","type":"message","role":"assistant","model":"claude-3-opus-20240229"}}

data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" World"}}

data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"!"}}

data: {"type":"content_block_stop","index":0}

data: {"type":"message_stop"}`
  }
]

export function getExampleById(id: string): StreamExample | undefined {
  return STREAM_EXAMPLES.find(e => e.id === id)
}
