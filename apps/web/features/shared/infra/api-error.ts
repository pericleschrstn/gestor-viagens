export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }

  static async fromResponse(res: Response): Promise<ApiError> {
    let message = res.statusText
    try {
      const body = (await res.json()) as { message?: string | string[] }
      if (typeof body.message === "string") {
        message = body.message
      } else if (Array.isArray(body.message)) {
        message = body.message.join(", ")
      }
    } catch {
      // keep statusText
    }
    return new ApiError(message, res.status)
  }
}
