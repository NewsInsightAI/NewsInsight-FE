"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4"
      >
        <div className="text-center mb-6">
          <Icon
            icon="mdi:account-circle"
            className="text-6xl text-blue-500 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Akses Diperlukan</h1>
          <p className="text-gray-600 mt-2">
            Silakan masuk atau daftar untuk melanjutkan
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Masuk ke Akun
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
