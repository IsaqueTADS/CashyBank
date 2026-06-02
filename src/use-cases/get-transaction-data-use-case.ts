import type {
  TransactionCategory,
  TransactionType,
} from '@/dtos/transaction/transaction.js'
import { prisma } from '@/lib/prisma.js'

interface GetTransactionDataUseCaseResponse {
  types: TransactionType[]
  categories: TransactionCategory[]
}

export class GetTransactionDataUseCase {
  async execute(): Promise<GetTransactionDataUseCaseResponse> {
    const [types, categories] = await Promise.all([
      prisma.transactionType.findMany({
        select: { id: true, name: true },
      }),
      prisma.transactionCategory.findMany({
        select: { id: true, name: true },
      }),
    ])

    return { types, categories }
  }
}
