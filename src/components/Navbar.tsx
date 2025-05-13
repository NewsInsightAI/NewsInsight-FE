"use client";
import Image from "next/image";
import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  let bgColor = "white text-black";
  if (pathname === "/profile") {
    bgColor = "transparent text-white";
  } else {
    bgColor = "bg-white text-black shadow-md";
  }

  return (
    <nav
      id="navbar"
      className={`flex justify-start gap-4 items-center p-4 fixed top-0 w-full px-8 z-50 ${bgColor}`}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className={`text-lg font-bold px-6 py-2 rounded-full ${
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
          <ul className="flex space-x-10">
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

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-400">
            <p>ID</p>
            <Icon icon="mingcute:down-line" className="inline-block" />
          </div>
          <button>
            <Icon
              icon="material-symbols:dark-mode-rounded"
              className="text-2xl"
            />
          </button>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-5 py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer"
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

      <div className="flex items-center justify-center w-[280px] mx-auto">
        <div className={`relative w-full `}>
          <input
            type="text"
            placeholder="Cari berita..."
            className={`w-full px-6 py-3 border border-[#E2E2E2] rounded-full placeholder:text-[#818181] ${
              pathname === "/profile" ? "bg-white" : ""
            }`}
          />
          <Icon
            icon="material-symbols:search-rounded"
            fontSize={24}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
          />
        </div>
      </div>
    </nav>
  );
};
