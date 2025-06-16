"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";

interface UsersLayoutProps {
  children: ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  const { isDark } = useDarkMode();
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector("#navbar-dashboard");
    const updateHeight = () => {
      if (navbar) setNavbarHeight((navbar as HTMLElement).clientHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  return (
    <div
      className={`flex flex-col gap-6 justify-center items-start rounded-4xl w-full p-6 transition-colors duration-300 ${
        isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
      }`}
      style={{ height: `calc(100vh - ${navbarHeight}px)` }}
    >
      {children}
    </div>
  );
}
