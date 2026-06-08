"use client";

import { useTransition } from "react";

import Image from "next/image";

// import type {
//   Favorite,
//   Tag,
//   Thought,
// } from "@/src/generated/prisma";

import type { Favorite,
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
  Calendar,
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

const ICONS = {
  YOUTUBE: (
    <Play
      size={14}
      className="text-red-500"
    />
  ),

  TWITTER: (
    <MessageCircle
      size={14}
      className="text-sky-500"
    />
  ),

  DOC: (
    <FileText
      size={14}
      className="text-emerald-500"
    />
  ),

  THOUGHT: (
    <Link2
      size={14}
      className="text-muted-foreground"
    />
  ),
  LINK: (
    <Link2
      size={14}
      className="text-muted-foreground"
    />
  ),
};

export function ThoughtCard({
  thought,
}: ThoughtCardProps) {
  const [isPending, startTransition] =
    useTransition();

  const isFavorite =
    thought.favorites.length > 0;

  function handleFavorite() {
    startTransition(async () => {
      try {
        await toggleFavorite(
          thought.id,
        );
      } catch {
        toast.error(
          "Failed to update favorite.",
        );
      }
    });
  }

  function handleDelete() {
    const confirmed =
      window.confirm(
        "Delete this thought?",
      );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteThought(
          thought.id,
        );

        toast.success(
          "Thought deleted.",
        );
      } catch {
        toast.error(
          "Failed to delete thought.",
        );
      }
    });
  }

  return (
    <article
      className="
        group flex flex-col justify-between
        rounded-xl
        border border-border
        bg-card
        p-5
        transition-all
      "
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div
            className="
              flex items-center gap-2
              text-xs uppercase
              text-muted-foreground
            "
          >
            {ICONS[
              thought.type
            ] ??
              ICONS.THOUGHT}

            {/* <span>
              {thought.siteName ??
                thought.type}
            </span> */}
          </div>

          <div
            className="
              flex items-center gap-1
              opacity-0
              transition-opacity
              group-hover:opacity-100
            "
          >
            <button
              type="button"
              aria-label="Toggle favorite"
              onClick={
                handleFavorite
              }
              disabled={isPending}
            >
              <Bookmark
                size={14}
                className=" cursor-pointer "
                fill={
                  isFavorite
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            <button
              type="button"
              aria-label="Delete thought"
              onClick={handleDelete}
              disabled={isPending}
              className=" cursor-pointer "
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {thought.thumbnail && (
          <div
            className="
              relative mb-3
              aspect-video
              overflow-hidden
              rounded-md
            "
          >
            <Image
              src={
                thought.thumbnail
              }
              alt={thought.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h3
          className="
            mb-1
            text-sm
            font-semibold
            text-foreground
          "
        >
          {thought.url ? (
            <a
              href={thought.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {thought.title}
            </a>
          ) : (
            thought.title
          )}
        </h3>

        {thought.description && (
          <p
            className="
              text-sm
              text-muted-foreground
              line-clamp-3
            "
          >
            {thought.description}
          </p>
        )}
      </div>

      <div
        className="
          mt-4
          space-y-3
          border-t border-border
          pt-3
        "
      >
        {thought.tags.length >
          0 && (
          <div className="flex flex-wrap gap-1">
            {thought.tags.map(
              ({ tag }) => (
                <span
                  key={tag.id}
                  className="
                    rounded-md
                    bg-muted
                    px-2 py-1
                    text-xs
                  "
                >
                  {tag.name}
                </span>
              ),
            )}
          </div>
        )}

        <div
          className="
            flex items-center gap-1
            text-xs
            text-muted-foreground
          "
        >
          <Calendar size={12} />

          <span>
            {new Date(
              thought.createdAt,
            ).toLocaleDateString(
              undefined,
              {
                dateStyle:
                  "medium",
              },
            )}
          </span>
        </div>
      </div>
    </article>
  );
}