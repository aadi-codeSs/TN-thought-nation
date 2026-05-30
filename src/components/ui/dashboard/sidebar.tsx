"use client";

import { useState } from "react";

import Link from "next/link";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import { ContentType } from "@/src/generated/prisma/enums";

import {
  LayoutGrid,
  FileText,
  Bookmark,
  Settings,
  Hash,
  ChevronLeft,
  ChevronRight,
  Play,
  MessageCircle,
} from "lucide-react";

interface SidebarProps {
  tags: string[];
}

const DASHBOARD_ROUTE =
  "/dashboard";

export function Sidebar({
  tags,
}: SidebarProps) {
  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const [
    isCollapsed,
    setIsCollapsed,
  ] = useState(false);

  const currentType =
    searchParams.get("type");

  const currentTag =
    searchParams.get("tag");

  const favoritesOnly =
    searchParams.get(
      "favorites",
    ) === "true";

  const navItems = [
    {
      label: "All Thoughts",
      icon: LayoutGrid,
      href: DASHBOARD_ROUTE,
    },

    {
      label: "YouTube",
      icon: Play,
      href:
        `${DASHBOARD_ROUTE}?type=YOUTUBE`,
    },

    {
      label: "Twitter / X",
      icon: MessageCircle,
      href:
        `${DASHBOARD_ROUTE}?type=TWITTER`,
    },

    {
      label: "Documents",
      icon: FileText,
      href:
        `${DASHBOARD_ROUTE}?type=DOCUMENT`,
    },

    {
      label: "Favorites",
      icon: Bookmark,
      href:
        `${DASHBOARD_ROUTE}?favorites=true`,
    },
  ];

  return (
    <aside
      className={`
        sticky top-0 z-30
        flex h-screen flex-col justify-between
        border-r border-border
        bg-background
        pt-6
        transition-all duration-300

        ${
          isCollapsed
            ? "w-16 px-2"
            : "w-64 px-4"
        }
      `}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-md
                  bg-primary
                  text-primary-foreground
                  font-bold
                "
              >
                TN
              </div>

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                Thought Nation
              </span>
            </div>
          )}

          <button
            type="button"
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            onClick={() =>
              setIsCollapsed(
                (prev) => !prev,
              )
            }
            className="
              hidden md:block
              rounded-md
              border border-border
              p-1.5
            "
          >
            {isCollapsed ? (
              <ChevronRight
                size={14}
              />
            ) : (
              <ChevronLeft
                size={14}
              />
            )}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map(
            (item) => {
              const Icon =
                item.icon;

              const isActive =
                item.href ===
                  DASHBOARD_ROUTE &&
                pathname ===
                  DASHBOARD_ROUTE &&
                !currentType &&
                !favoritesOnly &&
                !currentTag;

              return (
                <Link
                  key={
                    item.label
                  }
                  href={item.href}
                  className={`
                    flex items-center gap-3
                    rounded-lg px-3 py-2
                    text-sm
                    transition-colors

                    ${
                      isActive
                        ? "bg-muted"
                        : ""
                    }
                  `}
                >
                  <Icon
                    size={16}
                  />

                  {!isCollapsed && (
                    <span>
                      {
                        item.label
                      }
                    </span>
                  )}
                </Link>
              );
            },
          )}
        </nav>

        {!isCollapsed &&
          tags.length > 0 && (
            <div
              className="
                border-t border-border
                pt-4
              "
            >
              <p
                className="
                  mb-2 px-3
                  text-xs
                  text-muted-foreground
                "
              >
                Tags
              </p>

              <div className="space-y-1">
                {tags.map(
                  (tag) => (
                    <Link
                      key={tag}
                      href={`${DASHBOARD_ROUTE}?tag=${encodeURIComponent(
                        tag,
                      )}`}
                      className="
                        flex items-center gap-2
                        rounded-md
                        px-3 py-1.5
                        text-sm
                      "
                    >
                      <Hash
                        size={12}
                      />

                      <span className="truncate">
                        {tag}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
      </div>

      <div
        className="
          border-t border-border
          pb-4 pt-4
        "
      >
        <Link
          href="/dashboard/settings"
          className="
            flex items-center gap-3
            rounded-lg px-3 py-2
            text-sm
          "
        >
          <Settings
            size={16}
          />

          {!isCollapsed && (
            <span>
              Settings
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}