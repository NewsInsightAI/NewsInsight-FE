"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import { useEffect } from "react";

export function DarkModeWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useDarkMode();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
      document.documentElement.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return <div className={isDark ? "dark" : ""}>{children}</div>;
}
