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
      "
    >
      {/* Thumbnail placeholder */}
      <div className="aspect-[2/1] w-full rounded-t-[11px] bg-muted" />

      {/* Content area */}
      <div className="px-4 pt-4 pb-3.5 space-y-3">
        {/* Type badge */}
        <div className="h-3 w-16 rounded bg-muted" />

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-4/5 rounded bg-muted" />
          <div className="h-3.5 w-3/5 rounded bg-muted" />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex gap-1">
            <div className="h-4 w-12 rounded-md bg-muted" />
            <div className="h-4 w-14 rounded-md bg-muted" />
          </div>
          <div className="h-3 w-10 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ThoughtCardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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