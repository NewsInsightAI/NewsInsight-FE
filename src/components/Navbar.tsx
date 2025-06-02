"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export const Navbar = () => {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  let bgColor = "white text-black";
  if (pathname === "/profile") {
    bgColor = "transparent text-white";
  } else {
    bgColor = "bg-white text-black shadow-md";
  }

  return (
    <nav
      id="navbar"
      className={`flex flex-col md:flex-row justify-start gap-2 md:gap-4 items-center p-4 fixed top-0 w-full px-4 md:px-8 z-50 ${bgColor}`}
    >
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-4 md:gap-10">
          {/* Logo + Hamburger (mobile) dalam satu div */}
          <div className="flex items-center gap-2 md:gap-0">
            {/* Hamburger menu for mobile, posisinya di samping logo */}
            <button
              className="md:hidden flex items-center px-2 py-1 ml-1"
              aria-label="Menu"
              onClick={() => setShowMobileMenu((v) => !v)}
            >
              <Icon icon="mingcute:menu-fill" className="text-2xl" />
            </button>
            <Link
              href="/"
              className={`text-lg font-bold md:px-6 py-2 rounded-full ${
                pathname === "/profile" ? "bg-white" : ""
              }`}
            >
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
          </div>
          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-10">
            <li>
              <div className="hover:text-gray-400 flex items-center gap-2 cursor-pointer">
                <div>Kategori</div>
                <Icon icon="mingcute:down-line" className="inline-block" />
              </div>
            </li>
            <li>
              <a href="/about-us" className="hover:text-gray-400">
                Tentang Kami
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          {/* Hide language and dark mode on mobile */}
          <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-gray-400">
            <p>ID</p>
            <Icon icon="mingcute:down-line" className="inline-block" />
          </div>
          <button className="hidden md:block">
            <Icon
              icon="material-symbols:dark-mode-rounded"
              className="text-2xl"
            />
          </button>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-4 md:px-5 py-2 md:py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base"
          >
            <p>Masuk</p>
            <Icon
              icon="majesticons:login"
              fontSize={20}
              className="inline-block"
            />
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay with framer-motion animation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[64px] z-40 bg-black/40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.25, type: "spring", bounce: 0.2 }}
              className="absolute left-0 right-0 top-0 bg-white text-black shadow-lg rounded-b-2xl flex flex-col gap-2 py-4 px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href="/"
                className="py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Beranda
              </Link>
              <Link
                href="/about-us"
                className="py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Tentang Kami
              </Link>
              <div className="py-2 flex items-center gap-2">
                <span>Kategori</span>
                <Icon icon="mingcute:down-line" />
              </div>
              <Link
                href="/login"
                className="py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Masuk
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search bar: mobile di bawah, desktop di tengah */}
      <div className="w-full md:w-[280px] mx-auto mt-2 md:mt-0 order-2 md:order-none">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cari berita..."
            className={`w-full px-5 md:px-6 py-2.5 md:py-3 border border-[#E2E2E2] rounded-full placeholder:text-[#818181] text-sm md:text-base ${
              pathname === "/profile" ? "bg-white" : ""
            }`}
          />
          <Icon
            icon="material-symbols:search-rounded"
            fontSize={22}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
          />
        </div>
      </div>
    </nav>
  );
};
