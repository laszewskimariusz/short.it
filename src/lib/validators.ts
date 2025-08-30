import { z } from 'zod'

export const urlSchema = z.object({
  originalUrl: z.string().url().refine((u) => u.startsWith('http://') || u.startsWith('https://'), {
    message: 'URL must start with http:// or https://'
  }),
  alias: z
    .string()
    .regex(/^[a-zA-Z0-9-_]{3,30}$/)
    .optional()
    .or(z.literal('')),
  title: z.string().max(200).optional(),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .refine((val) => !val || new Date(val) > new Date(), {
      message: 'Expiration must be in the future'
    })
})

export const linksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10)
})

export const linkUpdateSchema = z.object({
  alias: z.string().regex(/^[a-zA-Z0-9-_]{3,30}$/).optional(),
  title: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .refine((val) => val === undefined || val === null || new Date(val) > new Date(), {
      message: 'Expiration must be in the future'
    })
})

export type ShortenInput = z.infer<typeof urlSchema>
export type LinksQuery = z.infer<typeof linksQuerySchema>
export type LinkUpdateInput = z.infer<typeof linkUpdateSchema>

