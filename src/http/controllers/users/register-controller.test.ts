import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app.js'

describe('Register Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível se cadastrar', async () => {
    const response = await request(app.server).post('/auth/register').send({
      name: 'Isaque',
      email: 'isaque@teste.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(201)
  })
})
