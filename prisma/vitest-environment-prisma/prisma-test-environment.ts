import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/runtime'
import { prisma } from '@/lib/prisma.js'

async function truncateTables() {
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE users CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE transactions CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE transaction_types CASCADE')
    await prisma.$executeRawUnsafe('TRUNCATE TABLE transaction_categories CASCADE')
  } catch {
    // Tables may not exist yet
  }
}

export default <Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',

  async setup() {
    try {
      await truncateTables()
    } catch {
      execSync('dotenv -e .env.test pnpm run db:migrate:deploy', {
        stdio: 'inherit',
        env: { ...process.env },
      })
    }

    return {
      async teardown() {
        await truncateTables()
      },
    }
  },
}
