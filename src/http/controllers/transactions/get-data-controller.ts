import type { FastifyReply, FastifyRequest } from 'fastify'
import { GetTransactionDataUseCase } from '@/use-cases/get-transaction-data-use-case.js'

export async function getDataController(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTransactionDataUseCase = new GetTransactionDataUseCase()

  const result = await getTransactionDataUseCase.execute()

  return reply.status(200).send(result)
}
