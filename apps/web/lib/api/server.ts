import { API_URL } from "@/lib/api/config"
import { ApiError } from "@/lib/api/errors"
import { getAccessToken } from "@/lib/api/token"

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

  return res.json() as Promise<T>
}
