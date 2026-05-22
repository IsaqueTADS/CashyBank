import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  GetTransactionsQuerySchema,
} from '@/http/schemas/transaction-schema.js'
import { makeGetTransactionsUseCase } from '@/use-cases/factories/make-get-transactions-use-case.js'

export async function getController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    page,
    perPage,
    from,
    to,
    typeId,
    categoryIds,
    searchText,
    sortId,
  } = GetTransactionsQuerySchema.parse(request.query)

  const userId = request.user.sub

  const getTransactionsUseCase = makeGetTransactionsUseCase()

  const result = await getTransactionsUseCase.execute({
    user_id: userId,
    page,
    per_page: perPage,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
    type_id: typeId,
    category_ids: categoryIds ? categoryIds.split(',') : undefined,
    search_text: searchText,
    sort_id: sortId,
  })

  return reply.status(200).send(result)
}
