import React from "react";
import Profile from "./Profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil - NewsInsight",
  description: "Lihat dan edit informasi profil Anda di NewsInsight.",
};

export default function ProfilePage() {
  return <Profile />;
}
