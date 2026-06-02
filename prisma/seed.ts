import { uuidv7 } from 'uuidv7'
import { prisma } from '../src/lib/prisma'

const ENTRADA_ID = '234c0d06-2983-4fcc-a942-1fa3684ebc55'
const SAIDA_ID = '43f8ea6f-43bc-4cfc-be37-0ff2a802f195'

const TYPES = [
  { id: ENTRADA_ID, name: 'Entrada' },
  { id: SAIDA_ID, name: 'Saída' },
]

const CATEGORIAS = [
  { id: uuidv7(), name: 'Casa' },
  { id: uuidv7(), name: 'Academia' },
  { id: uuidv7(), name: 'Saúde' },
  { id: uuidv7(), name: 'Aluguel' },
  { id: uuidv7(), name: 'Trabalho' },
  { id: uuidv7(), name: 'Freelance' },
  { id: uuidv7(), name: 'Emergência' },
  { id: uuidv7(), name: 'Reforma' },
]

async function seed() {
  console.log('🌱 Seeding...')

  await prisma.$transaction(async (tx) => {
    for (const type of TYPES) {
      await tx.transactionType.upsert({
        where: { id: type.id },
        update: { name: type.name },
        create: type,
      })
    }

    for (const category of CATEGORIAS) {
      await tx.transactionCategory.upsert({
        where: { id: category.id },
        update: { name: category.name },
        create: category,
      })
    }
  })

  console.log('✅ Seed completed!')
  await prisma.$disconnect()
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
