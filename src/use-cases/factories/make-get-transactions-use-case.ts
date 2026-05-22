import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository.js'
import { GetTransactionsUseCase } from '../get-transactions-use-case.js'

export function makeGetTransactionsUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  return new GetTransactionsUseCase(transactionsRepository)
}
