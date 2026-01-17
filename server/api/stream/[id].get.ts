import { db } from 'hub:db'
import { eq } from 'drizzle-orm'
import * as tables from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }

  const results = await db.select().from(tables.streams).where(eq(tables.streams.id, id)).limit(1)
  const result = results[0]

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Stream not found'
    })
  }

  return result
})
