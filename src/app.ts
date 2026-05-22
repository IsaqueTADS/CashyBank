import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env/index.js'
import { transactionsRoutes } from './http/controllers/transactions/routes.js'
import { usersRoutes } from './http/controllers/users/routes.js'
import { corsPlugin } from './http/plugins/cors.js'
import { errorHandlerPlugin } from './http/plugins/error-handler.js'
import { jwtPlugin } from './http/plugins/jwt.js'
import { swaggerPlugin } from './http/plugins/swagger.js'

const envToLogger = {
  dev: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

export const app = fastify({
  logger: envToLogger[env.NODE_ENV] ?? true,
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

await app.register(swaggerPlugin)
await app.register(jwtPlugin)
await app.register(errorHandlerPlugin)
await app.register(corsPlugin)

app.register(usersRoutes)
app.register(transactionsRoutes)
