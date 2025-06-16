"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";

interface SettingsLayoutProps {
  children: ReactNode;
}

const basePath = "/settings";

const listSettings = [
  {
    label: "Profil",
    icon: "fluent:person-12-filled",
    href: "/settings/profile",
  },
  {
    label: "Data Pribadi",
    icon: "solar:document-bold",
    href: "/settings/personal-data",
  },
  {
    label: "Akun & Keamanan",
    icon: "mdi:account-cog",
    href: "/settings/account-security",
  },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { isDark } = useDarkMode();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const navbar = document.querySelector("#navbar");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      const navbar = document.querySelector("#navbar");
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
      checkIfMobile();
    };

    checkIfMobile();
    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (navbar && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        setNavbarHeight(navbar.clientHeight);
      });
      observer.observe(navbar);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer && navbar) observer.disconnect();
    };
  }, []);
  return (
    <div
      className={`${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"} min-h-screen transition-colors duration-300`}
    >
      {/* Mobile Horizontal Tabs */}
      {isMobile && (
        <div
          className={`md:hidden ${isDark ? "bg-[#1A1A1A] border-gray-600" : "bg-white border-gray-200"} border-b sticky top-0 z-20 transition-colors duration-300`}
          style={{ top: `${navbarHeight}px` }}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="material-symbols:settings-rounded"
                width={20}
                height={20}
                className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
              />
              <h1
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Pengaturan
              </h1>
            </div>
            <div className="overflow-x-auto no-scrollbar rounded-full">
              <div className="flex gap-3 min-w-max">
                {listSettings.map((menu) => {
                  const isDashboard = menu.href === basePath;
                  const isActive = isDashboard
                    ? pathname === basePath
                    : pathname.startsWith(menu.href);

                  return (
                    <Link
                      key={menu.href}
                      href={menu.href}
                      className={`flex items-center gap-2 px-4 py-3 rounded-full whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] text-white shadow-md"
                          : isDark
                            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Icon icon={menu.icon} fontSize={16} />
                      <span className="text-sm font-medium">{menu.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Desktop Layout */}
      <div
        className="flex gap-6 justify-start items-start w-full p-4 md:p-6"
        style={{
          paddingTop: isMobile
            ? `${navbarHeight + 20}px`
            : `${navbarHeight + 20}px`,
        }}
      >
        {/* Desktop Sidebar */}
        <div
          className={`hidden md:flex flex-col justify-start items-start gap-3 sticky self-start ${
            isMobile ? "hidden" : "flex"
          }`}
          style={{
            top: `${navbarHeight + 24}px`,
          }}
        >
          {" "}
          <div
            className={`${isDark ? "bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A]" : "bg-gradient-to-br from-[#2FAACC] to-[#2B62C2]"} p-4 rounded-2xl min-w-[240px] lg:min-w-[280px] transition-all duration-300`}
            style={{
              maxHeight: `calc(100vh - ${navbarHeight + 88}px)`,
              overflowY: "auto",
            }}
          >
            <div
              className={`flex items-center w-full gap-2.5 text-white pb-3 border-b ${isDark ? "border-gray-600" : "border-white/30"}`}
            >
              <Icon
                icon="material-symbols:settings-rounded"
                width={28}
                height={28}
              />
              <p className="text-base font-semibold">Pengaturan</p>
            </div>
            <nav className="mt-4">
              <ul className="flex flex-col space-y-2">
                {listSettings.map((menu) => {
                  const isDashboard = menu.href === basePath;
                  const isActive = isDashboard
                    ? pathname === basePath
                    : pathname.startsWith(menu.href);

                  return (
                    <li key={menu.href}>
                      <Link
                        href={menu.href}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl transition duration-300 ease-in-out ${
                          isActive
                            ? isDark
                              ? "bg-gray-700 font-bold text-white"
                              : "bg-white font-bold text-[#2B62C2]"
                            : isDark
                              ? "hover:bg-gray-600/50 text-gray-200"
                              : "hover:bg-white/20 text-white"
                        }`}
                      >
                        <Icon icon={menu.icon} fontSize={20} />
                        <span className="text-sm">{menu.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-full">{children}</div>
      </div>
    </div>
  );
}
