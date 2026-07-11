export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type Credentials = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  password: string
}

export type AuthSession = {
  accessToken: string
  user: AuthUser
}
