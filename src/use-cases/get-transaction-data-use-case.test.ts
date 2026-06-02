import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetTransactionDataUseCase } from './get-transaction-data-use-case.js'

const mockPrisma = vi.hoisted(() => ({
  transactionType: { findMany: vi.fn() },
  transactionCategory: { findMany: vi.fn() },
}))

vi.mock('@/lib/prisma.js', () => ({
  prisma: mockPrisma,
}))

let sut: GetTransactionDataUseCase

describe('GetTransactionData UseCase', () => {
  beforeEach(() => {
    sut = new GetTransactionDataUseCase()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar tipos e categorias', async () => {
    const types = [
      { id: 'type-1', name: 'Entrada' },
      { id: 'type-2', name: 'Saída' },
    ]
    const categories = [
      { id: 'cat-1', name: 'Casa' },
      { id: 'cat-2', name: 'Academia' },
    ]

    mockPrisma.transactionType.findMany.mockResolvedValue(types)
    mockPrisma.transactionCategory.findMany.mockResolvedValue(categories)

    const result = await sut.execute()

    expect(result.types).toEqual(types)
    expect(result.categories).toEqual(categories)
    expect(mockPrisma.transactionType.findMany).toHaveBeenCalledOnce()
    expect(mockPrisma.transactionCategory.findMany).toHaveBeenCalledOnce()
  })

  it('deve retornar listas vazias quando não há dados', async () => {
    mockPrisma.transactionType.findMany.mockResolvedValue([])
    mockPrisma.transactionCategory.findMany.mockResolvedValue([])

    const result = await sut.execute()

    expect(result.types).toHaveLength(0)
    expect(result.categories).toHaveLength(0)
  })
})
