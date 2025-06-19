import React, { Suspense } from "react";
import ResetPassword from "./ResetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atur Ulang Kata Sandi - NewsInsight",
  description:
    "Atur ulang kata sandi Anda untuk mendapatkan akses kembali ke akun NewsInsight.",
};

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPassword />
    </Suspense>
  );
}
