import assert from "node:assert/strict"
import test from "node:test"

import { buildCapabilities } from "../domain/capabilities"

const OWNER_PERMISSIONS = [
  "READ",
  "WRITE",
  "MANAGE_MEMBERS",
  "MANAGE_BUDGET",
  "DELETE_TRIP",
  "MANAGE_SETTLEMENTS",
] as const

const EDITOR_PERMISSIONS = ["READ", "WRITE", "MANAGE_BUDGET"] as const

const VIEWER_PERMISSIONS = ["READ"] as const

test("OWNER has all capabilities", () => {
  const caps = buildCapabilities("OWNER", [...OWNER_PERMISSIONS])

  assert.equal(caps.canRead, true)
  assert.equal(caps.canWrite, true)
  assert.equal(caps.canManageMembers, true)
  assert.equal(caps.canManageBudget, true)
  assert.equal(caps.canDeleteTrip, true)
  assert.equal(caps.canManageSettlements, true)
})

test("EDITOR can write but not manage members", () => {
  const caps = buildCapabilities("EDITOR", [...EDITOR_PERMISSIONS])

  assert.equal(caps.canWrite, true)
  assert.equal(caps.canManageBudget, true)
  assert.equal(caps.canManageMembers, false)
  assert.equal(caps.canDeleteTrip, false)
})

test("VIEWER is read-only", () => {
  const caps = buildCapabilities("VIEWER", [...VIEWER_PERMISSIONS])

  assert.equal(caps.canRead, true)
  assert.equal(caps.canWrite, false)
  assert.equal(caps.canManageBudget, false)
})
