"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import type { Member } from "@/features/members/domain/models"
import { MemberFormDialog } from "@/features/members/ui/components/member-form-dialog"
import { useMembersApp } from "@/features/members/ui/members-provider"
import { cn } from "@/lib/utils"

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Dono",
  EDITOR: "Editor",
  VIEWER: "Visualizador",
}

function roleLabel(role: Member["role"]) {
  if (!role) return "Convidado"
  return ROLE_LABELS[role] ?? role
}

export function MembersList() {
  const {
    state: { capabilities },
    meta: { query, mutations },
  } = useMembersApp()

  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  const members = query.data ?? []

  if (query.isError) {
    return (
      <Card>
        <CardContent className="text-destructive py-8 text-center text-sm">
          {query.error?.message ?? "Não foi possível carregar os integrantes."}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Integrantes</CardTitle>
          <CardDescription>
            Pessoas que participam desta viagem
          </CardDescription>
          {capabilities.canManageMembers ? (
            <CardAction>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingMember(null)
                  setFormOpen(true)
                }}
              >
                <Plus className="size-3.5" />
                Adicionar
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="pt-1">
          {members.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              Nenhum integrante cadastrado.
            </p>
          ) : (
            <div>
              {members.map((member) => (
                <div
                  key={member.id}
                  className="border-border flex items-center gap-3 border-b py-3 last:border-b-0"
                >
                  <span className="border-border bg-secondary text-foreground grid size-9 shrink-0 place-items-center rounded-full border text-[11px] font-semibold">
                    {member.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{member.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {roleLabel(member.role)}
                      {member.userId ? " · conta vinculada" : ""}
                    </p>
                  </div>
                  {capabilities.canManageMembers ? (
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => {
                          setEditingMember(member)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn("size-8 text-destructive")}
                        disabled={mutations.deleteMutation.isPending}
                        onClick={() => mutations.deleteMutation.mutate(member.id)}
                      >
                        {mutations.deleteMutation.isPending ? (
                          <Spinner />
                        ) : (
                          <Trash2 />
                        )}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        member={editingMember}
      />
    </>
  )
}
