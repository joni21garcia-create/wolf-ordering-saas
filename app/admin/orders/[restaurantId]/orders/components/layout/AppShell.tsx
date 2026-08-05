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
        minHeight: "100vh",
        background: "#090909",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          overflow: "auto",
          padding: 24,
          transition: "all .25s ease",
          marginLeft: collapsed ? -12 : 0,
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