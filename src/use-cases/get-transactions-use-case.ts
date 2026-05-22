import type { Transaction } from '@/dtos/transaction/transaction.js'
import type { TransactionTotals } from '@/repositories/transactions-repository.js'
import type { TransactionsRepository } from '@/repositories/transactions-repository.js'

interface GetTransactionsUseCaseRequest {
  user_id: string
  page?: number
  per_page?: number
  from?: Date
  to?: Date
  type_id?: string
  category_ids?: string[]
  search_text?: string
  sort_id?: 'ASC' | 'DESC'
}

interface GetTransactionsUseCaseResponse {
  transactions: Transaction[]
  totals: TransactionTotals
  total_rows: number
  total_pages: number
  page: number
  per_page: number
}

export class GetTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    user_id,
    page,
    per_page,
    from,
    to,
    type_id,
    category_ids,
    search_text,
    sort_id,
  }: GetTransactionsUseCaseRequest): Promise<GetTransactionsUseCaseResponse> {
    const params = {
      user_id,
      pagination: page && per_page ? { page, per_page } : undefined,
      filters: {
        from,
        to,
        type_id,
        category_ids,
        search_text,
      },
      sort: sort_id ? { id: sort_id } : undefined,
    }

    const [result, totals] = await Promise.all([
      this.transactionsRepository.getMany(params),
      this.transactionsRepository.getTotals(params),
    ])

    return {
      transactions: result.transactions,
      totals,
      total_rows: result.total_rows,
      total_pages: result.total_pages,
      page: result.page,
      per_page: result.per_page,
    }
  }
}
