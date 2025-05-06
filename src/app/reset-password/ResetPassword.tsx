"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import VerifyEmail from "../../components/popup/VerifyEmail";
import Breadcrumbs from "@/components/Breadcrumbs";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Atur Ulang Kata Sandi", isActive: true },
];

export default function ResetPassword() {
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
          <motion.div
            key="verify-email"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center"
          >
            <VerifyEmail onClose={() => setShowVerifyEmail(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-screen bg-white w-full text-black p-10 overflow-hidden">
        <div className="flex flex-1" style={{ paddingTop: navbarHeight }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-white px-14 py-12 rounded-3xl font-normal overflow-hidden flex justify-center items-center w-fit h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] z-0" />
            <div className="absolute inset-0 bg-black/20 z-10" />
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
            className="flex flex-col gap-4 items-center justify-start w-full h-full bg-white rounded-lg px-10 text-black"
          >
            <div className="flex w-full items-start">
              <Breadcrumbs items={breadcrumbsItems} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center mx-auto w-16 h-16 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] mb-3">
                <Icon
                  icon="mdi:password-reset"
                  className="text-4xl text-white"
                />
              </div>
              <h1 className="text-xl font-bold">Atur Ulang Kata Sandi</h1>
              <p className="text-gray-600 text-center mb-2">
                Atur ulang kata sandi Anda untuk mendapatkan akses kembali ke
                akun NewsInsight.
              </p>
            </div>

            <form className="flex flex-col gap-3 w-full">
              <div className="mb-4">
                <label className="block font-medium text-gray-800 mb-1">
                  Password Baru
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

              <div className="mb-4">
                <label className="block font-medium text-gray-800 mb-1">
                  Konfirmasi Password Baru
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
              <motion.button
                onClick={() => setShowVerifyEmail(true)}
                className="cursor-pointer text-white rounded-lg px-5 py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80"
              >
                Atur Ulang Kata Sandi
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
