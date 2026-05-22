import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthenticateBodySchema } from '@/http/schemas/auth-schema.js'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case.js'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error.js'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = AuthenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {
        email: user.email,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '365d',
          algorithm: 'HS256',
        },
      },
    )

    return reply.status(200).send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
