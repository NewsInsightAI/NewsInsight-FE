"use client";
import NavbarDashboard from "@/components/NavbarDashboard";
import DashboardGuard from "@/components/DashboardGuard";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);
  return (
    <div
      className={`${interFont.className} antialiased bg-[#1A1A1A] text-white min-w-screen`}
    >
      <NavbarDashboard />
      <div
        className={`bg-[#1A1A1A] rounded-4xl`}
        style={{ paddingTop: `${navbarDashboardHeight}px` }}
      >
        <main className="flex flex-col items-center justify-center h-full">
          <DashboardGuard>{children}</DashboardGuard>
        </main>
      </div>
    </div>
  );
}
