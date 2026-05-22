import { verify } from 'argon2'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'
import { RegisterUseCase } from './register-use-case.js'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('deve criptografar a senha do usuário', async () => {
    const password = '1234567'

    const { user } = await sut.execute({
      name: 'Testador',
      email: 'teste@gmail.com',
      password,
    })

    const isPasswordHashValid = await verify(user.password_hash, password)

    expect(isPasswordHashValid).toBe(true)
  })

  it('não deve cadastrar com email duplicado', async () => {
    const email = 'teste@gmail.com'

    await sut.execute({
      name: 'Testador',
      email,
      password: '1234567',
    })

    await expect(() =>
      sut.execute({
        name: 'Testador',
        email,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('deve ser possível se cadastrar', async () => {
    const { user } = await sut.execute({
      name: 'Testador',
      email: 'teste@gmail.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
