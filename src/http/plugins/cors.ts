import fastifyCors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export const corsPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyCors, {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
})
