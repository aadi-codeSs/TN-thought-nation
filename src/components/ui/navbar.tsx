"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  Plus,
  Bell,
  User,
} from "lucide-react";

import { Dropdown } from "./dropdown";
import { LogoutButton } from "./auth/logout";

interface NavbarProps {
  onOpenAddModal: () => void;
}

export function Navbar({
  onOpenAddModal,
}: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") ?? "";

  const [search, setSearch] =
    useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString(),
      );

      const trimmedSearch =
        search.trim();

      if (trimmedSearch) {
        params.set(
          "search",
          trimmedSearch,
        );
      } else {
        params.delete("search");
      }

      router.replace(
        `/dashboard?${params.toString()}`
      );
    }, 300);

    return () =>
      clearTimeout(timeout);
  }, [search, router, searchParams]);

  return (
    <header
      className="
        sticky top-0 z-20
        flex h-14 items-center justify-between
        border-b border-border
        bg-background/80
        px-6 backdrop-blur
      "
    >
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search
          className="
            absolute left-3 top-1/2
            h-4 w-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <input
          type="text"
          placeholder="Search thoughts..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            h-9 w-full
            rounded-md
            border border-input
            bg-background
            pl-9 pr-4
            text-sm
            placeholder:text-muted-foreground
            focus:outline-none
            focus:ring-2
            focus:ring-ring
          "
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="
            inline-flex items-center gap-2
            rounded-md
            bg-primary
            px-3 py-2
            text-sm font-medium
            text-primary-foreground
            transition-colors
            hover:opacity-90
          "
        >
          <Plus size={16} />
          <span>Capture Thought</span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            rounded-md
            border border-border
            p-2
            text-muted-foreground
            transition-colors
            hover:text-foreground
          "
        >
          <Bell size={16} />

          <span
            className="
              absolute right-1 top-1
              h-2 w-2
              rounded-full
              bg-primary
            "
          />
        </button>

        <Dropdown
          trigger={
            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full
                border border-border
                bg-muted
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >
              <User size={16} />
            </div>
          }
        >
          <div
            className="
              border-b border-border
              px-3 py-2
            "
          >
            <p
              className="
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              Account
            </p>
          </div>

          <div className="p-1">
            <LogoutButton />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}