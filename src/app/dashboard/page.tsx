import React from "react";
import Home from "./Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda - Dashboard - NewsInsight",
  description: "Lihat berita terbaru dan kelola berita Anda di NewsInsight.",
};

export default function HomePage() {
  return <Home />;
}
