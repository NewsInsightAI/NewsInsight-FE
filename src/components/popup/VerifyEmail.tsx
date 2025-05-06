"use client";
import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";

export default function VerifyEmail(props: { onClose: () => void }) {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;
    const newCode = [...code];
    newCode[index] = value[0];
    setCode(newCode);
    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleClose = () => {
    setCode(Array(6).fill(""));
    props.onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 text-black"
      style={{ zIndex: 1000 }}
    >
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[480px] max-w-[95%] text-center space-y-6">
        {/* Tombol silang */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <Icon icon="mdi:close" className="text-xl text-gray-500" />
        </button>

        {/* Icon bulat gradasi */}
        <div className="flex items-center justify-center mx-auto w-16 h-16 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
          <Icon icon="fluent:chat-24-filled" className="text-4xl text-white" />
        </div>

        {/* Judul & info email */}
        <div>
          <h2 className="text-xl font-bold mb-1">Verifikasi Email</h2>
          <p className="text-gray-800 text-sm">
            Kami telah mengirimkan email yang berisi 6 digit kode verifikasi ke{" "}
            <span className="font-semibold">rigel@gmail.com</span>
          </p>
        </div>

        {/* Input 6 digit kode */}
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition 
              ${
                digit ? "border-blue-400" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-300`}
            />
          ))}
        </div>

        {/* Tombol Verifikasi */}
        <button className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer">
          Verifikasi
          <Icon icon="ph:paper-plane-tilt-fill" className="text-base" />
        </button>

        {/* Kirim ulang */}
        <p className="text-sm text-gray-500">
          Tidak menerima email?{" "}
          <button className="text-blue-500 hover:underline font-medium cursor-pointer">
            Kirim ulang
          </button>
        </p>
      </div>
    </div>
  );
}
