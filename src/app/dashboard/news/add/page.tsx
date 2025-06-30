import React from "react";
import AddEditNews from "./AddEditNews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Berita - NewsInsight",
  description: "Tambahkan berita baru ke dalam daftar berita di NewsInsight.",
};

export default function AddNewsPage() {
  return <AddEditNews mode="add" />;
}
