import type { FastifyReply, FastifyRequest } from 'fastify'
import { TransactionParamsSchema } from '@/http/schemas/transaction-schema.js'
import { makeDeleteTransactionUseCase } from '@/use-cases/factories/make-delete-transaction-use-case.js'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error.js'

export async function deleteController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = TransactionParamsSchema.parse(request.params)
  const userId = request.user.sub

  try {
    const deleteTransactionUseCase = makeDeleteTransactionUseCase()

    await deleteTransactionUseCase.execute({
      transaction_id: id,
      user_id: userId,
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    if (err instanceof UnauthorizedError) {
      return reply.status(403).send({ message: err.message })
    }

    throw err
  }
}
