"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted cursor-pointer"
    >
      Sign out
    </button>
  );
}