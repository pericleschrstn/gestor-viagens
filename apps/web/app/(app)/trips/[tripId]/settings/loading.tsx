import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-72 w-full max-w-lg rounded-xl" />
    </div>
  )
}
