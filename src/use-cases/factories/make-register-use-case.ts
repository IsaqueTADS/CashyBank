import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { RegisterUseCase } from '../register-use-case.js'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  return new RegisterUseCase(usersRepository)
}
