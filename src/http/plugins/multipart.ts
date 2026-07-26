import fastifyMultipart from '@fastify/multipart'
import type { FastifyInstance } from 'fastify'

export const multipartPlugin = async (fastify: FastifyInstance) => {
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, //10mb
    },
  })
}
