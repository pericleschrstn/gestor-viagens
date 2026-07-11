import assert from "node:assert/strict"
import test from "node:test"

import { mapBalance, mapSettlement } from "../infra/mappers"

test("mapBalance converts string amounts to numbers", () => {
  const domain = mapBalance({
    memberId: "550e8400-e29b-41d4-a716-446655440000",
    memberName: "Ana",
    initials: "AN",
    paid: "500.00",
    owed: "300.50",
    balance: "199.50",
  })

  assert.equal(domain.paid, 500)
  assert.equal(domain.owed, 300.5)
  assert.equal(domain.balance, 199.5)
})

test("mapSettlement converts amount to number", () => {
  const domain = mapSettlement({
    fromMemberId: "550e8400-e29b-41d4-a716-446655440000",
    fromMemberName: "Ana",
    toMemberId: "550e8400-e29b-41d4-a716-446655440001",
    toMemberName: "Bruno",
    amount: "75.25",
  })

  assert.equal(domain.amount, 75.25)
})
