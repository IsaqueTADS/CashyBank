import { randomUUID } from 'node:crypto'


export type CashyBankFileName = `gympass-${string}--${string}-${string}`

export function createCashyBankFileName(id: string): CashyBankFileName {
  const currentDate = new Date()
  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()

  const formatDate = `${day}-${month}-${year}`

  const name = `cashybank-${id}--${randomUUID()}-${formatDate}`

  console.log(name)
  return name as CashyBankFileName
}