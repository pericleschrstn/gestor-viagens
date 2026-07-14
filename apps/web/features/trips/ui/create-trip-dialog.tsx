"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTripAction } from "@/features/trips/actions/trip.actions"
import type { Currency } from "@/features/expenses/domain/models"
import { toIsoDate } from "@/lib/date"
import { tripViewHref } from "@/lib/trip-routes"

const CURRENCIES: Currency[] = ["BRL", "ARS"]

type CreateTripDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (tripId: string) => void
}

function defaultDates() {
  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + 7)
  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  }
}

export function CreateTripDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateTripDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState("")
  const [initials, setInitials] = useState("")
  const [startDate, setStartDate] = useState(() => {
    const dates = defaultDates()
    return dates.startDate
  })
  const [endDate, setEndDate] = useState(() => {
    const dates = defaultDates()
    return dates.endDate
  })
  const [baseCurrency, setBaseCurrency] = useState<Currency>("BRL")

  function resetForm() {
    const dates = defaultDates()
    setName("")
    setInitials("")
    setStartDate(dates.startDate)
    setEndDate(dates.endDate)
    setBaseCurrency("BRL")
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    startTransition(async () => {
      const result = await createTripAction({
        name: name.trim(),
        initials: initials.trim().toUpperCase(),
        startDate,
        endDate,
        baseCurrency,
      })

      if (!result.ok) {
        toast.error(result.error.message)
        return
      }

      toast.success("Viagem criada")
      onOpenChange(false)
      resetForm()
      onCreated?.(result.data.id)
      router.push(tripViewHref(result.data.id, "dashboard"))
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) resetForm()
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Nova viagem</DialogTitle>
          <DialogDescription>
            Crie uma viagem para começar a registrar gastos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-name">Nome</Label>
            <Input
              id="trip-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Itália em família"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-initials">Iniciais</Label>
              <Input
                id="trip-initials"
                maxLength={4}
                value={initials}
                onChange={(event) => setInitials(event.target.value)}
                placeholder="IT"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-currency">Moeda</Label>
              <Select
                value={baseCurrency}
                onValueChange={(value) => setBaseCurrency(value as Currency)}
              >
                <SelectTrigger id="trip-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-start">Início</Label>
              <DatePicker
                id="trip-start"
                mode="single"
                value={startDate}
                onChange={(value) => {
                  if (value) setStartDate(value)
                }}
                clearable={false}
                placeholder="Data de início"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-end">Fim</Label>
              <DatePicker
                id="trip-end"
                mode="single"
                value={endDate}
                onChange={(value) => {
                  if (value) setEndDate(value)
                }}
                clearable={false}
                placeholder="Data de fim"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Criando..." : "Criar viagem"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
