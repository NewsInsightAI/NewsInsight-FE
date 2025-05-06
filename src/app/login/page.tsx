import React from "react";
import Login from "./Login";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - NewsInsight",
  description:
    "Masuk ke akun Anda untuk mengelola personalisasi berita dan komentar Anda.",
};

export default function LoginPage() {
  return <Login />;
}
