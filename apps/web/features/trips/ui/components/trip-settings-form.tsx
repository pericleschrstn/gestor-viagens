"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Currency } from "@/features/expenses/domain/models"
import {
  deleteTripAction,
  updateTripAction,
} from "@/features/trips/actions/trip.actions"
import type { Trip } from "@/features/trips/domain/models"
import type { TripStatus } from "@/features/trips/domain/schemas"
import type { TripCapabilities } from "@/features/shared/domain/capabilities"

const CURRENCIES: Currency[] = ["BRL", "ARS"]

const STATUS_OPTIONS: { value: TripStatus; label: string }[] = [
  { value: "planning", label: "Planejamento" },
  { value: "active", label: "Em andamento" },
  { value: "closed", label: "Encerrada" },
]

type TripSettingsFormProps = {
  trip: Trip
  capabilities: TripCapabilities
}

export function TripSettingsForm({ trip, capabilities }: TripSettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [name, setName] = useState(trip.name)
  const [initials, setInitials] = useState(trip.initials)
  const [startDate, setStartDate] = useState(trip.startDate)
  const [endDate, setEndDate] = useState(trip.endDate)
  const [status, setStatus] = useState<TripStatus>(trip.status)
  const [baseCurrency, setBaseCurrency] = useState<Currency>(trip.baseCurrency)

  const canEdit = capabilities.canDeleteTrip

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canEdit) return

    startTransition(async () => {
      const result = await updateTripAction(
        trip.id,
        {
          name: name.trim(),
          initials: initials.trim().toUpperCase(),
          startDate,
          endDate,
          status,
          baseCurrency,
        },
        capabilities,
      )

      if (!result.ok) {
        toast.error(result.error.message)
        return
      }

      toast.success("Viagem atualizada")
      router.refresh()
    })
  }

  function handleDelete() {
    if (!canEdit) return

    startDeleteTransition(async () => {
      const result = await deleteTripAction(trip.id, capabilities)

      if (!result.ok) {
        toast.error(result.error.message)
        return
      }

      toast.success("Viagem excluída")
      setDeleteOpen(false)
      router.push("/")
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Dados da viagem</CardTitle>
          <CardDescription>
            {canEdit
              ? "Edite as informações gerais da viagem."
              : "Você não tem permissão para editar esta viagem."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-name">Nome</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={!canEdit || isPending}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-initials">Iniciais</Label>
                <Input
                  id="settings-initials"
                  maxLength={4}
                  value={initials}
                  onChange={(event) => setInitials(event.target.value)}
                  disabled={!canEdit || isPending}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-status">Status</Label>
                <Select
                  items={STATUS_OPTIONS}
                  value={status}
                  onValueChange={(value) => setStatus(value as TripStatus)}
                  disabled={!canEdit || isPending}
                >
                  <SelectTrigger id="settings-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-start">Início</Label>
                <DatePicker
                  id="settings-start"
                  mode="single"
                  value={startDate}
                  onChange={(value) => {
                    if (value) setStartDate(value)
                  }}
                  clearable={false}
                  disabled={!canEdit || isPending}
                  placeholder="Data de início"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-end">Fim</Label>
                <DatePicker
                  id="settings-end"
                  mode="single"
                  value={endDate}
                  onChange={(value) => {
                    if (value) setEndDate(value)
                  }}
                  clearable={false}
                  disabled={!canEdit || isPending}
                  placeholder="Data de fim"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-currency">Moeda base</Label>
                <Select
                  value={baseCurrency}
                  onValueChange={(value) => setBaseCurrency(value as Currency)}
                  disabled={!canEdit || isPending}
                >
                  <SelectTrigger id="settings-currency" className="w-full">
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

            {canEdit ? (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar alterações"}
                  {isPending ? <Spinner data-icon="inline-end" /> : null}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 data-icon="inline-start" />
                  Excluir viagem
                </Button>
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir esta viagem?"
        description="Esta ação não pode ser desfeita."
        isPending={isDeleting}
        confirmLabel="Excluir viagem"
        onConfirm={handleDelete}
      />
    </>
  )
}
