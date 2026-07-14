"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { parseIsoDate, toIsoDate } from "@/lib/date"
import { cn } from "@/lib/utils"

export type DateRangeValue = {
  from?: string
  to?: string
}

type DatePickerBaseProps = {
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  clearable?: boolean
  align?: "start" | "center" | "end"
  appearance?: "field" | "filter"
}

type DatePickerSingleProps = DatePickerBaseProps & {
  mode: "single"
  value?: string
  onChange: (value: string | undefined) => void
}

type DatePickerRangeProps = DatePickerBaseProps & {
  mode: "range"
  value?: DateRangeValue
  onChange: (value: DateRangeValue | undefined) => void
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

function formatSingleLabel(iso: string | undefined, placeholder: string) {
  if (!iso) return placeholder
  return format(parseIsoDate(iso), "dd/MM/yyyy", { locale: ptBR })
}

function formatRangeLabel(
  range: DateRangeValue | undefined,
  placeholder: string,
) {
  if (!range?.from) return placeholder
  const from = format(parseIsoDate(range.from), "dd/MM/yyyy", { locale: ptBR })
  if (!range.to) return from
  const to = format(parseIsoDate(range.to), "dd/MM/yyyy", { locale: ptBR })
  return `${from} – ${to}`
}

function toCalendarRange(value: DateRangeValue | undefined): DateRange | undefined {
  if (!value?.from) return undefined
  return {
    from: parseIsoDate(value.from),
    to: value.to ? parseIsoDate(value.to) : undefined,
  }
}

export function DatePicker(props: DatePickerProps) {
  const {
    placeholder = "Selecionar data",
    disabled = false,
    id,
    className,
    align = "start",
    appearance = "field",
  } = props

  const clearable =
    props.clearable ?? (appearance === "filter" || props.mode === "range")

  const [open, setOpen] = useState(false)

  const hasValue =
    props.mode === "single"
      ? Boolean(props.value)
      : Boolean(props.value?.from)

  const label =
    props.mode === "single"
      ? formatSingleLabel(props.value, placeholder)
      : formatRangeLabel(props.value, placeholder)

  function handleSingleSelect(date: Date | undefined) {
    if (props.mode !== "single") return
    props.onChange(date ? toIsoDate(date) : undefined)
    if (date) setOpen(false)
  }

  function handleRangeSelect(next: DateRange | undefined) {
    if (props.mode !== "range") return
    if (!next?.from) {
      props.onChange(undefined)
      return
    }
    props.onChange({
      from: toIsoDate(next.from),
      to: next.to ? toIsoDate(next.to) : undefined,
    })
  }

  function handleClear() {
    props.onChange(undefined)
  }

  const isFilter = appearance === "filter"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            size={isFilter ? "sm" : "default"}
            disabled={disabled}
            className={cn(
              isFilter
                ? cn("h-8 border-dashed", hasValue && "border-solid")
                : "w-full justify-start font-normal",
              !hasValue && !isFilter && "text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon data-icon="inline-start" />
        {isFilter ? (
          <>
            {placeholder}
            {hasValue ? (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-0.5 hidden h-4 sm:block"
                />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {label}
                </Badge>
              </>
            ) : null}
          </>
        ) : (
          label
        )}
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0">
        {props.mode === "single" ? (
          <Calendar
            mode="single"
            locale={ptBR}
            selected={props.value ? parseIsoDate(props.value) : undefined}
            onSelect={handleSingleSelect}
            numberOfMonths={1}
            autoFocus
          />
        ) : (
          <Calendar
            mode="range"
            locale={ptBR}
            selected={toCalendarRange(props.value)}
            onSelect={handleRangeSelect}
            numberOfMonths={1}
            autoFocus
          />
        )}
        {clearable ? (
          <div className="flex justify-end border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!hasValue}
            >
              Limpar
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
