import type { FastifyReply, FastifyRequest } from 'fastify'
import { UpdateTransactionBodySchema } from '@/http/schemas/transaction-schema.js'
import { makeUpdateTransactionUseCase } from '@/use-cases/factories/make-update-transaction-use-case.js'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'

export async function updateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id, typeId, categoryId, value, description } =
    UpdateTransactionBodySchema.parse(request.body)

  const userId = request.user.sub

  try {
    const updateTransactionUseCase = makeUpdateTransactionUseCase()

    await updateTransactionUseCase.execute({
      id,
      user_id: userId,
      type_id: typeId,
      category_id: categoryId,
      value,
      description,
    })

    return reply.status(200).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
