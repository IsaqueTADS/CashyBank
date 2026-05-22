import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'
import { env } from '@/env/index.js'

export const errorHandlerPlugin = fp(
  async (fastify: FastifyInstance) => {
    fastify.setErrorHandler((error, _, reply) => {
      if (env.NODE_ENV !== 'production') {
        fastify.log.error(error)
      }

      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: 'Falha na validação',
          details: error.format(),
        })
      }

      if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.code(400).send({
          message: 'Falha na validação',
          details: error.validation.map((item) => {
            return { error: item.message }
          }),
        })
      }

      if (isResponseSerializationError(error)) {
        return reply.code(500).send({
          message: 'Falha ao serializar a resposta',
          details: error.cause.issues,
        })
      }

      return reply.status(500).send({ message: 'Internal server error.' })
    })
  },
  { name: 'errorHandler' },
)
