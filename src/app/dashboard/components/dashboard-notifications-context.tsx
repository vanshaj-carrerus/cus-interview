"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DashboardNotificationsContextValue = {
  open: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
};

const DashboardNotificationsContext =
  createContext<DashboardNotificationsContextValue | null>(null);

export function DashboardNotificationsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openNotifications = useCallback(() => setOpen(true), []);
  const closeNotifications = useCallback(() => setOpen(false), []);
  const toggleNotifications = useCallback(() => setOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({
      open,
      openNotifications,
      closeNotifications,
      toggleNotifications,
    }),
    [open, openNotifications, closeNotifications, toggleNotifications],
  );

  return (
    <DashboardNotificationsContext.Provider value={value}>
      {children}
    </DashboardNotificationsContext.Provider>
  );
}

export function useDashboardNotifications() {
  const context = useContext(DashboardNotificationsContext);
  if (!context) {
    throw new Error(
      "useDashboardNotifications must be used within DashboardNotificationsProvider",
    );
  }
  return context;
}
