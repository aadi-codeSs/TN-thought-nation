const SKELETON_COUNT = 6;

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="
        animate-pulse
        rounded-xl
        border border-border
        bg-card
        p-5
        space-y-4
      "
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-3 w-5 rounded bg-muted" />
      </div>

      <div className="aspect-video w-full rounded-md bg-muted" />

      <div className="h-4 w-3/4 rounded bg-muted" />

      <div className="h-3 w-full rounded bg-muted" />

      <div className="flex gap-2 border-t border-border pt-3">
        <div className="h-3 w-10 rounded bg-muted" />
        <div className="h-3 w-12 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ThoughtCardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({
        length: SKELETON_COUNT,
      }).map((_, index) => (
        <SkeletonCard
          key={`skeleton-${index}`}
        />
      ))}
    </div>
  );
}