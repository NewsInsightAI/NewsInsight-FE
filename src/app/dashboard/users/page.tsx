import React from "react";
import type { Metadata } from "next";
import Users from "./Users";

export const metadata: Metadata = {
  title: "Daftar Kategori - NewsInsight",
  description: "Kelola kategori berita yang telah diunggah di NewsInsight.",
};

export default function UsersPage() {
  return <Users />;
}
