"use client";

import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "./SidebarContext";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  const { collapsed } = useSidebar();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100dvh",
        background: "#090909",
      }}
    >
      <Sidebar />

<main
  style={{
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: 24,
    transition: "all .25s ease",
    marginLeft: collapsed ? -12 : 0,
    WebkitOverflowScrolling: "touch",
  }}
>
        {children}
      </main>
    </div>
  );
}

export default function AppShell({ children }: Props) {
  return (
    <SidebarProvider>
      <Layout>{children}</Layout>
    </SidebarProvider>
  );
}