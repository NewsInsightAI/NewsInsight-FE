/* eslint-disable @next/next/no-img-element */
"use client";
import { Sora } from "next/font/google";
import Link from "next/link";
import { useDarkMode } from "../context/DarkModeContext";

const SoraFont = Sora({ subsets: ["latin"] });

export default function NotFound() {
  const { isDark } = useDarkMode();

  return (
    <div
      className={`${
        isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
      } flex flex-col items-center justify-center min-h-screen text-center p-10 transition-colors duration-300 ${SoraFont.className}`}
    >
      <img
        src="/images/404.svg"
        alt="404 Illustration"
        className="w-64 h-auto mb-6"
      />

      <p
        className={`text-lg mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
      >
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <Link
        href="/"
        className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
          isDark
            ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] hover:from-[#2DD4FF] hover:to-[#4F46E5] text-white shadow-lg hover:shadow-xl"
            : "bg-[#38A7F8] hover:bg-[#2B8CE6] text-white"
        }`}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
