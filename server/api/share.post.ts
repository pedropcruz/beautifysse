import { db } from 'hub:db'
import * as tables from '~~/server/db/schema'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.content || typeof body.content !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content is required and must be a string'
    })
  }

  const id = nanoid(10)

  await db.insert(tables.streams).values({
    id,
    content: body.content
  })

  return { id }
})
