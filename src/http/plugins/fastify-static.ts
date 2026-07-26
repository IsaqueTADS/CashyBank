import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fastifyStatic from '@fastify/static'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { FailedToCreateUploadDirector } from '../errors/failed-to-create-upload-directory.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const fastifyStaticPlugin = fp(async (fastify: FastifyInstance) => {
  const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads')

  try {
    await fs.mkdir(uploadDir, { recursive: true })
  } catch {
    throw new FailedToCreateUploadDirector()
  }

  await fastify.register(fastifyStatic, {
    root: uploadDir,
    prefix: '/uploads',
  })
})
