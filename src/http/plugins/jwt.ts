import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { env } from '@/env/index.js'

export const jwtPlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(fastifyJwt, {
      secret: env.JWT_SECRET,
      sign: {
        expiresIn: '365d',
        algorithm: 'HS256',
      },
    })
  },
  { name: 'jwt' },
)
