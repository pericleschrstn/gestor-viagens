import { serverFetch } from "@/features/shared/infra/http-client"

import type { Credentials, RegisterInput } from "@/features/auth/domain/models"
import type { AuthRepository } from "@/features/auth/domain/repository.interface"
import {
  apiAuthResponseSchema,
  apiUserSchema,
  mapAuthSession,
  mapAuthUser,
} from "@/features/auth/infra/mappers"

export class HttpAuthRepository implements AuthRepository {
  async me(token: string) {
    const raw = await serverFetch<unknown>("/auth/me", { token })
    return mapAuthUser(apiUserSchema.parse(raw))
  }

  async login(credentials: Credentials) {
    const raw = await serverFetch<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    })
    return mapAuthSession(apiAuthResponseSchema.parse(raw))
  }

  async register(input: RegisterInput) {
    const raw = await serverFetch<unknown>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
      skipAuth: true,
    })
    return mapAuthSession(apiAuthResponseSchema.parse(raw))
  }
}

export const authRepository = new HttpAuthRepository()
