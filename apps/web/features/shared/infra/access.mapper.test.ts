import assert from "node:assert/strict"
import test from "node:test"

import { mapTripAccess } from "../infra/access.mapper"

test("mapTripAccess derives OWNER capabilities", () => {
  const caps = mapTripAccess({
    role: "OWNER",
    permissions: [
      "READ",
      "WRITE",
      "MANAGE_MEMBERS",
      "MANAGE_BUDGET",
      "DELETE_TRIP",
      "MANAGE_SETTLEMENTS",
    ],
  })

  assert.equal(caps.role, "OWNER")
  assert.equal(caps.canRead, true)
  assert.equal(caps.canWrite, true)
  assert.equal(caps.canManageMembers, true)
  assert.equal(caps.canManageBudget, true)
  assert.equal(caps.canDeleteTrip, true)
  assert.equal(caps.canManageSettlements, true)
})

test("mapTripAccess derives EDITOR capabilities", () => {
  const caps = mapTripAccess({
    role: "EDITOR",
    permissions: ["READ", "WRITE", "MANAGE_BUDGET"],
  })

  assert.equal(caps.canWrite, true)
  assert.equal(caps.canManageMembers, false)
  assert.equal(caps.canDeleteTrip, false)
})

test("mapTripAccess derives VIEWER capabilities", () => {
  const caps = mapTripAccess({
    role: "VIEWER",
    permissions: ["READ"],
  })

  assert.equal(caps.canRead, true)
  assert.equal(caps.canWrite, false)
  assert.equal(caps.canManageBudget, false)
})
