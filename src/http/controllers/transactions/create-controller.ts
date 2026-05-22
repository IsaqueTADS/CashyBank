import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateTransactionBodySchema } from '@/http/schemas/transaction-schema.js'
import { makeCreateTransactionUseCase } from '@/use-cases/factories/make-create-transaction-use-case.js'

export async function createController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { typeId, categoryId, value, description } =
    CreateTransactionBodySchema.parse(request.body)

  const userId = request.user.sub

  const createTransactionUseCase = makeCreateTransactionUseCase()

  const { transaction } = await createTransactionUseCase.execute({
    value,
    description,
    type_id: typeId,
    category_id: categoryId,
    user_id: userId,
  })

  return reply.status(201).send({ transaction })
}
