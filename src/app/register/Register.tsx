"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import VerifyEmail from "../../components/popup/VerifyEmail";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useToast } from "@/context/ToastProvider";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Daftar", isActive: true },
];

export default function Register() {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { promise, showToast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyEmailData, setVerifyEmailData] = useState<{
    email: string;
    userId: number;
  } | null>(null);
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Konfirmasi password tidak cocok.", "error");
      return;
    }
    setIsRegisterLoading(true);
    try {
      await promise(
        (async () => {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data?.message || "Registrasi gagal.");
          }
          setVerifyEmailData({ email: email, userId: data.data?.id });
          setShowVerifyEmail(true);
          return data;
        })(),
        {
          loading: "Mendaftarkan akun...",
          success: () => "Registrasi berhasil! Silakan verifikasi email Anda.",
          error: (err) =>
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan. Silakan coba lagi.",
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsRegisterLoading(false);
    }
  };
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      console.log("Starting Google sign up from register page...");

      const result = await signIn("google", {
        redirect: false,
      });

      console.log("Google sign up result:", result);

      if (result?.ok && !result?.error) {
        console.log("Google sign up successful, fetching session...");

        // Wait for session to be established
        let retries = 0;
        let session = null;

        while (retries < 5 && !session) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          session = await getSession();
          retries++;
          console.log(
            `Session check attempt ${retries}:`,
            session ? "found" : "not found"
          );
        }

        if (session && session.backendToken) {
          console.log("Session established successfully:", {
            email: session.user?.email,
            isNewUser: session.isNewUser,
            isProfileComplete: session.isProfileComplete,
          });

          const message = session.isNewUser
            ? "Selamat datang di NewsInsight! Akun Anda berhasil didaftarkan."
            : "Anda sudah terdaftar sebelumnya. Selamat datang kembali!";

          showToast(message, "success"); // Redirect based on profile completion
          if (session.isNewUser && !session.isProfileComplete) {
            console.log("New user, redirecting to complete profile");
            router.push("/login/complete-profile");
          } else {
            console.log("Redirecting based on user role");
            const userRole = session?.backendUser?.role;
            if (userRole === "user") {
              router.push("/"); // User biasa ke homepage
            } else {
              router.push("/dashboard"); // Admin/Editor/Contributor ke dashboard
            }
          }
        } else {
          console.error("No valid session found after Google sign up");
          showToast(
            "Terjadi kesalahan saat menyimpan data akun. Silakan coba lagi.",
            "error"
          );
        }
      } else if (result?.error) {
        console.error("Google sign up error:", result.error);
        if (result.error === "AccessDenied") {
          showToast("Registrasi dengan Google dibatalkan.", "error");
        } else if (result.error === "Callback") {
          showToast(
            "Terjadi kesalahan dalam proses autentikasi. Silakan coba lagi.",
            "error"
          );
        } else {
          showToast(`Gagal mendaftar dengan Google: ${result.error}`, "error");
        }
      } else {
        console.error("Unknown error during Google sign up");
        showToast("Terjadi kesalahan yang tidak diketahui.", "error");
      }
    } catch (error) {
      console.error("Error during Google sign up:", error);
      showToast("Terjadi kesalahan saat mendaftar dengan Google.", "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
              {" "}
              <VerifyEmail
                onClose={() => setShowVerifyEmail(false)}
                isFromRegister={true}
                {...(verifyEmailData
                  ? {
                      email: verifyEmailData.email,
                      userId: verifyEmailData.userId,
                    }
                  : {})}
              />
            </motion.div>
          </div>
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
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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

          {/* Panel Kanan: Form Register */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 items-center justify-start w-full mx-auto h-full bg-white rounded-lg px-4 md:pl-10 md:pr-6 py-6 text-black"
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
            <form
              className="flex flex-col gap-3 w-full"
              onSubmit={handleSubmit}
            >
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isRegisterLoading}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isRegisterLoading}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isRegisterLoading}
                  />{" "}
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
                  </div>{" "}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan konfirmasi password..."
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 pl-10 pr-10 text-gray-700 focus:outline-none focus:border-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isRegisterLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    disabled={isRegisterLoading}
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
              <p className="text-black/40 text-sm text-justify">
                Dengan melakukan pendaftaran, Anda setuju dengan{" "}
                <span className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] bg-clip-text text-transparent font-bold">
                  syarat & ketentuan
                </span>{" "}
                NewsInsight.
              </p>{" "}
              <motion.button
                onClick={handleSubmit}
                className="cursor-pointer text-white rounded-lg px-5 py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? (
                  <Icon
                    icon="line-md:loading-loop"
                    className="text-xl animate-spin mx-auto"
                  />
                ) : (
                  "Daftar"
                )}
              </motion.button>
            </div>
            <div className="flex flex-row gap-4 items-center w-full opacity-20">
              <hr className="border-t border-black w-full" />
              <p className="text-black text-sm">atau</p>
              <hr className="border-t border-black w-full" />
            </div>{" "}
            <motion.button
              className="w-full"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            >
              <div className="flex flex-row gap-2 items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-5 py-3 transition duration-300 ease-in-out hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isGoogleLoading ? (
                  <Icon
                    icon="line-md:loading-loop"
                    className="text-2xl animate-spin"
                  />
                ) : (
                  <>
                    <p className="text-black text-sm">Daftar dengan Google</p>
                    <Icon icon="flat-color-icons:google" className="text-2xl" />
                  </>
                )}
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
      {/* Panel Kiri: Kenapa NewsInsight? (hidden di mobile) */}
    </>
  );
}
