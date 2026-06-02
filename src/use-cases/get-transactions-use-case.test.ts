import { beforeEach, describe, expect, it } from 'vitest'
import { uuidv7 } from 'uuidv7'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository.js'
import { GetTransactionsUseCase } from './get-transactions-use-case.js'

const ENTRADA_ID = '234c0d06-2983-4fcc-a942-1fa3684ebc55'
const SAIDA_ID = '43f8ea6f-43bc-4cfc-be37-0ff2a802f195'
const USER_ID = 'user-1'
const CATEGORY_ID = uuidv7()

let transactionsRepository: InMemoryTransactionsRepository
let sut: GetTransactionsUseCase

function seedTypesAndCategories() {
  transactionsRepository.types = [
    { id: ENTRADA_ID, name: 'Entrada' },
    { id: SAIDA_ID, name: 'Saída' },
  ]
  transactionsRepository.categories = [
    { id: CATEGORY_ID, name: 'Casa' },
  ]
}

describe('GetTransactions UseCase', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new GetTransactionsUseCase(transactionsRepository)
    seedTypesAndCategories()
  })

  it('deve listar transações paginadas', async () => {
    for (let i = 0; i < 5; i++) {
      await transactionsRepository.create({
        value: 100,
        type_id: ENTRADA_ID,
        category_id: CATEGORY_ID,
        user_id: USER_ID,
      })
    }

    const result = await sut.execute({
      user_id: USER_ID,
      page: 1,
      per_page: 3,
    })

    expect(result.transactions).toHaveLength(3)
    expect(result.total_rows).toBe(5)
    expect(result.total_pages).toBe(2)
    expect(result.page).toBe(1)
    expect(result.per_page).toBe(3)
  })

  it('deve retornar lista vazia quando não há transações', async () => {
    const result = await sut.execute({
      user_id: USER_ID,
    })

    expect(result.transactions).toHaveLength(0)
    expect(result.total_rows).toBe(0)
    expect(result.totals.revenue).toBe(0)
    expect(result.totals.expense).toBe(0)
    expect(result.totals.total).toBe(0)
  })

  it('deve calcular totais corretamente', async () => {
    await transactionsRepository.create({
      value: 1000, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })
    await transactionsRepository.create({
      value: 2000, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })
    await transactionsRepository.create({
      value: 500, type_id: SAIDA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })

    const result = await sut.execute({ user_id: USER_ID })

    expect(result.totals.revenue).toBe(3000)
    expect(result.totals.expense).toBe(500)
    expect(result.totals.total).toBe(2500)
  })

  it('deve filtrar por tipo (type_id)', async () => {
    await transactionsRepository.create({
      value: 1000, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })
    await transactionsRepository.create({
      value: 500, type_id: SAIDA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })

    const result = await sut.execute({
      user_id: USER_ID,
      type_id: ENTRADA_ID,
    })

    expect(result.transactions).toHaveLength(1)
    expect(result.transactions[0].value).toBe(1000)
  })

  it('deve filtrar por categoria (category_ids)', async () => {
    const otherCategoryId = uuidv7()
    transactionsRepository.categories.push({ id: otherCategoryId, name: 'Outra' })

    await transactionsRepository.create({
      value: 1000, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })
    await transactionsRepository.create({
      value: 500, type_id: ENTRADA_ID, category_id: otherCategoryId, user_id: USER_ID,
    })

    const result = await sut.execute({
      user_id: USER_ID,
      category_ids: [CATEGORY_ID],
    })

    expect(result.transactions).toHaveLength(1)
    expect(result.transactions[0].value).toBe(1000)
  })

  it('deve filtrar por data (from/to)', async () => {
    const futureDate = new Date('2030-01-01')

    await transactionsRepository.create({
      value: 1000, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })

    const result = await sut.execute({
      user_id: USER_ID,
      from: futureDate,
    })

    expect(result.transactions).toHaveLength(0)
  })

  it('deve buscar por texto (search_text)', async () => {
    await transactionsRepository.create({
      value: 150, description: 'aluguel escritório', type_id: SAIDA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })
    await transactionsRepository.create({
      value: 50, description: 'supermercado', type_id: SAIDA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })

    const result = await sut.execute({
      user_id: USER_ID,
      search_text: 'aluguel',
    })

    expect(result.transactions).toHaveLength(1)
    expect(result.transactions[0].value).toBe(150)
  })

  it('deve ordenar ASC', async () => {
    const tx1 = await transactionsRepository.create({
      value: 100, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })
    const tx2 = await transactionsRepository.create({
      value: 200, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })

    const result = await sut.execute({
      user_id: USER_ID,
      sort_id: 'ASC',
    })

    expect(result.transactions[0].id).toBe(tx1.id)
    expect(result.transactions[1].id).toBe(tx2.id)
  })

  it('deve ordenar DESC', async () => {
    const tx1 = await transactionsRepository.create({
      value: 100, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })
    const tx2 = await transactionsRepository.create({
      value: 200, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: USER_ID,
    })

    const result = await sut.execute({
      user_id: USER_ID,
      sort_id: 'DESC',
    })

    expect(result.transactions[0].id).toBe(tx2.id)
    expect(result.transactions[1].id).toBe(tx1.id)
  })

  it('não deve retornar transações de outro usuário', async () => {
    await transactionsRepository.create({
      value: 1000, type_id: ENTRADA_ID, category_id: CATEGORY_ID, user_id: 'other-user',
    })

    const result = await sut.execute({ user_id: USER_ID })

    expect(result.transactions).toHaveLength(0)
  })
})
