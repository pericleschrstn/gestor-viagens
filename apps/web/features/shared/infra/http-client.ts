import { API_URL } from "@/features/shared/infra/config"
import { ApiError } from "@/features/shared/infra/api-error"
import { getAccessToken } from "@/features/shared/infra/token"

type ServerFetchInit = RequestInit & {
  token?: string
  skipAuth?: boolean
}

export async function serverFetch<T>(
  path: string,
  init?: ServerFetchInit,
): Promise<T> {
  const { token: explicitToken, skipAuth, ...requestInit } = init ?? {}
  const token = skipAuth ? undefined : (explicitToken ?? (await getAccessToken()))

  const headers = new Headers(requestInit.headers)
  if (!headers.has("Content-Type") && requestInit.body) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...requestInit,
    headers,
    cache: "no-store",
  })

  if (!res.ok) {
    throw await ApiError.fromResponse(res)
  }

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
