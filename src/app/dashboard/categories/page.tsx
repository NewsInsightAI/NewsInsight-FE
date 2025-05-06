import React from "react";
import Categories from "./Categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Kategori - NewsInsight",
  description: "Kelola kategori berita yang telah diunggah di NewsInsight.",
};

export default function CategoriesPage() {
  return <Categories />;
}
