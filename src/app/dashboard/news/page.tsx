import React from "react";
import News from "./News";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Berita - NewsInsight",
  description: "Kelola daftar berita yang telah diunggah di NewsInsight.",
};

export default function NewsPage() {
  return <News />;
}
