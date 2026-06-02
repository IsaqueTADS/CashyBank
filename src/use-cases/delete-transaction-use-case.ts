import type { TransactionsRepository } from '@/repositories/transactions-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { UnauthorizedError } from './errors/unauthorized-error.js'

interface DeleteTransactionUseCaseRequest {
  transaction_id: string
  user_id: string
}

export class DeleteTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ transaction_id, user_id }: DeleteTransactionUseCaseRequest) {
    const transaction =
      await this.transactionsRepository.findById(transaction_id)

    if (!transaction) {
      throw new ResourceNotFoundError('Transação')
    }

    if (transaction.user_id !== user_id) {
      throw new UnauthorizedError('Sem autorização para deletar esta transação')
    }

    await this.transactionsRepository.delete(transaction_id)
  }
}
