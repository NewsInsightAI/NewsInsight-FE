"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import VerifyEmail from "../../components/popup/VerifyEmail";
import Breadcrumbs from "@/components/Breadcrumbs";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Daftar", isActive: true },
];

export default function Register() {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const advancedFeatures = [
    "Update berita real-time",
    "Komentar dan diskusi komunitas",
    "Bookmark berita favorit",
    "Personalisasi kategori berita",
  ];

  return (
    <>
      <AnimatePresence>
        {showVerifyEmail && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <VerifyEmail onClose={() => setShowVerifyEmail(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-screen bg-white w-full text-black p-6 overflow-hidden">
        <div className="flex flex-1" style={{ paddingTop: navbarHeight }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-white px-14 py-12 rounded-3xl font-normal overflow-hidden flex justify-center items-center w-fit h-full bg-gradient-to-br from-[#2FAACC] to-[#2B62C2]"
          >
            <div className="relative z-20 flex flex-col justify-between items-start w-full h-full">
              <div className="flex flex-col gap-4 items-start">
                <p className="font-bold text-2xl">Kenapa NewsInsight?</p>
                <ul className="flex flex-col gap-2 font-normal text-base">
                  {advancedFeatures.map((feature, index) => (
                    <li key={index}>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="akar-icons:check-box-fill"
                          className="text-2xl"
                        />
                        <p>{feature}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <Image
                src="/images/undraw_online-articles.png"
                alt="NewsInsight"
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 items-center justify-start w-full h-full bg-white rounded-lg pl-10 pr-6 py-6 text-black"
          >
            <div className="flex w-full items-start">
              <Breadcrumbs items={breadcrumbsItems} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold">Daftar Akun Baru</h1>
              <p className="text-gray-600 text-center mb-2">
                Kelola berita dan komentar Anda dengan mudah.
              </p>
            </div>

            <form className="flex flex-col gap-3 w-full">
              {/* Username */}
              <div className="mb-3">
                <label className="block font-medium text-gray-800 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Icon icon="fluent:person-28-filled" fontSize={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan username..."
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 pl-10 text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="block font-medium text-gray-800 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Icon icon="mage:email-opened-fill" fontSize={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="Masukkan email..."
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 pl-10 text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block font-medium text-gray-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Icon
                      icon="material-symbols:password-rounded"
                      fontSize={20}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password..."
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 pl-10 pr-10 text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <Icon icon="lucide:eye-off" />
                    ) : (
                      <Icon icon="lucide:eye" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Gunakan minimal 8 karakter dengan kombinasi huruf dan angka
                </p>
              </div>

              {/* Konfirmasi Password */}
              <div className="mb-3">
                <label className="block font-medium text-gray-800 mb-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Icon
                      icon="material-symbols:password-rounded"
                      fontSize={20}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan konfirmasi password..."
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 pl-10 pr-10 text-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <Icon icon="lucide:eye-off" />
                    ) : (
                      <Icon icon="lucide:eye" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="flex flex-col gap-2.5 items-center w-full">
              <p className="text-black/40 text-sm">
                Dengan melakukan pendaftaran, Anda setuju dengan{" "}
                <span className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] bg-clip-text text-transparent font-bold">
                  syarat & ketentuan
                </span>{" "}
                NewsInsight.
              </p>

              <motion.button
                onClick={() => setShowVerifyEmail(true)}
                className="cursor-pointer text-white rounded-lg px-5 py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80"
              >
                Daftar
              </motion.button>
            </div>

            <div className="flex flex-row gap-4 items-center w-full opacity-20">
              <hr className="border-t border-black w-full" />
              <p className="text-black text-sm">atau</p>
              <hr className="border-t border-black w-full" />
            </div>

            <motion.button
              className="w-full"
              onClick={() => alert("Google Sign In")}
            >
              <div className="flex flex-row gap-2 items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-5 py-3 transition duration-300 ease-in-out hover:opacity-80 cursor-pointer">
                <p className="text-black text-sm">Daftar dengan Google</p>
                <Icon icon="flat-color-icons:google" className="text-2xl" />
              </div>
            </motion.button>

            <p className="text-gray-500 text-sm text-center mt-4">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Masuk sekarang
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
