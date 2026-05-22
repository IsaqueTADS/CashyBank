import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository.js'
import { CreateTransactionUseCase } from './create-transaction-use-case.js'

let transactionsRepository: InMemoryTransactionsRepository
let sut: CreateTransactionUseCase

describe('Create Transaction UseCase', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new CreateTransactionUseCase(transactionsRepository)
  })

  it('deve criar uma transação', async () => {
    const { transaction } = await sut.execute({
      value: 1000,
      type_id: 'type-1',
      category_id: 'cat-1',
      user_id: 'user-1',
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(transaction.value).toBe(1000)
  })
})
