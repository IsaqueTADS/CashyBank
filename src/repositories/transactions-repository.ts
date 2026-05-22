import type { CreateTransactionDTO } from '@/dtos/transaction/create-transaction.dto.js'
import type { Transaction } from '@/dtos/transaction/transaction.js'
import type { UpdateTransactionDTO } from '@/dtos/transaction/update-transaction.dto.js'

export interface GetTransactionsFilters {
  from?: Date
  to?: Date
  type_id?: string
  category_ids?: string[]
  search_text?: string
}

export interface GetTransactionsParams {
  user_id: string
  pagination?: {
    page: number
    per_page: number
  }
  filters?: GetTransactionsFilters
  sort?: {
    id?: 'ASC' | 'DESC'
  }
}

export interface TransactionTotals {
  revenue: number
  expense: number
  total: number
}

export interface TransactionsRepository {
  findById(id: string): Promise<Transaction | null>
  create(data: CreateTransactionDTO): Promise<Transaction>
  update(data: UpdateTransactionDTO): Promise<void>
  delete(id: string): Promise<void>
  getMany(params: GetTransactionsParams): Promise<{
    transactions: Transaction[]
    total_rows: number
    total_pages: number
    page: number
    per_page: number
  }>
  getTotals(params: GetTransactionsParams): Promise<TransactionTotals>
}
