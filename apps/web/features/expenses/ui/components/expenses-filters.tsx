"use client"

import { useMemo, useState } from "react"
import { ArrowDownUp, ListFilter, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DatePicker } from "@/components/ui/date-picker"
import { FacetedFilter } from "@/components/ui/faceted-filter"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type {
  ExpenseCategory,
  ExpenseSortOrder,
} from "@/features/expenses/domain/models"
import { useExpensesApp } from "@/features/expenses/ui/expenses-provider"
import { ALL_CATEGORIES } from "@/lib/categories"
import { categoryLabel } from "@/lib/format"

const SORT_OPTIONS: { value: ExpenseSortOrder; label: string }[] = [
  { value: "newest", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "amount_desc", label: "Maior valor" },
  { value: "amount_asc", label: "Menor valor" },
]

export function ExpensesFilters() {
  const {
    state: { filters, members },
    actions: { updateFilter, setFilters },
  } = useExpensesApp()

  const [sortOpen, setSortOpen] = useState(false)

  const categoryOptions = useMemo(
    () =>
      ALL_CATEGORIES.map((category) => ({
        value: category,
        label: categoryLabel(category),
      })),
    [],
  )

  const memberOptions = useMemo(
    () =>
      members.map((member) => ({
        value: member.id,
        label: member.name,
      })),
    [members],
  )

  const activeSort =
    SORT_OPTIONS.find(
      (option) => option.value === (filters.sort ?? "newest"),
    ) ?? SORT_OPTIONS[0]!

  const periodValue =
    filters.startDate || filters.endDate
      ? { from: filters.startDate, to: filters.endDate }
      : undefined

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar gasto..."
            className="h-8 pl-9"
            value={filters.search ?? ""}
            onChange={(e) =>
              updateFilter("search", e.target.value || undefined)
            }
          />
        </div>

        <FacetedFilter
          title="Categoria"
          icon={ListFilter}
          options={categoryOptions}
          value={filters.categories ?? []}
          onChange={(categories) =>
            updateFilter(
              "categories",
              categories.length ? (categories as ExpenseCategory[]) : undefined,
            )
          }
        />

        <FacetedFilter
          title="Pessoa"
          icon={User}
          options={memberOptions}
          value={filters.memberIds ?? []}
          onChange={(memberIds) =>
            updateFilter("memberIds", memberIds.length ? memberIds : undefined)
          }
        />

        <DatePicker
          mode="range"
          appearance="filter"
          placeholder="Período"
          value={periodValue}
          onChange={(next) => {
            setFilters({
              ...filters,
              startDate: next?.from,
              endDate: next?.to,
              page: 1,
            })
          }}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Popover open={sortOpen} onOpenChange={setSortOpen}>
          <PopoverTrigger
            render={<Button variant="outline" size="sm" className="h-8" />}
          >
            <ArrowDownUp data-icon="inline-start" />
            {activeSort.label}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[180px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {SORT_OPTIONS.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      data-checked={
                        option.value === activeSort.value ? true : undefined
                      }
                      onSelect={() => {
                        updateFilter("sort", option.value)
                        setSortOpen(false)
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
