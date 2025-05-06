import React from "react";
import ResetPassword from "./ResetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atur Ulang Kata Sandi - NewsInsight",
  description:
    "Atur ulang kata sandi Anda untuk mendapatkan akses kembali ke akun NewsInsight.",
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
