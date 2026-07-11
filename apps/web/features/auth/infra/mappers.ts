import { z } from "zod"

export const apiUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
})

export const apiAuthResponseSchema = z.object({
  accessToken: z.string(),
  user: apiUserSchema,
})

export function mapAuthUser(dto: z.infer<typeof apiUserSchema>) {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    createdAt: dto.createdAt,
  }
}

export function mapAuthSession(dto: z.infer<typeof apiAuthResponseSchema>) {
  return {
    accessToken: dto.accessToken,
    user: mapAuthUser(dto.user),
  }
}
