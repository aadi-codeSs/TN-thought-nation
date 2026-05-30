import { Suspense } from "react";

import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

import { getThoughts } from "@/src/action/thoughts";

import { ContentType } from "@/src/generated/prisma/enums";

import type { DashboardFilters } from "@/src/lib/validation/thought";

import { DashboardShell } from "@/src/components/ui/dashboard/dashboard-shell";
import { ThoughtCard } from "@/src/components/ui/dashboard/thought-card";
import { EmptyState } from "@/src/components/ui/dashboard/empty-state";
import { ThoughtCardSkeleton } from "@/src/components/ui/dashboard/skeleton-loader";

interface SearchParams {
  search?: string;
  type?: string;
  tag?: string;
  favorites?: string;
  sort?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function ThoughtGrid({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const type = Object.values(ContentType).includes(
    searchParams.type as ContentType,
  )
    ? (searchParams.type as ContentType)
    : undefined;

  const filters: DashboardFilters = {
    search: searchParams.search,
    tag: searchParams.tag,
    favoritesOnly: searchParams.favorites === "true",
    type,
    sort:
      searchParams.sort === "oldest"
        ? "oldest"
        : "newest",
  };

  const thoughts = await getThoughts(filters);

  if (!thoughts.length) {
    if (filters.search) {
      return (
        <EmptyState
          title="No results found"
          description="Try a different search term."
        />
      );
    }

    if (filters.favoritesOnly) {
      return (
        <EmptyState
          title="No favorites yet"
          description="Bookmark thoughts to see them here."
        />
      );
    }

    return (
      <EmptyState
        title="No thoughts yet"
        description="Start capturing ideas and resources."
      />
    );
  }

  return (
    <div
      className="
        grid gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {thoughts.map((thought) => (
        <ThoughtCard
          key={thought.id}
          thought={thought}
        />
      ))}
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const session = await auth();

  const userId = session?.user?.id;

  const tags = userId
    ? await prisma.tag.findMany({
        where: {
          userId,
        },
        select: {
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      })
    : [];

  return (
    <DashboardShell
      tags={tags.map((tag) => tag.name)}
    >
      <Suspense
        key={JSON.stringify(params)}
        fallback={<ThoughtCardSkeleton />}
      >
        <ThoughtGrid
          searchParams={params}
        />
      </Suspense>
    </DashboardShell>
  );
}