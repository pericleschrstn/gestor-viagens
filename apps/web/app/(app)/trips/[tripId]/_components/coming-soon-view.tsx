import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TRIP_VIEW_LABELS } from "@/lib/trip-routes"
import type { TripView } from "@/lib/trip-routes"

type ComingSoonViewProps = {
  view: TripView
}

export function ComingSoonView({ view }: ComingSoonViewProps) {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{TRIP_VIEW_LABELS[view]}</CardTitle>
        <CardDescription>Esta seção estará disponível em breve.</CardDescription>
      </CardHeader>
    </Card>
  )
}
