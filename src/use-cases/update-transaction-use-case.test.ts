import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { UpdateTransactionUseCase } from './update-transaction-use-case.js'

let transactionsRepository: InMemoryTransactionsRepository
let sut: UpdateTransactionUseCase

describe('UpdateTransaction UseCase', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new UpdateTransactionUseCase(transactionsRepository)
  })

  it('deve atualizar uma transação existente', async () => {
    const created = await transactionsRepository.create({
      value: 1000,
      description: 'antigo',
      type_id: 'type-1',
      category_id: 'cat-1',
      user_id: 'user-1',
    })

    await sut.execute({
      id: created.id,
      user_id: 'user-1',
      value: 2000,
      description: 'atualizado',
    })

    const updated = await transactionsRepository.findById(created.id)
    expect(updated?.value).toBe(2000)
    expect(updated?.description).toBe('atualizado')
  })

  it('deve lançar ResourceNotFoundError quando a transação não existe', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existent-id',
        user_id: 'user-1',
        value: 100,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('deve atualizar apenas campos fornecidos', async () => {
    const created = await transactionsRepository.create({
      value: 1000,
      description: 'original',
      type_id: 'type-1',
      category_id: 'cat-1',
      user_id: 'user-1',
    })

    await sut.execute({
      id: created.id,
      user_id: 'user-1',
      value: 999,
    })

    const updated = await transactionsRepository.findById(created.id)
    expect(updated?.value).toBe(999)
    expect(updated?.description).toBe('original')
  })
})
