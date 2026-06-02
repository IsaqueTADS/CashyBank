import type { Transaction } from '@/dtos/transaction/transaction.js'
import type { TransactionsRepository } from '@/repositories/transactions-repository.js'

interface CreateTransactionUseCaseRequest {
  value: number
  description?: string
  type_id: string
  category_id: string
  user_id: string
}

interface CreateTransactionUseCaseResponse {
  transaction: Transaction
}

export class CreateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    value,
    description,
    type_id,
    category_id,
    user_id,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const transaction = await this.transactionsRepository.create({
      value,
      description,
      type_id,
      category_id,
      user_id,
    })

    return { transaction }
  }
}
