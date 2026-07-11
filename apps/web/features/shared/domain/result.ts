export type DomainErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "UNAVAILABLE"
  | "UNKNOWN"

export type DomainError = {
  code: DomainErrorCode
  message: string
}

export type Result<T, E = DomainError> =
  | { ok: true; data: T }
  | { ok: false; error: E }

export function ok<T>(data: T): Result<T> {
  return { ok: true, data }
}

export function err(message: string, code: DomainErrorCode = "UNKNOWN"): Result<never> {
  return { ok: false, error: { code, message } }
}
