import pkg from '@prisma/client'
import 'dotenv/config'

const { PrismaClient } = pkg

const ENTRADA_ID = '019e4f29-c8c0-711a-8d69-990290979a99'
const SAIDA_ID = '019e4f29-c8c3-746f-917e-2c4058ca9953'

const CATEGORIAS = [
  { id: '019e4f29-c8c3-746f-917e-2c41f5157aff', name: 'Casa' },
  { id: '019e4f29-c8c3-746f-917e-2c4212c4944b', name: 'Academia' },
  { id: '019e4f29-c8c3-746f-917e-2c43881365dc', name: 'Saúde' },
  { id: '019e4f29-c8c3-746f-917e-2c449defc45b', name: 'Aluguel' },
  { id: '019e4f29-c8c3-746f-917e-2c4525b24561', name: 'Trabalho' },
  { id: '019e4f29-c8c3-746f-917e-2c467fdfd1ee', name: 'Freelance' },
  { id: '019e4f29-c8c3-746f-917e-2c47aea4882f', name: 'Emergência' },
  { id: '019e4f29-c8c3-746f-917e-2c48bf2e4163', name: 'Reforma' },
]

async function seed() {
  const prisma = new PrismaClient()

  console.log('🌱 Seeding...')

  for (const type of [
    { id: ENTRADA_ID, name: 'Entrada' },
    { id: SAIDA_ID, name: 'Saída' },
  ]) {
    await prisma.transactionType.upsert({
      where: { id: type.id },
      update: { name: type.name },
      create: type,
    })
  }

  for (const category of CATEGORIAS) {
    await prisma.transactionCategory.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: category,
    })
  }

  console.log('✅ Seed completed!')
  await prisma.$disconnect()
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
