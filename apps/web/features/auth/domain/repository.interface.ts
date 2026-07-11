import type {
  AuthSession,
  AuthUser,
  Credentials,
  RegisterInput,
} from "@/features/auth/domain/models"

export interface AuthRepository {
  me(token: string): Promise<AuthUser>
  login(credentials: Credentials): Promise<AuthSession>
  register(input: RegisterInput): Promise<AuthSession>
}
