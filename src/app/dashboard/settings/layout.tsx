"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

const basePath = "/dashboard/settings";

const listSettings = [
  {
    label: "Profil",
    icon: "fluent:person-12-filled",
    href: "/dashboard/settings/profile",
  },
  {
    label: "Data Pribadi",
    icon: "solar:document-bold",
    href: "/dashboard/settings/personal-data",
  },
  {
    label: "Akun & Keamanan",
    icon: "mdi:account-cog",
    href: "/dashboard/settings/account-security",
  },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const pathname = usePathname();

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
      className="flex gap-6 justify-center items-start bg-white text-black rounded-4xl w-full p-6"
      style={{ height: `calc(100vh - ${navbarHeight}px)` }}
    >
      <div className="flex flex-col justify-start items-start gap-3 h-full">
        <div className="bg-gradient-to-br from-[#2FAACC] to-[#2B62C2] p-4 rounded-2xl h-full min-w-[240px]">
          <div className="flex items-center w-full gap-2.5 text-white pb-3 border-b border-white/30">
            <Icon
              icon="material-symbols:settings-rounded"
              width={28}
              height={28}
            />
            <p className="text-base font-semibold">Pengaturan</p>
          </div>
          <div className="flex flex-col gap-2.5 mt-4">
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
                      className={`flex items-center gap-2 px-5 py-3 rounded-full ${
                        isActive
                          ? "bg-white rounded-xl font-bold text-[#2B62C2]"
                          : "hover:bg-white/20 transition duration-300 ease-in-out rounded-xl text-white"
                      }`}
                    >
                      <Icon icon={menu.icon} fontSize={20} />
                      <p className="text-sm">{menu.label}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
