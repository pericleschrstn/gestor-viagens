import { Skeleton } from "@/components/ui/skeleton"

export default function TripLayoutLoading() {
  return (
    <div className="flex flex-col gap-4 px-5 py-5 lg:px-6 lg:py-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
      <div className="grid gap-3 sm:grid-cols-0">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  )
}
