"use client";

import { useTransition, useMemo } from "react";

import Image from "next/image";

import type {
  Favorite,
  Tag,
  Thought,
} from "@/src/generated/prisma/client";

import {
  Play,
  MessageCircle,
  FileText,
  Link2,
  Bookmark,
  Trash2,
  ExternalLink,
  Lightbulb,
} from "lucide-react";

import { toast } from "sonner";

import { toggleFavorite, deleteThought } from "@/src/action/thoughts";

interface ThoughtCardProps {
  thought: Thought & {
    tags: {
      tag: Tag;
    }[];
    favorites: Favorite[];
  };
}

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  YOUTUBE: {
    icon: <Play size={12} strokeWidth={2.5} />,
    label: "YouTube",
    color: "text-red-400",
  },
  TWITTER: {
    icon: <MessageCircle size={12} strokeWidth={2.5} />,
    label: "Twitter",
    color: "text-sky-400",
  },
  DOC: {
    icon: <FileText size={12} strokeWidth={2.5} />,
    label: "Document",
    color: "text-emerald-400",
  },
  THOUGHT: {
    icon: <Lightbulb size={12} strokeWidth={2.5} />,
    label: "Thought",
    color: "text-amber-400",
  },
  LINK: {
    icon: <Link2 size={12} strokeWidth={2.5} />,
    label: "Link",
    color: "text-violet-400",
  },
};

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    });
  }
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "Just now";
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  const [isPending, startTransition] = useTransition();

  const isFavorite = thought.favorites.length > 0;
  const typeConfig = TYPE_CONFIG[thought.type] ?? TYPE_CONFIG.THOUGHT;

  const relativeDate = useMemo(
    () => formatRelativeDate(new Date(thought.createdAt)),
    [thought.createdAt],
  );

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        await toggleFavorite(thought.id);
      } catch {
        toast.error("Failed to update favorite.");
      }
    });
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm("Delete this thought?");
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteThought(thought.id);
        toast.success("Thought deleted.");
      } catch {
        toast.error("Failed to delete thought.");
      }
    });
  }

  return (
    <article
      className="
        group/card
        relative flex flex-col
        rounded-xl
        border border-[color:var(--border)]
        bg-[color:var(--card)]
        transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:border-[color:oklch(0.32_0.02_285)]
        hover:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.4)]
        hover:-translate-y-[1px]
      "
    >
      {/* ── Thumbnail ────────────────────────────────── */}
      {thought.thumbnail && (
        <div
          className="
            relative
            aspect-[2/1]
            overflow-hidden
            rounded-t-[11px]
          "
        >
          <Image
            src={thought.thumbnail}
            alt={thought.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="
              object-cover
              transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
              group-hover/card:scale-[1.03]
            "
          />
          {/* Subtle bottom fade to blend image into content */}
          <div
            className="
              absolute inset-x-0 bottom-0 h-10
              bg-gradient-to-t from-[color:var(--card)] to-transparent
              pointer-events-none
            "
          />
        </div>
      )}

      {/* ── Content ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-4 pt-4 pb-3.5">
        {/* Type badge + actions row */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`
              inline-flex items-center gap-1.5
              text-[11px] font-medium tracking-wide uppercase
              ${typeConfig.color}
              opacity-80
            `}
          >
            {typeConfig.icon}
            <span>{thought.siteName ?? typeConfig.label}</span>
          </div>

          {/* Action buttons — revealed on hover */}
          <div
            className="
              flex items-center gap-0.5
              opacity-0
              translate-y-0.5
              transition-all duration-200 ease-out
              group-hover/card:opacity-100
              group-hover/card:translate-y-0
            "
          >
            <button
              type="button"
              aria-label="Toggle favorite"
              onClick={handleFavorite}
              disabled={isPending}
              className="
                p-1.5 rounded-md
                text-[color:var(--muted-foreground)]
                transition-colors duration-150
                hover:text-amber-400
                hover:bg-[color:oklch(0.20_0.01_285)]
                disabled:opacity-40
                cursor-pointer
              "
            >
              <Bookmark
                size={13}
                strokeWidth={isFavorite ? 0 : 2}
                fill={isFavorite ? "currentColor" : "none"}
                className={isFavorite ? "text-amber-400" : ""}
              />
            </button>

            {thought.url && (
              <a
                href={thought.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  p-1.5 rounded-md
                  text-[color:var(--muted-foreground)]
                  transition-colors duration-150
                  hover:text-[color:var(--foreground)]
                  hover:bg-[color:oklch(0.20_0.01_285)]
                "
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={13} strokeWidth={2} />
              </a>
            )}

            <button
              type="button"
              aria-label="Delete thought"
              onClick={handleDelete}
              disabled={isPending}
              className="
                p-1.5 rounded-md
                text-[color:var(--muted-foreground)]
                transition-colors duration-150
                hover:text-red-400
                hover:bg-red-400/10
                disabled:opacity-40
                cursor-pointer
              "
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Title ──────────────────────────────────── */}
        <h3
          className="
            text-[14px] leading-[1.45]
            font-semibold tracking-[-0.01em]
            text-[color:var(--foreground)]
            line-clamp-2
            mb-1.5
          "
        >
          {thought.url ? (
            <a
              href={thought.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                transition-colors duration-150
                hover:text-[color:var(--primary)]
              "
            >
              {thought.title}
            </a>
          ) : (
            thought.title
          )}
        </h3>

        {/* ── Description ────────────────────────────── */}
        {thought.description && (
          <p
            className="
              text-[12.5px] leading-[1.55]
              text-[color:var(--muted-foreground)]
              line-clamp-2
              mb-3
            "
          >
            {thought.description}
          </p>
        )}

        {/* ── Spacer ─────────────────────────────────── */}
        <div className="flex-1" />

        {/* ── Footer: Tags + Date ────────────────────── */}
        <div className="flex items-end justify-between gap-2 mt-2 pt-3 border-t border-[color:var(--border)]/50">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 min-w-0 flex-1">
            {thought.tags.slice(0, 3).map(({ tag }) => (
              <span
                key={tag.id}
                className="
                  inline-flex items-center
                  rounded-md
                  bg-[color:oklch(0.18_0.01_285)]
                  px-1.5 py-0.5
                  text-[11px] leading-none
                  font-medium
                  text-[color:var(--muted-foreground)]
                  transition-colors duration-150
                  truncate max-w-[100px]
                "
              >
                {tag.name}
              </span>
            ))}
            {thought.tags.length > 3 && (
              <span
                className="
                  inline-flex items-center
                  rounded-md
                  px-1.5 py-0.5
                  text-[11px] leading-none
                  font-medium
                  text-[color:var(--muted-foreground)]
                  opacity-60
                "
              >
                +{thought.tags.length - 3}
              </span>
            )}
          </div>

          {/* Date */}
          <time
            dateTime={new Date(thought.createdAt).toISOString()}
            className="
              text-[11px]
              text-[color:var(--muted-foreground)]
              opacity-60
              whitespace-nowrap
              shrink-0
            "
          >
            {relativeDate}
          </time>
        </div>
      </div>
    </article>
  );
}