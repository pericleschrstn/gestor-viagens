import type { DomainError, DomainErrorCode } from "./result"

type StatusError = { status: number; message?: string }

// Duck-typing do erro de transporte (ApiError) sem importar a classe de infra —
// mantém o domínio livre de dependência da camada infra.
function getStatus(error: unknown): number | null {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof (error as StatusError).status === "number"
  ) {
    return (error as StatusError).status
  }
  return null
}

export function mapApiErrorToDomain(error: unknown): DomainError {
  const status = getStatus(error)

  if (status !== null) {
    const code: DomainErrorCode =
      status === 401
        ? "UNAUTHORIZED"
        : status === 403
          ? "FORBIDDEN"
          : status === 404
            ? "NOT_FOUND"
            : status === 409
              ? "CONFLICT"
              : status >= 500
                ? "UNAVAILABLE"
                : "VALIDATION"

    const message = error instanceof Error ? error.message : "Erro inesperado."
    return { code, message }
  }

  if (error instanceof Error) {
    return { code: "UNKNOWN", message: error.message }
  }

  return { code: "UNKNOWN", message: "Erro inesperado." }
}

export function isUnauthorized(error: unknown): boolean {
  return getStatus(error) === 401
}

export function isNotFound(error: unknown): boolean {
  return getStatus(error) === 404
}
