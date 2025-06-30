"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import VerifyEmail from "../../components/popup/VerifyEmail";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useToast } from "@/context/ToastProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Atur Ulang Kata Sandi", isActive: true },
];

export default function ResetPassword() {
  const { isDark } = useDarkMode();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { promise, showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

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

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setErrorMessage("Token reset password tidak ditemukan dalam URL.");
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.status === "success" && result.data.valid) {
          setTokenValid(true);
        } else {
          setErrorMessage(
            result.message || "Token tidak valid atau telah kedaluwarsa."
          );
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setErrorMessage("Terjadi kesalahan saat memvalidasi token.");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast("Semua field wajib diisi.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Konfirmasi password tidak cocok.", "error");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      showToast(
        "Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.",
        "error"
      );
      return;
    }

    setIsLoading(true);

    try {
      await promise(
        (async () => {
          const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || "Gagal mengatur ulang password.");
          }

          setTimeout(() => {
            router.push("/login");
          }, 2000);

          return result;
        })(),
        {
          loading: "Mengatur ulang password...",
          success: () =>
            "Password berhasil diatur ulang! Mengarahkan ke halaman login...",
          error: (err) =>
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan. Silakan coba lagi.",
        }
      );
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div
        style={{
          paddingTop:
            typeof window !== "undefined" && window.innerWidth < 768
              ? navbarHeight
              : navbarHeight + 20,
        }}
        className={`flex flex-col md:flex-row min-h-screen w-full ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"} p-4 md:p-6 overflow-y-auto overflow-x-hidden`}
      >
        {" "}
        {/* Left Panel - Image/Illustration (Hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex relative text-white px-8 lg:px-14 py-8 lg:py-12 rounded-3xl font-normal overflow-hidden justify-center items-center w-fit min-h-full bg-gradient-to-br from-[#2FAACC] to-[#2B62C2]"
        >
          <div className="relative z-20 flex flex-col justify-between items-start w-full h-full">
            <div className="flex flex-col gap-3 lg:gap-4 items-start">
              <p className="font-bold text-xl lg:text-2xl">
                Keamanan Akun Terjamin
              </p>
              <p className="text-blue-100 text-base lg:text-lg">
                Atur ulang kata sandi Anda dengan aman dan mudah
              </p>
            </div>

            {/* Gambar dinamis, responsive */}
            <div className="relative w-full h-24 md:h-32 lg:h-40 xl:h-64 mt-4 lg:mt-6">
              <Image
                src="/images/undraw_secure-login.svg"
                alt="Reset Password Illustration"
                fill
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </motion.div>
        {/* Right Panel - Form */}
        <div className="flex flex-1 w-full items-start md:items-center justify-center min-h-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`flex flex-col gap-4 items-start md:items-center justify-start w-full mx-auto h-full ${isDark ? "text-white" : "text-black"} px-4 md:px-6 lg:px-10 py-6`}
          >
            <Breadcrumbs items={breadcrumbsItems} />
            {isValidating ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-8 md:py-12 space-y-4 px-4"
              >
                <Icon
                  icon="eos-icons:loading"
                  className={`text-3xl md:text-4xl ${isDark ? "text-white" : "text-gray-800"} animate-spin`}
                />
                <p
                  className={`${isDark ? "text-gray-300" : "text-gray-600"} text-sm md:text-base text-center`}
                >
                  Memvalidasi token...
                </p>
              </motion.div>
            ) : !tokenValid ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-8 md:py-12 space-y-4 px-4"
              >
                <div className="p-3 bg-red-100 rounded-full">
                  <Icon
                    icon="mdi:alert-circle"
                    className="text-2xl md:text-3xl text-red-600"
                  />
                </div>
                <div className="text-center max-w-md">
                  <h1
                    className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-gray-800"} mb-2`}
                  >
                    Token Tidak Valid
                  </h1>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-gray-600"} mb-4 text-sm md:text-base px-2`}
                  >
                    {errorMessage}
                  </p>
                  <motion.button
                    onClick={() => router.push("/")}
                    className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-lg font-medium hover:opacity-90 transition text-sm md:text-base"
                  >
                    Kembali ke Beranda
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <>
                {" "}
                <div className="flex flex-col items-start md:items-center gap-1 mb-2">
                  <h1 className="text-lg md:text-xl font-bold text-left md:text-center">
                    Atur Ulang Kata Sandi
                  </h1>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-gray-600"} text-left md:text-center text-sm md:text-base px-0 md:px-2`}
                  >
                    Atur ulang kata sandi Anda untuk mendapatkan akses kembali
                    ke akun NewsInsight.
                  </p>
                </div>{" "}
                <form
                  className="flex flex-col gap-3 w-full"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3 md:mb-4">
                    <label
                      className={`block font-medium ${isDark ? "text-gray-200" : "text-gray-800"} mb-1 text-sm md:text-base`}
                    >
                      Password Baru
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? "text-gray-400" : "text-gray-400"}`}
                      >
                        <Icon
                          icon="material-symbols:password-rounded"
                          fontSize={18}
                          className="md:text-xl"
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password..."
                        className={`w-full border ${isDark ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-400" : "border-gray-300 bg-white text-gray-700 placeholder-gray-500 focus:border-blue-500"} rounded-lg py-2.5 md:py-3 px-3 pl-10 md:pl-12 pr-10 md:pr-12 focus:outline-none transition-colors duration-200 text-sm md:text-base`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"} transition-colors duration-200`}
                      >
                        <Icon
                          icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                          fontSize={18}
                          className="md:text-xl"
                        />
                      </button>
                    </div>
                    <p
                      className={`mt-1 text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Gunakan minimal 8 karakter dengan kombinasi huruf dan
                      angka
                    </p>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <label
                      className={`block font-medium ${isDark ? "text-gray-200" : "text-gray-800"} mb-1 text-sm md:text-base`}
                    >
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? "text-gray-400" : "text-gray-400"}`}
                      >
                        <Icon
                          icon="material-symbols:password-rounded"
                          fontSize={18}
                          className="md:text-xl"
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan konfirmasi password..."
                        className={`w-full border ${isDark ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-400" : "border-gray-300 bg-white text-gray-700 placeholder-gray-500 focus:border-blue-500"} rounded-lg py-2.5 md:py-3 px-3 pl-10 md:pl-12 pr-10 md:pr-12 focus:outline-none transition-colors duration-200 text-sm md:text-base`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"} transition-colors duration-200`}
                      >
                        <Icon
                          icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                          fontSize={18}
                          className="md:text-xl"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 items-center w-full">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="cursor-pointer text-white rounded-lg px-4 md:px-5 py-2.5 md:py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base font-medium"
                    >
                      {isLoading ? (
                        <>
                          <Icon
                            icon="eos-icons:loading"
                            width={18}
                            height={18}
                            className="md:w-5 md:h-5 animate-spin"
                          />
                          <span className="hidden sm:inline">Memproses...</span>
                          <span className="sm:hidden">Loading...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">
                            Atur Ulang Password
                          </span>
                          <span className="sm:hidden">Reset Password</span>
                          <Icon
                            icon="material-symbols:lock-reset"
                            width={18}
                            height={18}
                            className="md:w-5 md:h-5"
                          />
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => router.push("/login")}
                      className={`cursor-pointer rounded-lg px-4 md:px-5 py-2.5 md:py-3 w-full border ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"} transition duration-300 ease-in-out flex items-center justify-center gap-2 text-sm md:text-base`}
                    >
                      <span className="hidden sm:inline">Kembali ke Login</span>
                      <span className="sm:hidden">Login</span>
                      <Icon
                        icon="material-symbols:arrow-back"
                        width={18}
                        height={18}
                        className="md:w-5 md:h-5"
                      />
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Verify Email Popup */}
      <AnimatePresence>
        {showVerifyEmail && (
          <motion.div
            key="verify-email"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          >
            <VerifyEmail onClose={() => setShowVerifyEmail(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
