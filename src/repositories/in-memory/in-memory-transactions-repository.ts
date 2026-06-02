import { uuidv7 } from 'uuidv7'
import type { CreateTransactionDTO } from '@/dtos/transaction/create-transaction.dto.js'
import type { Transaction, TransactionCategory, TransactionType } from '@/dtos/transaction/transaction.js'
import type { UpdateTransactionDTO } from '@/dtos/transaction/update-transaction.dto.js'
import type {
  GetTransactionsParams,
  TransactionTotals,
  TransactionsRepository,
} from '../transactions-repository.js'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []
  public types: TransactionType[] = []
  public categories: TransactionCategory[] = []

  async findById(id: string) {
    const transaction = this.items.find(
      (item) => item.id === id && !item.deleted_at,
    )
    if (!transaction) return null
    return this.enrich(transaction)
  }

  async create(data: CreateTransactionDTO) {
    const transaction: Transaction = {
      id: uuidv7(),
      value: data.value,
      description: data.description ?? null,
      type_id: data.type_id,
      category_id: data.category_id,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    this.items.push(transaction)

    return this.enrich(transaction)
  }

  async update(data: UpdateTransactionDTO) {
    const index = this.items.findIndex((item) => item.id === data.id)
    if (index === -1) return

    this.items[index] = {
      ...this.items[index],
      ...data,
      updated_at: new Date(),
    }
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) return

    this.items[index].deleted_at = new Date()
  }

  async getMany(params: GetTransactionsParams) {
    let filtered = this.items.filter((item) => item.user_id === params.user_id && !item.deleted_at)

    if (params.filters?.from) {
      filtered = filtered.filter((item) => item.created_at >= params.filters!.from!)
    }
    if (params.filters?.to) {
      filtered = filtered.filter((item) => item.created_at <= params.filters!.to!)
    }
    if (params.filters?.type_id) {
      filtered = filtered.filter((item) => item.type_id === params.filters!.type_id)
    }
    if (params.filters?.category_ids?.length) {
      filtered = filtered.filter((item) => params.filters!.category_ids!.includes(item.category_id))
    }
    if (params.filters?.search_text) {
      const search = params.filters.search_text.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.value.toString().includes(search) ||
          item.description?.toLowerCase().includes(search),
      )
    }

    if (params.sort?.id === 'ASC') {
      filtered.sort((a, b) => a.id.localeCompare(b.id))
    } else {
      filtered.sort((a, b) => b.id.localeCompare(a.id))
    }

    const total_rows = filtered.length
    const page = params.pagination?.page ?? 1
    const per_page = params.pagination?.per_page ?? (total_rows || 10)

    const start = (page - 1) * per_page
    const paginated = filtered.slice(start, start + per_page)

    return {
      transactions: paginated.map((item) => this.enrich(item)),
      total_rows,
      total_pages: Math.ceil(total_rows / per_page),
      page,
      per_page,
    }
  }

  async getTotals(params: GetTransactionsParams): Promise<TransactionTotals> {
    const filtered = this.items.filter(
      (item) => item.user_id === params.user_id && !item.deleted_at,
    )

    const revenue = filtered
      .filter((item) => item.type_id === this.types[0]?.id)
      .reduce((acc, item) => acc + item.value, 0)

    const expense = filtered
      .filter((item) => item.type_id === this.types[1]?.id)
      .reduce((acc, item) => acc + item.value, 0)

    return {
      revenue,
      expense,
      total: revenue - expense,
    }
  }

  private enrich(transaction: Transaction): Transaction {
    return {
      ...transaction,
      type: this.types.find((t) => t.id === transaction.type_id),
      category: this.categories.find((c) => c.id === transaction.category_id),
    }
  }
}
