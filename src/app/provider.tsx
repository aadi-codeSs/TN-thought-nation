"use client";

import type { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
