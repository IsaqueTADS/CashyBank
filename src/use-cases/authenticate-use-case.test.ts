import { hash } from 'argon2'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate-use-case.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('deve autenticar com credenciais válidas', async () => {
    const password_hash = await hash('1234567')

    await usersRepository.create({
      name: 'Testador',
      email: 'teste@gmail.com',
      password_hash,
    })

    const { user } = await sut.execute({
      email: 'teste@gmail.com',
      password: '1234567',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('não deve autenticar com email inválido', async () => {
    await expect(() =>
      sut.execute({
        email: 'inexistente@gmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('não deve autenticar com senha inválida', async () => {
    const password_hash = await hash('1234567')

    await usersRepository.create({
      name: 'Testador',
      email: 'teste@gmail.com',
      password_hash,
    })

    await expect(() =>
      sut.execute({
        email: 'teste@gmail.com',
        password: 'senha-errada',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
