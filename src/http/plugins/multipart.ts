import fastifyMultipart from '@fastify/multipart'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export const multipartPlugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, //10mb
    },
  })
})
