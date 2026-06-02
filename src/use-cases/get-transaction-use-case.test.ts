import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository.js'
import { GetTransactionUseCase } from './get-transaction-use-case.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

let transactionsRepository: InMemoryTransactionsRepository
let sut: GetTransactionUseCase

describe('GetTransaction UseCase', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetTransactionUseCase(transactionsRepository)
  })

  it('deve retornar uma transação por ID', async () => {
    const created = await transactionsRepository.create({
      value: 1000,
      type_id: 'type-1',
      category_id: 'cat-1',
      user_id: 'user-1',
    })

    const { transaction } = await sut.execute({
      transaction_id: created.id,
    })

    expect(transaction.id).toBe(created.id)
    expect(transaction.value).toBe(1000)
  })

  it('deve lançar ResourceNotFoundError quando a transação não existe', async () => {
    await expect(() =>
      sut.execute({
        transaction_id: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('não deve retornar transação deletada (soft delete)', async () => {
    const created = await transactionsRepository.create({
      value: 1000,
      type_id: 'type-1',
      category_id: 'cat-1',
      user_id: 'user-1',
    })

    await transactionsRepository.delete(created.id)

    await expect(() =>
      sut.execute({ transaction_id: created.id }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
