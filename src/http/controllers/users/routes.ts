import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { VerifyJWT } from '@/http/middlewares/verify-jwt.js'
import {
  AuthenticateBodySchema,
  AuthResponseSchema,
  RegisterBodySchema,
  UploadAvatarUserResponseSchema,
} from '@/http/schemas/auth-schema.js'
import { ErrorSchema } from '@/http/schemas/error-schema.js'
import { ValidationErrorSchema } from '@/http/schemas/validation-error-schema.js'
import { authenticateController } from './authenticate-controller.js'
import { registerController } from './register-controller.js'
import { uploadAvatarUserController } from './upload-avatar-user-controller.js'

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.route({
    method: 'POST',
    url: '/auth/register',
    schema: {
      tags: ['Auth'],
      summary: 'Register user',
      body: RegisterBodySchema,
      response: {
        201: z.null(),
        400: ValidationErrorSchema,
        409: ErrorSchema,
      },
    },
    handler: registerController,
  })

  app.route({
    method: 'POST',
    url: '/auth/login',
    schema: {
      tags: ['Auth'],
      summary: 'Authenticate user',
      body: AuthenticateBodySchema,
      response: {
        200: AuthResponseSchema,
        400: z.union([ValidationErrorSchema, ErrorSchema]),
      },
    },
    handler: authenticateController,
  })

  app.route({
    method: 'PATCH',
    url: '/me/avatar',
    schema: {
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
      tags: ['me'],
      summary: 'Upload avatar user',
      response: {
        200: UploadAvatarUserResponseSchema,
        401: ErrorSchema,
      }
    },
    preHandler: VerifyJWT,
    onRequest: VerifyJWT,
    handler: uploadAvatarUserController,
  })
}
