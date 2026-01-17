import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const streams = pgTable('streams', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
