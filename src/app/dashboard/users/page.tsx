import React from "react";
import type { Metadata } from "next";
import Users from "./Users";

export const metadata: Metadata = {
  title: "Daftar Pengguna - NewsInsight",
  description: "Kelola pengguna yang terdaftar di NewsInsight",
};

export default function UsersPage() {
  return <Users />;
}
