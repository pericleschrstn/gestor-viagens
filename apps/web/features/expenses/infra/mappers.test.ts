import assert from "node:assert/strict"
import test from "node:test"

import { mapExpense, mapPaginatedExpenses } from "../infra/mappers"

test("mapExpense converts API DTO to domain model", () => {
  const domain = mapExpense({
    id: "550e8400-e29b-41d4-a716-446655440000",
    tripId: "550e8400-e29b-41d4-a716-446655440001",
    description: "Jantar",
    amount: "120.50",
    currency: "BRL",
    date: "2026-06-01",
    category: "comida",
    payerId: "550e8400-e29b-41d4-a716-446655440002",
    receiptUrl: null,
    createdAt: "2026-06-01T12:00:00.000Z",
    payer: { id: "550e8400-e29b-41d4-a716-446655440002", name: "Ana", initials: "AN" },
    splits: [
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        expenseId: "550e8400-e29b-41d4-a716-446655440000",
        memberId: "550e8400-e29b-41d4-a716-446655440002",
        share: "60.25",
        member: { id: "550e8400-e29b-41d4-a716-446655440002", name: "Ana", initials: "AN" },
      },
    ],
  })

  assert.equal(domain.amount, 120.5)
  assert.equal(domain.payer.name, "Ana")
  assert.equal(domain.splits[0]?.share, 60.25)
})

test("mapPaginatedExpenses maps pagination meta", () => {
  const page = mapPaginatedExpenses({
    data: [],
    meta: { total: 0, page: 1, limit: 20, pageCount: 0 },
  })

  assert.equal(page.total, 0)
  assert.deepEqual(page.items, [])
})
