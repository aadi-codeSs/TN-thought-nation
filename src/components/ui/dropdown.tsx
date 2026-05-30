"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function Dropdown({
  trigger,
  children,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
      >
        {trigger}
      </button>

      {open && (
        <div
          className="
            absolute right-0 z-50 mt-2
            w-48 rounded-lg
            border border-border
            bg-popover
            p-1
            shadow-md
          "
        >
          {children}
        </div>
      )}
    </div>
  );
}