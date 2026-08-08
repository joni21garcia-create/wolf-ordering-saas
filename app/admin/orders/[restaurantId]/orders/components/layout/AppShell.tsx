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
        alignItems: "stretch",

        width: "100%",
        minHeight: "100dvh",

        background: "#090909",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: "1 1 auto",

          minWidth: 0,
          width: "100%",

          /*
           * IMPORTANTE:
           * El scroll principal pertenece al documento
           * (html/body), no a <main>.
           */
          overflow: "visible",

          padding: 24,

          transition:
            "margin-left .25s ease",

          marginLeft:
            collapsed ? -12 : 0,

          WebkitOverflowScrolling:
            "touch",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function AppShell({
  children,
}: Props) {
  return (
    <SidebarProvider>
      <Layout>
        {children}
      </Layout>
    </SidebarProvider>
  );
}