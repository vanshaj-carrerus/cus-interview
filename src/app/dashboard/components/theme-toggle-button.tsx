"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarAnimatedText } from "./sidebar-animated-label";

export default function ThemeToggleButton({ collapsed, index = 0 }: { collapsed: boolean; index?: number }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex w-full items-center rounded-lg px-3 py-2.5 text-[13px] text-sky-100/60 transition hover:bg-sky-400/10 hover:text-white">
        <div className="h-4 w-4 shrink-0" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeConfig = () => {
    if (theme === "dark") return { label: "Dark Mode", Icon: Moon };
    if (theme === "light") return { label: "Light Mode", Icon: Sun };
    return { label: "System Theme", Icon: Monitor };
  };

  const { label, Icon } = getThemeConfig();

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={collapsed ? label : undefined}
      className={`flex w-full items-center rounded-lg text-[13px] text-sky-100/60 transition hover:bg-sky-400/10 hover:text-white ${
        collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <SidebarAnimatedText
        label={label}
        collapsed={collapsed}
        index={index}
      />
    </button>
  );
}
