import type { Transaction } from '@/dtos/transaction/transaction.js'
import type { TransactionsRepository } from '@/repositories/transactions-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface GetTransactionUseCaseRequest {
  transaction_id: string
}

interface GetTransactionUseCaseResponse {
  transaction: Transaction
}

export class GetTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    transaction_id,
  }: GetTransactionUseCaseRequest): Promise<GetTransactionUseCaseResponse> {
    const transaction = await this.transactionsRepository.findById(transaction_id)

    if (!transaction) {
      throw new ResourceNotFoundError('Transação')
    }

    return { transaction }
  }
}
