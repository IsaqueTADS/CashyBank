import z from 'zod'

export const TransactionSchema = z.object({
  id: z.string(),
  value: z.number(),
  description: z.string().nullable(),
  type_id: z.string(),
  category_id: z.string(),
  user_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date().nullable(),
  type: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
})

export const CreateTransactionBodySchema = z.object({
  typeId: z.string().uuid('ID do tipo inválido'),
  categoryId: z.string().uuid('ID da categoria inválido'),
  value: z.number().min(1, 'Valor deve ser maior que zero'),
  description: z.string().optional(),
})

export const UpdateTransactionBodySchema = z.object({
  id: z.string().uuid(),
  typeId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  value: z.number().min(1).optional(),
  description: z.string().optional(),
})

export const GetTransactionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  typeId: z.string().uuid().optional(),
  categoryIds: z.string().optional(),
  searchText: z.string().optional(),
  sortId: z.enum(['ASC', 'DESC']).optional(),
})

export const TransactionParamsSchema = z.object({
  id: z.string().uuid(),
})

export const TransactionResponseSchema = z.object({
  transaction: TransactionSchema,
})

export const TransactionsResponseSchema = z.object({
  transactions: z.array(TransactionSchema),
  totals: z.object({
    revenue: z.number(),
    expense: z.number(),
    total: z.number(),
  }),
  total_rows: z.number(),
  total_pages: z.number(),
  page: z.number(),
  per_page: z.number(),
})

export const TransactionDataResponseSchema = z.object({
  types: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
})
