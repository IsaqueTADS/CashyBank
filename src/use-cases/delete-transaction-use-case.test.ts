import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository.js'
import { DeleteTransactionUseCase } from './delete-transaction-use-case.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { UnauthorizedError } from './errors/unauthorized-error.js'

let transactionsRepository: InMemoryTransactionsRepository
let sut: DeleteTransactionUseCase

describe('DeleteTransaction UseCase', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new DeleteTransactionUseCase(transactionsRepository)
  })

  it('deve marcar a transação como deletada (soft delete)', async () => {
    const created = await transactionsRepository.create({
      value: 1000,
      type_id: 'type-1',
      category_id: 'cat-1',
      user_id: 'user-1',
    })

    await sut.execute({
      transaction_id: created.id,
      user_id: 'user-1',
    })

    const transaction = await transactionsRepository.findById(created.id)
    expect(transaction).toBeNull()
  })

  it('deve lançar ResourceNotFoundError quando a transação não existe', async () => {
    await expect(() =>
      sut.execute({
        transaction_id: 'non-existent-id',
        user_id: 'user-1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('deve lançar UnauthorizedError quando o user_id não é o dono', async () => {
    const created = await transactionsRepository.create({
      value: 1000,
      type_id: 'type-1',
      category_id: 'cat-1',
      user_id: 'user-1',
    })

    await expect(() =>
      sut.execute({
        transaction_id: created.id,
        user_id: 'another-user',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
