"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
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
import type { Member } from "@/features/members/domain/models"
import { useMembersApp } from "@/features/members/ui/members-provider"
import type { TripRole } from "@/features/shared/domain/capabilities"

type MemberFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
}

const ROLE_ITEMS = [
  { value: "OWNER", label: "Dono" },
  { value: "EDITOR", label: "Editor" },
  { value: "VIEWER", label: "Visualizador" },
] as const satisfies readonly { value: TripRole; label: string }[]

const ROLE_OPTIONS = ROLE_ITEMS.filter((option) => option.value !== "OWNER")

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
}: MemberFormDialogProps) {
  const {
    meta: { mutations },
  } = useMembersApp()

  const isEditing = member !== null

  const [name, setName] = useState("")
  const [initials, setInitials] = useState("")
  const [role, setRole] = useState<TripRole>("EDITOR")

  const [wasOpen, setWasOpen] = useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setName(member?.name ?? "")
      setInitials(member?.initials ?? "")
      setRole(member?.role ?? "EDITOR")
    }
  }

  const isPending =
    mutations.createMutation.isPending || mutations.updateMutation.isPending

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const command = {
      name: name.trim(),
      initials: initials.trim().toUpperCase(),
      role,
    }

    if (isEditing) {
      mutations.updateMutation.mutate(
        { memberId: member.id, command },
        { onSuccess: () => onOpenChange(false) },
      )
      return
    }

    mutations.createMutation.mutate(command, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar integrante" : "Novo integrante"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do integrante."
              : "Adicione uma pessoa à viagem."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="member-name">Nome</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="member-initials">Iniciais</Label>
            <Input
              id="member-initials"
              maxLength={4}
              value={initials}
              onChange={(event) => setInitials(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="member-role">Papel</Label>
            <Select
              items={[...ROLE_ITEMS]}
              value={role}
              onValueChange={(value) => setRole(value as TripRole)}
            >
              <SelectTrigger id="member-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
