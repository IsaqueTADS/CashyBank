import z from 'zod'

export const ValidationErrorSchema = z.object({
  message: z.string().describe('Falha na validação'),
  details: z.array(
    z.object({
      error: z.string(),
    }),
  ),
})
