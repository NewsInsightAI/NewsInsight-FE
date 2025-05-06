"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const basePath = "/dashboard";

const listMenu = [
  { label: "Dasbor", href: `${basePath}`, icon: "mynaui:home-solid" },
  { label: "Berita", href: `${basePath}/news`, icon: "ph:newspaper" },
  {
    label: "Kategori",
    href: `${basePath}/categories`,
    icon: "iconamoon:category",
  },
  {
    label: "Komentar",
    href: `${basePath}/comments`,
    icon: "fluent:chat-24-regular",
  },
  {
    label: "Pengguna",
    href: `${basePath}/users`,
    icon: "solar:user-outline",
  },
];

export default function NavbarDashboard() {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      id="navbar-dashboard"
      className={`flex justify-between items-center p-4 fixed top-0 w-full px-8 z-50 bg-[#1A1A1A] text-white`}
    >
      <Link href="/" className={`text-lg font-bold px-6 py-2 rounded-full`}>
        <Image
          src="/images/newsinsight-icon.png"
          alt="Logo"
          width={36}
          height={36}
          className="inline-block mr-2"
        />
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
          NewsInsight
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <ul className="flex space-x-2">
          {listMenu.map((menu) => (
            <li key={menu.label}>
              <Link
                href={menu.href}
                className={`flex items-center gap-2 text-white px-5 py-3 rounded-full ${
                  pathname === menu.href
                    ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] font-bold"
                    : "bg-[#2C2C2C]"
                }`}
              >
                <Icon icon={menu.icon} fontSize={20} />
                <p className="text-sm">{menu.label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src="/images/profile.jpeg"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-sm font-semibold">Rigel Ramadhani W.</p>
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#6366F1] to-[#393B8B] px-3 py-1 rounded-full text-white">
              <Icon icon="eos-icons:admin" fontSize={14} />
              <p className="text-xs">Admin</p>
            </div>
          </div>
          <Icon
            icon="majesticons:chevron-down-line"
            fontSize={16}
            color="white"
          />
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              key="profile-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-3 z-50"
            >
              <ul className="text-sm text-black">
                <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                  <Icon icon="iconamoon:profile-fill" fontSize={18} />
                  Profil Saya
                </li>
                <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                  <Icon
                    icon="material-symbols:settings-rounded"
                    fontSize={18}
                  />
                  Pengaturan Akun
                </li>
                <li className="px-5 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                  <Icon icon="ic:round-dark-mode" fontSize={18} />
                  Mode Gelap
                </li>
                <li className="px-5 py-2 hover:bg-red-100 text-red-500 cursor-pointer flex items-center gap-2">
                  <Icon icon="solar:logout-2-bold" fontSize={18} />
                  Keluar
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
