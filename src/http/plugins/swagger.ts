import FastifySwagger from '@fastify/swagger'
import FastifyApiReference from '@scalar/fastify-api-reference'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import { env } from '@/env/index.js'

export const swaggerPlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(FastifySwagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'CashyBank API',
          description:
            'API de controle financeiro pessoal.',
          version: '2.0.0',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        servers: [
          {
            url: env.API_URL,
            description: 'Development server',
          },
        ],
      },
      transform: jsonSchemaTransform,
    })

    await fastify.register(FastifyApiReference, {
      routePrefix: '/docs',
      configuration: {
        theme: 'bluePlanet',
      },
    })
  },
  { name: 'swagger' },
)
