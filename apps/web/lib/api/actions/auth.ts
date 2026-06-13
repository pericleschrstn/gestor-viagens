"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { ACCESS_TOKEN_COOKIE, API_URL } from "@/lib/api/config"
import { ApiError } from "@/lib/api/errors"
import type { ActionResult, AuthResponse } from "@/lib/api/types"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

async function setAccessToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function loginAction(input: {
  email: string
  password: string
}): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    })

    if (!res.ok) {
      throw await ApiError.fromResponse(res)
    }

    const data = (await res.json()) as AuthResponse
    await setAccessToken(data.accessToken)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Não foi possível entrar. Tente novamente." }
  }
}

export async function registerAction(input: {
  name: string
  email: string
  password: string
}): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    })

    if (!res.ok) {
      throw await ApiError.fromResponse(res)
    }

    const data = (await res.json()) as AuthResponse
    await setAccessToken(data.accessToken)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Não foi possível criar a conta. Tente novamente." }
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  redirect("/login")
}

export async function redirectAfterAuth(): Promise<void> {
  redirect("/")
}
