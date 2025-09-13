import { Skeleton } from "@/components/skeleton";

export function TodoSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

export function TodoListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <TodoSkeleton key={i} />
      ))}
    </div>
  );
}
