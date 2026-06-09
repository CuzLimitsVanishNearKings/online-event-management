import { cn } from "@/utils/cn"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-32 h-4" />
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white">
        <div className="p-4 bg-slate-50 flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 flex gap-4 border-t border-slate-100">
            <Skeleton className="h-12 w-1/4 rounded-lg" />
            <Skeleton className="h-12 w-1/4 rounded-lg" />
            <Skeleton className="h-12 w-1/4 rounded-lg" />
            <Skeleton className="h-12 w-1/4 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
