import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository.js'
import { GetTransactionUseCase } from '../get-transaction-use-case.js'

export function makeGetTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  return new GetTransactionUseCase(transactionsRepository)
}
