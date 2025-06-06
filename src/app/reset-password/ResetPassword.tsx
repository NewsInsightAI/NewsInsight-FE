"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion, AnimatePresence } from "framer-motion";
import VerifyEmail from "../../components/popup/VerifyEmail";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useToast } from "@/context/ToastProvider";
import { useRouter } from "next/navigation";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Atur Ulang Kata Sandi", isActive: true },
];

export default function ResetPassword() {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { promise, showToast } = useToast();
  const router = useRouter();

  
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<null | boolean>(null);
  const [tokenCheckLoading, setTokenCheckLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t);
    if (t) {
      setTokenCheckLoading(true);
      fetch("/api/auth/check-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.data?.valid) {
            setTokenValid(false);
            
            if (data?.error?.code === "GOOGLE_AUTH_NO_PASSWORD") {
              showToast(
                "Akun ini terdaftar melalui Google. Reset password tidak diperlukan. Silakan login menggunakan Google.",
                "error"
              );
            } else {
              showToast(
                data?.message || "Token tidak valid atau sudah expired",
                "error"
              );
            }
          } else {
            setTokenValid(true);
          }
        })
        .catch(() => {
          setTokenValid(false);
          showToast("Gagal memeriksa token reset password.", "error");
        })
        .finally(() => setTokenCheckLoading(false));
    } else {
      setTokenValid(false);
      setTokenCheckLoading(false);
    }
  }, [showToast]);

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

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast("Token reset password tidak ditemukan.", "error");
      return;
    }
    if (tokenValid === false) {
      showToast("Token tidak valid atau sudah expired.", "error");
      return;
    }
    if (!password || !confirmPassword) {
      showToast("Mohon isi semua field.", "error");
      return;
    }
    if (password.length < 8) {
      showToast("Password minimal 8 karakter.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Konfirmasi password tidak cocok.", "error");
      return;
    }
    setLoading(true);
    try {
      await promise(
        fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }).then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            
            if (data?.error?.code === "GOOGLE_AUTH_NO_PASSWORD") {
              throw new Error("Akun ini terdaftar melalui Google. Reset password tidak diperlukan. Silakan login menggunakan Google.");
            }
            throw new Error(data?.message || "Gagal reset password.");
          }
          return data;
        }),
        {
          loading: "Mengatur ulang password...",
          success:
            "Password berhasil diubah! Silakan login dengan password baru.",
          error: (err) =>
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan. Silakan coba lagi.",
        }
      );
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      
    } finally {
      setLoading(false);
    }
  };

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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 items-center justify-start w-full h-full bg-white rounded-lg px-4 text-black"
          >
            <div className="flex w-full items-start">
              <Breadcrumbs items={breadcrumbsItems} />
            </div>

            {tokenCheckLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-10">
                <Icon
                  icon="line-md:loading-loop"
                  className="text-3xl animate-spin mb-2"
                />
                <span className="text-gray-500">
                  Memeriksa token reset password...
                </span>
              </div>
            ) : tokenValid === false ? (
              <div className="w-full flex flex-col h-full items-center justify-center gap-3 p-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-2">
                    <Icon
                      icon="line-md:alert-circle"
                      className="text-4xl text-red-500"
                    />
                  </div>
                  <span className="text-red-600 font-bold text-lg text-center">
                    Token tidak valid atau sudah expired
                  </span>
                  <span className="text-gray-500 text-sm text-center mt-1">
                    Link reset password yang Anda gunakan sudah tidak berlaku.
                    <br />
                    Silakan lakukan permintaan reset password ulang melalui
                    halaman login.
                  </span>
                </div>
                <button
                  className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold hover:opacity-90 transition"
                  onClick={() => router.push("/login")}
                >
                  Kembali ke Login
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-3 w-full"
                onSubmit={handleSubmit}
              >
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Icon icon="lucide:eye-off" />
                      ) : (
                        <Icon icon="lucide:eye" />
                      )}
                    </button>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer text-white rounded-lg px-5 py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80 disabled:opacity-60"
                >
                  {loading ? "Mengatur Ulang..." : "Atur Ulang Kata Sandi"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
