"use client";
import Input from "@/components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";

export default function AccountSecurity() {
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);

  return (
    <>
      <div className="w-full h-full flex flex-col items-center rounded-xl border border-[#CFCFCF] p-5 gap-2.5">
        <div className="flex flex-col items-start w-full h-full gap-10 overflow-y-auto">
          <div className="flex flex-col items-start w-full gap-2.5">
            <div className="flex items-center justify-start w-full gap-3 pb-2.5 border-b border-[#CFCFCF]">
              <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                <Icon icon="mdi:email-sync" className="text-4xl text-white" />
              </div>
              <div className="w-full flex flex-col items-start">
                <h1 className="text-xl font-bold">Ubah Email</h1>
                <p className="text-sm text-[#A0A0A0]">
                  Kelola email yang digunakan untuk masuk ke akun Anda
                </p>
              </div>
            </div>
            <Input
              label="Email"
              type="text"
              icon="mage:email-opened-fill"
              placeholder="Masukkan email..."
              value={email}
              onChangeValue={setEmail}
              required
            />
            <button className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg">
              Simpan Perubahan
              <Icon icon="material-symbols:save" width={20} height={20} />
            </button>
          </div>

          <div className="flex flex-col items-start w-full gap-2.5">
            <div className="flex items-center justify-start w-full gap-3 pb-2.5 border-b border-[#CFCFCF]">
              <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                <Icon
                  icon="mdi:password-reset"
                  className="text-4xl text-white"
                />
              </div>
              <div className="w-full flex flex-col items-start">
                <h1 className="text-xl font-bold">Ubah Password</h1>
                <p className="text-sm text-[#A0A0A0]">
                  Kelola password yang digunakan untuk masuk ke akun Anda
                </p>
              </div>
            </div>
            <Input
              label="Password Baru"
              type="password"
              icon="mage:email-opened-fill"
              placeholder="Masukkan password baru..."
              value={newPassword}
              onChangeValue={setNewPassword}
              required
            />
            <Input
              label="Konfirmasi Password Baru"
              type="password"
              icon="mage:email-opened-fill"
              placeholder="Masukkan konfirmasi password baru..."
              value={confirmPassword}
              onChangeValue={setConfirmPassword}
              required
            />
            <button className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg">
              Simpan Perubahan
              <Icon icon="material-symbols:save" width={20} height={20} />
            </button>
          </div>

          <div className="flex flex-col items-start w-full gap-2.5">
            <div className="flex items-center justify-start w-full gap-3 pb-2.5 border-b border-[#CFCFCF]">
              <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                <Icon
                  icon="mdi:two-factor-authentication"
                  className="text-4xl text-white"
                />
              </div>
              <div className="w-full flex flex-col items-start">
                <h1 className="text-xl font-bold">
                  Multi-factor Authentication (MFA)
                </h1>
                <p className="text-sm text-[#A0A0A0]">
                  Kelola informasi login dan keamanan akun Anda di sistem portal
                  berita
                </p>
              </div>
            </div>
            <button className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg">
              Hidupkan MFA
              <Icon icon="mdi:secure" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
