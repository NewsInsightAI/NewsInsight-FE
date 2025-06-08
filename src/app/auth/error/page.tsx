"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Ada masalah dengan konfigurasi server";
      case "AccessDenied":
        return "Login Google berhasil, namun backend server tidak tersedia. Anda dapat mencoba lagi nanti atau gunakan login email/password.";
      case "Verification":
        return "Link verifikasi tidak valid atau sudah kedaluwarsa";
      case "Default":
      default:
        return "Terjadi kesalahan saat proses autentikasi";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4"
      >
        <div className="text-center mb-6">
          <Icon
            icon="mdi:alert-circle"
            className="text-6xl text-red-500 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Autentikasi Gagal
          </h1>
          <p className="text-gray-600 mt-2">{getErrorMessage(error)}</p>
        </div>

        <div className="space-y-4">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Coba Masuk Lagi
            </motion.button>
          </Link>

          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border border-blue-500 text-blue-500 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Daftar Akun Baru
            </motion.button>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center">
              <Icon
                icon="line-md:loading-loop"
                className="text-4xl text-blue-500 mx-auto animate-spin"
              />
              <p className="mt-4 text-gray-600">Memuat halaman error...</p>
            </div>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
