"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "dashboard_sidebar_collapsed";

export const DASHBOARD_SIDEBAR_WIDTH = 240;
export const DASHBOARD_SIDEBAR_COLLAPSED_WIDTH = 72;

type DashboardSidebarContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const DashboardSidebarContext = createContext<DashboardSidebarContextValue | null>(null);

export function DashboardSidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") {
      setCollapsed(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed, hydrated]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ collapsed, toggleCollapsed }),
    [collapsed, toggleCollapsed],
  );

  return (
    <DashboardSidebarContext.Provider value={value}>
      {children}
    </DashboardSidebarContext.Provider>
  );
}

export function useDashboardSidebar() {
  const context = useContext(DashboardSidebarContext);
  if (!context) {
    throw new Error("useDashboardSidebar must be used within DashboardSidebarProvider");
  }
  return context;
}
