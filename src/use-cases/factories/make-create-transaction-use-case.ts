import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository.js'
import { CreateTransactionUseCase } from '../create-transaction-use-case.js'

export function makeCreateTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  return new CreateTransactionUseCase(transactionsRepository)
}
