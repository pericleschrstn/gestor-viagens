import assert from "node:assert/strict"
import test from "node:test"

import { mapBudgetSummary } from "../infra/mappers"

test("mapBudgetSummary converts numeric strings", () => {
  const domain = mapBudgetSummary({
    currency: "BRL",
    totalSpent: "1500.50",
    totalBudget: "10000",
    remaining: "8499.50",
    tripDays: 12,
    elapsedDays: 5,
    byCategory: [
      {
        category: "comida",
        spent: "800",
        limit: "1000",
        percentage: "80",
      },
    ],
  })

  assert.equal(domain.totalSpent, 1500.5)
  assert.equal(domain.totalBudget, 10000)
  assert.equal(domain.remaining, 8499.5)
  assert.equal(domain.categories[0]?.spent, 800)
  assert.equal(domain.categories[0]?.limit, 1000)
})
