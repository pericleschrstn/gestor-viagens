import assert from "node:assert/strict"
import test from "node:test"

import { mapTrip, mapTripMember, mapTripSummary } from "../infra/mappers"

test("mapTrip converts totalBudget string to number", () => {
  const domain = mapTrip({
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Itália em família",
    initials: "IT",
    startDate: "2026-06-10",
    endDate: "2026-06-22",
    status: "active",
    baseCurrency: "BRL",
    totalBudget: "10000.00",
    ownerId: "550e8400-e29b-41d4-a716-446655440001",
    createdAt: "2026-01-01T12:00:00.000Z",
  })

  assert.equal(domain.totalBudget, 10000)
  assert.equal(domain.status, "active")
})

test("mapTrip keeps null totalBudget", () => {
  const domain = mapTrip({
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Tóquio",
    initials: "TK",
    startDate: "2026-09-01",
    endDate: "2026-09-10",
    status: "planning",
    baseCurrency: "ARS",
    totalBudget: null,
    ownerId: "550e8400-e29b-41d4-a716-446655440001",
    createdAt: "2026-01-01T12:00:00.000Z",
  })

  assert.equal(domain.totalBudget, null)
})

test("mapTripMember trims to id/name/initials", () => {
  const domain = mapTripMember({
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Ana",
    initials: "AN",
  })

  assert.deepEqual(domain, {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Ana",
    initials: "AN",
  })
})

test("mapTripSummary normalizes recent amount to string and preserves byDay", () => {
  const domain = mapTripSummary({
    currency: "BRL",
    totalSpent: 1500,
    totalBudget: 10000,
    remaining: 8500,
    dailyAverage: 300,
    perPerson: 375,
    tripDays: 12,
    elapsedDays: 5,
    byCategory: [
      { category: "comida", spent: 800, limit: 1000, percentage: 80 },
    ],
    byDay: { "2026-06-10": 500 },
    recent: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        description: "Jantar",
        amount: 120.5,
        currency: "BRL",
        date: "2026-06-10",
        category: "comida",
        payerId: "550e8400-e29b-41d4-a716-446655440002",
        payer: {
          id: "550e8400-e29b-41d4-a716-446655440002",
          name: "Ana",
          initials: "AN",
        },
      },
    ],
  })

  assert.equal(domain.recent[0]?.amount, "120.5")
  assert.equal(domain.recent[0]?.payer?.name, "Ana")
  assert.equal(domain.byDay["2026-06-10"], 500)
  assert.equal(domain.byCategory[0]?.category, "comida")
})
