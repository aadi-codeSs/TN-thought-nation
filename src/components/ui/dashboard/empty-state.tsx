import { LayoutGrid } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <section
      className="
        mx-auto mt-12
        flex max-w-md flex-col items-center justify-center
        rounded-xl
        border border-dashed border-border
        bg-card/50
        p-12
        text-center
      "
    >
      <div
        aria-hidden="true"
        className="
          mb-4
          flex h-10 w-10 items-center justify-center
          rounded-lg
          border border-border
          bg-muted
          text-muted-foreground
        "
      >
        <LayoutGrid size={18} />
      </div>

      <h3
        className="
          text-sm
          font-semibold
          tracking-tight
          text-foreground
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-1
          max-w-xs
          text-xs
          leading-relaxed
          text-muted-foreground
        "
      >
        {description}
      </p>
    </section>
  );
}