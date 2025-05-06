import React from "react";
import Register from "./Register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar - NewsInsight",
  description:
    "Daftar untuk mendapatkan berita terbaru dan fitur menarik dari NewsInsight.",
};

export default function RegisterPage() {
  return <Register />;
}
