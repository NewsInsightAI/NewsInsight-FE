"use client";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

export default function ForgotPassword(props: { onClose: () => void }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Kirim link reset ke:", email);
  };

  const handleClose = () => {
    setEmail("");
    props.onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 text-black bg-black/30 backdrop-blur-sm"
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
          <Icon icon="mdi:password-reset" className="text-4xl text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-1">Atur Ulang Password</h2>
          <p className="text-gray-800 text-sm">
            Masukkan password baru Anda untuk mengatur ulang kata sandi.
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
            className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
          >
            Kirim Link Reset
            <Icon icon="ph:paper-plane-tilt-fill" className="text-base" />
          </button>
        </form>
      </div>
    </div>
  );
}
