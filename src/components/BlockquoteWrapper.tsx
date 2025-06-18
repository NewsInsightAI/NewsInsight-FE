"use client";

import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";

interface BlockquoteWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function BlockquoteWrapper({
  children,
  className = "",
}: BlockquoteWrapperProps) {
  const { isDark } = useDarkMode();

  return (
    <blockquote
      className={`
        relative border-none border-l-4 p-6 m-8 font-medium italic rounded-xl 
        transition-all duration-300 ease-in-out overflow-visible min-h-16
        transform hover:-translate-y-1
        ${
          isDark
            ? "border-l-blue-400 bg-gradient-to-br from-slate-800 to-slate-700 text-slate-200 shadow-lg shadow-blue-500/15"
            : "border-l-blue-500 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 shadow-lg shadow-blue-500/10"
        }
        ${className}
      `}
    >
      {/* Quote Icon */}
      <Icon
        icon="material-symbols:format-quote"
        className={`
          absolute text-4xl opacity-20 pointer-events-none z-10
          ${isDark ? "text-blue-400" : "text-blue-500"}
        `}
        style={{
          left: "1rem",
          top: "0.5rem",
        }}
      />

      {/* Content with proper spacing */}
      <div className="relative z-20 pl-8">{children}</div>

      {/* Decorative gradient overlay */}
      <div
        className={`
          absolute top-0 right-0 w-16 h-full rounded-r-xl pointer-events-none z-0
          ${
            isDark
              ? "bg-gradient-to-l from-blue-500/5 to-transparent"
              : "bg-gradient-to-l from-blue-500/3 to-transparent"
          }
        `}
      />
    </blockquote>
  );
}
