import { createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function uploadAvatarUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file({
    limits: {
      files: 1,
      fields: 0,
      fileSize: 10 * 1040 * 1024, //10mb
    },
  })

  if (!data) return reply.status(400).send()

  const uploadDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'profiles',
  )
  await fs.mkdir(uploadDir, { recursive: true })

  const fullPath = path.join(uploadDir, data.filename)

  await pipeline(data.file, createWriteStream(fullPath))

  return reply.status(200).send({ message: 'Deu certo' })
}
