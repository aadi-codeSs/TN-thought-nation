"use client";

import {
  useState,
  type ReactNode,
} from "react";


import { Navbar } from "../navbar";
import { Sidebar } from "./sidebar";
import { AddThoughtModal } from "./add-thought-modal";

interface DashboardShellProps {
  tags: string[];
  children: ReactNode;
}

export function DashboardShell({
  tags,
  children,
}: DashboardShellProps) {
  const [
    isAddModalOpen,
    setIsAddModalOpen,
  ] = useState(false);

  const openModal = () =>
    setIsAddModalOpen(true);

  const closeModal = () =>
    setIsAddModalOpen(false);

  return (
    <div
      className="
        flex min-h-screen
        bg-background
        text-foreground
        antialiased

        selection:bg-primary
        selection:text-primary-foreground
      "
    >
      <Sidebar tags={tags} />

      <div
        className="
          flex flex-1 flex-col
          overflow-x-hidden
        "
      >
        <Navbar
          onOpenAddModal={openModal}
        />

        <main
          className="
            flex-1
            overflow-y-auto
            p-8
          "
        >
          {children}
        </main>
      </div>

      <AddThoughtModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}