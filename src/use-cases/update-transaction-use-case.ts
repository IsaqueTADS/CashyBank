import type { UpdateTransactionDTO } from '@/dtos/transaction/update-transaction.dto.js'
import type { TransactionsRepository } from '@/repositories/transactions-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface UpdateTransactionUseCaseRequest extends UpdateTransactionDTO {
  user_id: string
}

export class UpdateTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ id, user_id, ...data }: UpdateTransactionUseCaseRequest) {
    const transaction = await this.transactionsRepository.findById(id)

    if (!transaction) {
      throw new ResourceNotFoundError('Transação')
    }

    await this.transactionsRepository.update({ id, ...data })
  }
}
