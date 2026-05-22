import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository.js'
import { UpdateTransactionUseCase } from '../update-transaction-use-case.js'

export function makeUpdateTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  return new UpdateTransactionUseCase(transactionsRepository)
}
