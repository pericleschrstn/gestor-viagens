"use server"

import { redirect } from "next/navigation"

import { authService } from "@/features/auth/application/auth.service"
import type { Credentials, RegisterInput } from "@/features/auth/domain/models"
import { mapApiErrorToDomain } from "@/features/shared/domain/errors"
import type { Result } from "@/features/shared/domain/result"
import { ok } from "@/features/shared/domain/result"

export async function loginAction(input: Credentials): Promise<Result<void>> {
  try {
    await authService.login(input)
    return ok(undefined)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function registerAction(
  input: RegisterInput,
): Promise<Result<void>> {
  try {
    await authService.register(input)
    return ok(undefined)
  } catch (error) {
    return { ok: false, error: mapApiErrorToDomain(error) }
  }
}

export async function logoutAction(): Promise<void> {
  await authService.logout()
  redirect("/login")
}
