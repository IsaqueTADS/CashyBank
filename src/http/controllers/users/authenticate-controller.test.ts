import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Authenticate Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve autenticar com credenciais válidas', async () => {
    await request(app.server).post('/auth/register').send({
      name: 'Isaque',
      email: 'isaque@teste.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/auth/login').send({
      email: 'isaque@teste.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
  })
})
