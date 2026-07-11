import assert from "node:assert/strict"
import test from "node:test"

import { TripMemberRole } from "../enums/trip-member-role.enum"
import { TripPermission } from "../enums/trip-permission.enum"
import {
  permissionsForRole,
  roleHasPermission,
} from "./role-permissions"

test("OWNER has all permissions", () => {
  const perms = permissionsForRole(TripMemberRole.OWNER)
  assert.ok(roleHasPermission(TripMemberRole.OWNER, TripPermission.DELETE_TRIP))
  assert.ok(perms.includes(TripPermission.MANAGE_SETTLEMENTS))
})

test("EDITOR can write but not manage members", () => {
  assert.ok(roleHasPermission(TripMemberRole.EDITOR, TripPermission.WRITE))
  assert.ok(!roleHasPermission(TripMemberRole.EDITOR, TripPermission.MANAGE_MEMBERS))
})

test("VIEWER is read-only", () => {
  assert.ok(roleHasPermission(TripMemberRole.VIEWER, TripPermission.READ))
  assert.ok(!roleHasPermission(TripMemberRole.VIEWER, TripPermission.WRITE))
})
