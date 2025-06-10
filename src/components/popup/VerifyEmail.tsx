"use client";
import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { useToast } from "@/context/ToastProvider";
import { useRouter } from "next/navigation";

interface VerifyEmailProps {
  onClose: () => void;
  email?: string;
  userId?: number;
  onVerificationComplete?: () => void;
  isFromRegister?: boolean;
}

export default function VerifyEmail(props: VerifyEmailProps) {
  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const { showToast } = useToast();
  const router = useRouter();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newCode = [...code];

    if (value) {
      newCode[index] = value[value.length - 1];
      setCode(newCode);

      if (index < 5 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      newCode[index] = "";
      setCode(newCode);
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (pasteData.length <= 6) {
      const newCode = Array(6).fill("");
      for (let i = 0; i < pasteData.length; i++) {
        newCode[i] = pasteData[i];
      }
      setCode(newCode);

      const lastFilledIndex = Math.min(pasteData.length - 1, 5);
      inputsRef.current[lastFilledIndex]?.focus();
    }
  };

  const handleClose = () => {
    setCode(Array(6).fill(""));
    props.onClose();
  };

  const handleVerify = async () => {
    if (code.some((c) => !c)) {
      showToast("Kode verifikasi harus 6 digit.", "error");
      return;
    }
    setLoading(true);
    try {
      console.log("Verifying code:", code.join(""));
      console.log("User ID:", props.userId);
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: props.userId,
          otp: code.join(""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      if (!res.ok) {
        showToast(data?.message || "Verifikasi gagal.", "error");
        return;
      }
      if (props.onVerificationComplete) {
        props.onVerificationComplete();
      } else {
        showToast("Email berhasil diverifikasi! Silakan login.", "success");

        // Jika dari register page, redirect ke login page
        if (props.isFromRegister) {
          handleClose();
          setTimeout(() => {
            router.push("/login");
          }, 1000); // Delay untuk memberi waktu toast muncul
          return;
        }
      }

      handleClose();
    } catch {
      setLoading(false);
      showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
    }
  };

  const handleResend = async () => {
    if (!props.userId) return;
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: props.userId }),
      });
      const data = await res.json().catch(() => ({}));
      setResendLoading(false);
      if (!res.ok) {
        showToast(data?.message || "Gagal mengirim ulang kode.", "error");
        return;
      }
      showToast("Kode verifikasi berhasil dikirim ulang!", "success");
    } catch {
      setResendLoading(false);
      showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
    }
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
            Kami telah mengirimkan email yang berisi 6 digit kode verifikasi ke
            <span className="font-semibold"> {props.email || "-"}</span>
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
              onPaste={handlePaste}
              className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition 
              ${digit ? "border-blue-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-300`}
              disabled={loading}
            />
          ))}
        </div>

        {/* Tombol Verifikasi */}
        <button
          className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer disabled:opacity-60"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Memverifikasi..." : "Verifikasi"}
          <Icon icon="ph:paper-plane-tilt-fill" className="text-base" />
        </button>

        {/* Kirim ulang */}
        <p className="text-sm text-gray-500">
          Tidak menerima email?{" "}
          <button
            className="text-blue-500 hover:underline font-medium cursor-pointer"
            disabled={loading || resendLoading}
            onClick={handleResend}
          >
            {resendLoading ? "Mengirim ulang..." : "Kirim ulang"}
          </button>
        </p>
      </div>
    </div>
  );
}
