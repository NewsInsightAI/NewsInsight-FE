"use client";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useToast } from "@/context/ToastProvider";

export default function ForgotPassword(props: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { promise } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await promise(
      (async () => {
        const res = await fetch("/api/auth/request-reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          
          if (data?.error?.code === "GOOGLE_AUTH_NO_PASSWORD") {
            throw new Error("Akun ini terdaftar melalui Google. Untuk masuk, silakan gunakan tombol 'Masuk dengan Google'.");
          }
          throw new Error(
            data?.message || "Gagal mengirim link reset password."
          );
        }
        setEmail("");
        
        props.onClose();
        return data;
      })(),
      {
        loading: "Mengirim link reset password...",
        success: () =>
          "Link reset password telah dikirim ke email Anda (cek folder spam jika tidak ditemukan).",
        error: (err) =>
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan. Silakan coba lagi.",
      }
    );
    setLoading(false);
  };

  const handleClose = () => {
    setEmail("");
    props.onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 text-black backdrop-blur-sm"
      style={{ zIndex: 1000 }}
    >
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[480px] max-w-[95%] text-center space-y-6">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <Icon icon="mdi:close" className="text-xl text-gray-500" />
        </button>

        <div className="flex items-center justify-center mx-auto w-16 h-16 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
          <Icon icon="mdi:forgot-password" className="text-4xl text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-1">Lupa Password</h2>
          <p className="text-gray-800 text-sm">
            Masukkan email Anda untuk mengatur ulang kata sandi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon icon="mdi:email" className="text-lg" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                placeholder="Masukkan email Anda..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
            <Icon icon="ph:paper-plane-tilt-fill" className="text-base" />
          </button>
        </form>
      </div>
    </div>
  );
}
