export interface TransactionType {
  id: string
  name: string
}

export interface TransactionCategory {
  id: string
  name: string
}

export interface Transaction {
  id: string
  value: number
  description: string | null
  type_id: string
  category_id: string
  user_id: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  type?: TransactionType
  category?: TransactionCategory
}
