export default function IconsLoading() {
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-6 w-96 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-lg border p-4"
          >
            <div className="size-12 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
