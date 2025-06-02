"use client";
import React, { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ForgotPassword from "@/components/popup/ForgotPassword";
import VerifyEmail from "@/components/popup/VerifyEmail";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useToast } from "@/context/ToastProvider";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Masuk", isActive: true },
];

export default function Login() {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { promise } = useToast();
  const [verifyEmailData, setVerifyEmailData] = useState<{
    email: string;
    userId: number;
  } | null>(null);

  useEffect(() => {
    const navbar = document.querySelector("#navbar");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      const navbar = document.querySelector("#navbar");
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    // Observer untuk perubahan ukuran navbar
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

  const advancedFeatures = [
    "Update berita real-time",
    "Komentar dan diskusi komunitas",
    "Bookmark berita favorit",
    "Personalisasi kategori berita",
  ];

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await promise(
      (async () => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (data?.status === "unverified") {
            setVerifyEmailData({ email: data.email, userId: data.userId });
            setShowVerifyEmail(true);
            return;
          }
          throw new Error(data?.message || "Login gagal.");
        }
        // TODO: handle successful login (redirect, save token, etc)
        return data;
      })(),
      {
        loading: "Sedang login...",
        success: () => "Login berhasil!",
        error: (err) =>
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan. Silakan coba lagi.",
      }
    );
  };

  return (
    <>
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center"
          >
            <ForgotPassword onClose={() => setShowForgotPassword(false)} />
          </motion.div>
        )}
        {showVerifyEmail && (
          <motion.div
            key="verify-email"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center"
          >
            <VerifyEmail
              onClose={() => setShowVerifyEmail(false)}
              {...(verifyEmailData
                ? {
                    email: verifyEmailData.email,
                    userId: verifyEmailData.userId,
                  }
                : {})}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div
        style={{
          paddingTop:
            typeof window !== "undefined" && window.innerWidth < 768
              ? navbarHeight
              : navbarHeight + 20,
        }}
        className="flex flex-col md:flex-row h-full w-full bg-white text-black p-4 md:p-6 overflow-y-auto"
      >
        <div className="flex flex-1 w-full md:w-auto items-center justify-center">
          <motion.div
            className="flex flex-col gap-6 items-center justify-start w-full h-full bg-white rounded-lg px-4 md:pl-6 md:pr-10 py-6 text-black shadow-md md:shadow-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex w-full items-start">
              <Breadcrumbs items={breadcrumbsItems} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold">Masuk ke Akun Anda</h1>
              <p className="text-gray-600 text-center mb-2">
                Kelola berita dan komentar Anda dengan mudah.
              </p>
            </div>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
              <Input
                label="Username atau Email"
                placeholder="Masukkan username atau email..."
                type="text"
                icon="mage:email-opened-fill"
                value={email}
                onChangeValue={setEmail}
              />
              <Input
                label="Password"
                placeholder="Masukkan password..."
                type="password"
                icon="material-symbols:password-rounded"
                value={password}
                onChangeValue={setPassword}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer text-white rounded-lg px-5 py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80"
              >
                Masuk
              </motion.button>
            </form>
            <div className="flex flex-col gap-2.5 items-end w-full">
              <p
                onClick={() => setShowForgotPassword(true)}
                className="text-gray-500 text-sm cursor-pointer"
              >
                Lupa password?
              </p>
            </div>
            <div className="flex flex-row gap-4 items-center w-full opacity-20">
              <hr className="border-t border-black w-full" />
              <p className="text-black text-sm">atau</p>
              <hr className="border-t border-black w-full" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
              onClick={() => alert("Google Sign In")}
            >
              <div className="flex flex-row gap-2 items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-5 py-3 transition duration-300 ease-in-out hover:opacity-80 cursor-pointer">
                <p className="text-black text-sm">Masuk dengan Google</p>
                <Icon icon="flat-color-icons:google" className="text-2xl" />
              </div>
            </motion.button>
            <p className="text-gray-500 text-sm text-center mt-4">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Panel kanan hanya tampil di md ke atas, layout desktop kembali ke semula */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden md:flex relative text-white px-14 py-12 rounded-3xl font-normal overflow-hidden justify-center items-center w-fit h-full bg-gradient-to-br from-[#2FAACC] to-[#2B62C2]"
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

            {/* Gambar dinamis, responsive */}
            <div className="relative w-full h-40 md:h-60 lg:h-80 mt-6">
              <Image
                src="/images/undraw_online-articles.png"
                alt="NewsInsight"
                fill
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
