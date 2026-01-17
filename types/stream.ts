export interface StreamRequest {
  url: string
  method: 'GET' | 'POST'
  headers: Array<{ key: string, value: string }>
}
