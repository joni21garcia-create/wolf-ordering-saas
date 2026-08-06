"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext =
  createContext<SidebarContextValue | null>(null);

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
const [collapsed, setCollapsed] =
  useState(true);

  const toggle = useCallback(() => {
    setCollapsed((v) => !v);
  }, []);

  const open = useCallback(() => {
    setCollapsed(false);
  }, []);

  const close = useCallback(() => {
    setCollapsed(true);
  }, []);

  const value = useMemo(
    () => ({
      collapsed,
      toggle,
      open,
      close,
    }),
    [collapsed, toggle, open, close]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar debe usarse dentro de SidebarProvider."
    );
  }

  return context;
}