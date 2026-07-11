"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ArrowDownUp,
  Calendar as CalendarIcon,
  ListFilter,
  Search,
  User,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { FacetedFilter } from "@/components/ui/faceted-filter"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import type {
  ExpenseCategory,
  ExpenseSortOrder,
} from "@/features/expenses/domain/models"
import { useExpensesApp } from "@/features/expenses/ui/expenses-provider"
import { ALL_CATEGORIES } from "@/lib/categories"
import { categoryLabel } from "@/lib/format"
import { cn } from "@/lib/utils"

const SORT_OPTIONS: { value: ExpenseSortOrder; label: string }[] = [
  { value: "newest", label: "Mais recentes" },
  { value: "oldest", label: "Mais antigos" },
  { value: "amount_desc", label: "Maior valor" },
  { value: "amount_asc", label: "Menor valor" },
]

function toIsoDate(date: Date) {
  return format(date, "yyyy-MM-dd")
}

function formatRangeLabel(range: DateRange | undefined) {
  if (!range?.from) return "Período"
  const from = format(range.from, "dd MMM", { locale: ptBR })
  if (!range.to) return from
  const to = format(range.to, "dd MMM", { locale: ptBR })
  return `${from} – ${to}`
}

export function ExpensesFilters() {
  const {
    state: { filters, members },
    actions: { updateFilter },
  } = useExpensesApp()

  const [range, setRange] = useState<DateRange | undefined>()
  const [periodOpen, setPeriodOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const categoryOptions = useMemo(
    () =>
      ALL_CATEGORIES.map((category) => ({
        value: category,
        label: categoryLabel(category),
      })),
    []
  )

  const memberOptions = useMemo(
    () =>
      members.map((member) => ({
        value: member.id,
        label: member.name,
      })),
    [members]
  )

  const activeSort =
    SORT_OPTIONS.find(
      (option) => option.value === (filters.sort ?? "newest")
    ) ?? SORT_OPTIONS[0]!

  function handleRangeSelect(next: DateRange | undefined) {
    setRange(next)
    updateFilter("startDate", next?.from ? toIsoDate(next.from) : undefined)
    updateFilter("endDate", next?.to ? toIsoDate(next.to) : undefined)
  }

  function clearRange() {
    setRange(undefined)
    updateFilter("startDate", undefined)
    updateFilter("endDate", undefined)
  }

  const hasPeriod = Boolean(range?.from)

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
              categories.length ? (categories as ExpenseCategory[]) : undefined
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

        <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 border-dashed", hasPeriod && "border-solid")}
              />
            }
          >
            <CalendarIcon data-icon="inline-start" />
            Período
            {hasPeriod ? (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-0.5 hidden h-4 sm:block"
                />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {formatRangeLabel(range)}
                </Badge>
              </>
            ) : null}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              numberOfMonths={1}
              autoFocus
            />
            <div className="flex justify-end border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRange}
                disabled={!range?.from}
              >
                Limpar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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
