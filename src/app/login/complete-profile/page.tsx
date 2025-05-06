import React from "react";
import CompleteProfile from "./CompleteProfile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lengkapi Profil - NewsInsight",
  description:
    "Lengkapi profil Anda untuk mendapatkan pengalaman berita yang lebih baik.",
};

export default function CompleteProfilePage() {
  return <CompleteProfile />;
}
