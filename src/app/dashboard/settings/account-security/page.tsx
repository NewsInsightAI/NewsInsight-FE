import React from "react";
import Settings from "./AccountSecurity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Komentar - NewsInsight",
  description: "Kelola komentar berita yang telah diunggah di NewsInsight.",
};

export default function SettingsPage() {
  return <Settings />;
}
