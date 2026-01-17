import { StandardParser } from './standard'
import { VercelAIParser } from './vercel-ai'
import type { StreamParser } from '~/types/parser'

export const AvailableParsers: StreamParser[] = [
  StandardParser,
  VercelAIParser
]

export const detectParser = (raw: string): StreamParser => {
  return AvailableParsers.find(p => p.detect(raw)) || StandardParser
}
