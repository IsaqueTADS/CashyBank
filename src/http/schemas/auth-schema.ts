import z from 'zod'

export const RegisterBodySchema = z.object({
  name: z.string().min(3, 'Nome precisa ter pelo menos 3 caracteres'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
})

export const AuthenticateBodySchema = z.object({
  email: z.email('Email inválido'),
  password: z.string(),
})

export const User = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    imageUrl: z.string().optional().nullable(),
    created_at: z.date(),
  }),
})

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: User.shape.user,
})

export const UploadAvatarUserResponseSchema = z.object({
  user: User.shape.user,
})
