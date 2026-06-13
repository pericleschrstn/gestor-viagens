import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function TripNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Viagem não encontrada</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Essa viagem não existe ou você não tem acesso.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants(), "mt-4 inline-flex")}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
