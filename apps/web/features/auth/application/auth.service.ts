import { cache } from "react"

import type { Credentials, RegisterInput } from "@/features/auth/domain/models"
import type { AuthRepository } from "@/features/auth/domain/repository.interface"
import { authRepository } from "@/features/auth/infra/auth.repository"
import {
  clearAccessToken,
  setAccessToken,
} from "@/features/auth/infra/session"
import { getAccessToken } from "@/features/shared/infra/token"

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  // React `cache` deduplica a sessão por requisição (vários layouts/pages chamam).
  getSession = cache(async () => {
    const token = await getAccessToken()
    if (!token) return null

    try {
      return await this.repository.me(token)
    } catch {
      return null
    }
  })

  async login(credentials: Credentials) {
    const session = await this.repository.login(credentials)
    await setAccessToken(session.accessToken)
  }

  async register(input: RegisterInput) {
    const session = await this.repository.register(input)
    await setAccessToken(session.accessToken)
  }

  async logout() {
    await clearAccessToken()
  }
}

export const authService = new AuthService()
