export interface CreateTransactionDTO {
  id?: string
  value: number
  description?: string
  type_id: string
  category_id: string
  user_id: string
}
