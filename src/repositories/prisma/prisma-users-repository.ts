import { uuidv7 } from 'uuidv7'
import type { CreateUserDTO } from '@/dtos/user/create-user.dto.js'
import type { User } from '@/dtos/user/user.js'
import { prisma } from '@/lib/prisma.js'
import type { UsersRepository } from '../users-repository.js'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  }

  async create(data: CreateUserDTO) {
    const user = await prisma.user.create({
      data: {
        id: uuidv7(),
        ...data,
      },
    })
    return user
  }
}
