import { uuidv7 } from 'uuidv7'
import type { CreateTransactionDTO } from '@/dtos/transaction/create-transaction.dto.js'
import type { Transaction } from '@/dtos/transaction/transaction.js'
import type { UpdateTransactionDTO } from '@/dtos/transaction/update-transaction.dto.js'
import { prisma } from '@/lib/prisma.js'
import type {
  GetTransactionsParams,
  TransactionTotals,
  TransactionsRepository,
} from '../transactions-repository.js'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async findById(id: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, deleted_at: null },
      include: { type: true, category: true },
    })
    return transaction
  }

  async create(data: CreateTransactionDTO) {
    const transaction = await prisma.transaction.create({
      data: {
        id: uuidv7(),
        ...data,
      },
      include: { type: true, category: true },
    })
    return transaction
  }

  async update(data: UpdateTransactionDTO) {
    const { id, ...updateData } = data
    await prisma.transaction.update({
      where: { id },
      data: updateData,
    })
  }

  async delete(id: string) {
    await prisma.transaction.update({
      where: { id },
      data: { deleted_at: new Date() },
    })
  }

  async getMany(params: GetTransactionsParams) {
    const where: any = {
      user_id: params.user_id,
      deleted_at: null,
    }

    if (params.filters?.from) {
      where.created_at = { ...where.created_at, gte: params.filters.from }
    }
    if (params.filters?.to) {
      where.created_at = { ...where.created_at, lte: params.filters.to }
    }
    if (params.filters?.type_id) {
      where.type_id = params.filters.type_id
    }
    if (params.filters?.category_ids?.length) {
      where.category_id = { in: params.filters.category_ids }
    }
    if (params.filters?.search_text) {
      where.OR = [
        { value: { contains: params.filters.search_text } },
        { description: { contains: params.filters.search_text } },
      ]
    }

    const page = params.pagination?.page ?? 1
    const per_page = params.pagination?.per_page ?? 10
    const skip = (page - 1) * per_page

    const [transactions, total_rows] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { type: true, category: true },
        orderBy: { id: (params.sort?.id?.toLowerCase() ?? 'desc') as 'asc' | 'desc' },
        skip,
        take: per_page,
      }),
      prisma.transaction.count({ where }),
    ])

    return {
      transactions,
      total_rows,
      total_pages: Math.ceil(total_rows / per_page),
      page,
      per_page,
    }
  }

  async getTotals(params: GetTransactionsParams): Promise<TransactionTotals> {
    const where: any = {
      user_id: params.user_id,
      deleted_at: null,
    }

    if (params.filters?.from) {
      where.created_at = { ...where.created_at, gte: params.filters.from }
    }
    if (params.filters?.to) {
      where.created_at = { ...where.created_at, lte: params.filters.to }
    }
    if (params.filters?.type_id) {
      where.type_id = params.filters.type_id
    }
    if (params.filters?.category_ids?.length) {
      where.category_id = { in: params.filters.category_ids }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: { value: true, type_id: true },
    })

    const types = await prisma.transactionType.findMany()
    const entradaType = types.find((t) => t.name === 'Entrada')
    const saidaType = types.find((t) => t.name === 'Saída')

    const revenue = transactions
      .filter((t) => t.type_id === entradaType?.id)
      .reduce((acc, t) => acc + t.value, 0)

    const expense = transactions
      .filter((t) => t.type_id === saidaType?.id)
      .reduce((acc, t) => acc + t.value, 0)

    return { revenue, expense, total: revenue - expense }
  }
}
