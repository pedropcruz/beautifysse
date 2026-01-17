import type * as schema from '../server/db/schema'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

declare module 'hub:db' {
  export const db: DrizzleD1Database<typeof schema>
}
