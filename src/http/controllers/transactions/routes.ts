import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {
  CreateTransactionBodySchema,
  TransactionResponseSchema,
  TransactionsResponseSchema,
  TransactionDataResponseSchema,
  GetTransactionsQuerySchema,
  UpdateTransactionBodySchema,
  TransactionParamsSchema,
} from '@/http/schemas/transaction-schema.js'
import { ErrorSchema } from '@/http/schemas/error-schema.js'
import { ValidationErrorSchema } from '@/http/schemas/validation-error-schema.js'
import { VerifyJWT } from '../../middlewares/verify-jwt.js'
import { createController } from './create-controller.js'
import { deleteController } from './delete-controller.js'
import { updateController } from './update-controller.js'
import { getController } from './get-controller.js'
import { getDataController } from './get-data-controller.js'

export const transactionsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRequest', VerifyJWT)

  app.route({
    method: 'GET',
    url: '/transaction/categories',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Transactions'],
      summary: 'Get transaction types and categories',
      response: {
        200: TransactionDataResponseSchema,
        401: ErrorSchema,
      },
    },
    handler: getDataController,
  })

  app.route({
    method: 'GET',
    url: '/transaction',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Transactions'],
      summary: 'List transactions',
      querystring: GetTransactionsQuerySchema,
      response: {
        200: TransactionsResponseSchema,
        401: ErrorSchema,
      },
    },
    handler: getController,
  })

  app.route({
    method: 'POST',
    url: '/transaction',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Transactions'],
      summary: 'Create transaction',
      body: CreateTransactionBodySchema,
      response: {
        201: TransactionResponseSchema,
        400: ValidationErrorSchema,
        401: ErrorSchema,
      },
    },
    handler: createController,
  })

  app.route({
    method: 'DELETE',
    url: '/transaction/:id',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Transactions'],
      summary: 'Delete transaction',
      params: TransactionParamsSchema,
      response: {
        204: z.null(),
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
      },
    },
    handler: deleteController,
  })

  app.route({
    method: 'PUT',
    url: '/transaction',
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ['Transactions'],
      summary: 'Update transaction',
      body: UpdateTransactionBodySchema,
      response: {
        200: z.null(),
        400: ValidationErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
      },
    },
    handler: updateController,
  })
}
