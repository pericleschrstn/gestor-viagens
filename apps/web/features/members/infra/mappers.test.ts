import assert from "node:assert/strict"
import test from "node:test"

import { mapMember } from "../infra/mappers"

test("mapMember maps role and userId", () => {
  const domain = mapMember({
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Ana",
    initials: "AN",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    role: "EDITOR",
  })

  assert.equal(domain.name, "Ana")
  assert.equal(domain.userId, "550e8400-e29b-41d4-a716-446655440001")
  assert.equal(domain.role, "EDITOR")
})

test("mapMember allows null role for guests", () => {
  const domain = mapMember({
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Convidado",
    initials: "CV",
    userId: null,
    role: null,
  })

  assert.equal(domain.userId, null)
  assert.equal(domain.role, null)
})
