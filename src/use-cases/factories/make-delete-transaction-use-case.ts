import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository.js'
import { DeleteTransactionUseCase } from '../delete-transaction-use-case.js'

export function makeDeleteTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  return new DeleteTransactionUseCase(transactionsRepository)
}
