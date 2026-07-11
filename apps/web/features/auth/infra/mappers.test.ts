import assert from "node:assert/strict"
import test from "node:test"

import { mapAuthSession, mapAuthUser } from "../infra/mappers"

test("mapAuthUser maps API user DTO to domain", () => {
  const domain = mapAuthUser({
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Ana Ribeiro",
    email: "ana@email.com",
    createdAt: "2026-01-01T12:00:00.000Z",
  })

  assert.deepEqual(domain, {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Ana Ribeiro",
    email: "ana@email.com",
    createdAt: "2026-01-01T12:00:00.000Z",
  })
})

test("mapAuthSession maps token and nested user", () => {
  const session = mapAuthSession({
    accessToken: "jwt-token",
    user: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Ana",
      email: "ana@email.com",
      createdAt: "2026-01-01T12:00:00.000Z",
    },
  })

  assert.equal(session.accessToken, "jwt-token")
  assert.equal(session.user.name, "Ana")
})
