import { createWriteStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { env } from '@/env/index.js'
import { createCashyBankFileName } from '@/http/utils/create-cashybank-file-name.js'
import { prisma } from '@/lib/prisma.js'

export async function uploadAvatarUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file({
    limits: {
      files: 1,
      fields: 0,
      fileSize: 10 * 1040 * 1024, //10mb
    },
  })
  const userId = request.user.sub

  if (!data)
    return reply.status(400).send({ message: 'Nenhum arquivo econtrado data' })
  if (!data.file)
    return reply.status(400).send({ message: 'Nenhum arquivo econtrado' })

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']

  if (!allowedMimeTypes.includes(data.mimetype)) {
    return reply.status(400).send({ message: 'Mimitype invalido' })
  }

  const uploadDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'profiles',
  )
  await fs.mkdir(uploadDir, { recursive: true })

  const extension = path.extname(data.filename)

  const newFileName = createCashyBankFileName(userId)

  const finalFileName = `${newFileName}${extension}`

  const fullPath = path.join(uploadDir, finalFileName)

  await pipeline(data.file, createWriteStream(fullPath))

  const imageUrl = `${env.API_URL}/uploads/profiles/${finalFileName}`

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image_url: imageUrl,
    },
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
