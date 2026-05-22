import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/auth/register').send({
    name: 'Isaque',
    email: 'isaque@gmail.com',
    password: '12345678',
  })

  const { body } = await request(app.server).post('/auth/login').send({
    email: 'isaque@gmail.com',
    password: '12345678',
  })

  return {
    token: body.token,
  }
}
