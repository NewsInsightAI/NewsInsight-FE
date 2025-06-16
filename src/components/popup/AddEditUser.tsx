import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import Input from "../ui/Input";
import { useDarkMode } from "@/context/DarkModeContext";

interface UserFormProps {
  mode: "add" | "edit";
  initialFullName?: string;
  initialUsername?: string;
  initialEmail?: string;
  initialRole?: string;
  initialStatus?: string;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    username: string;
    email: string;
    role: string;
    status: string;
  }) => void;
}

export default function UserForm({
  mode,
  initialFullName = "",
  initialUsername = "",
  initialEmail = "",
  initialRole = "",
  initialStatus = "",
  onClose,
  onSubmit,
}: UserFormProps) {
  const { isDark } = useDarkMode();
  const [fullName, setFullName] = useState(initialFullName);
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState(initialRole);
  const [status, setStatus] = useState(initialStatus);
  const popUpRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popUpRef.current &&
        !popUpRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      fullName,
      username,
      email,
      role,
      status,
    });

    setFullName("");
    setUsername("");
    setEmail("");
    setRole("");
    setStatus("");
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "contributor", label: "Kontributor" },
  ];

  const statusOptions = [
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Nonaktif" },
  ];
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark ? "text-white" : "text-black"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div
        ref={popUpRef}
        className={`flex flex-col items-start gap-3 rounded-2xl shadow-xl p-5 max-w-[95%] transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        style={{ width: `calc(40%)` }}
      >
        <div
          className={`flex items-center gap-4 pb-4 border-b w-full transition-colors duration-300 ${
            isDark ? "border-gray-600" : "border-[#E2E2E2]"
          }`}
        >
          <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
            <Icon
              icon="fluent:person-28-filled"
              className="text-4xl text-white"
            />
          </div>{" "}
          <div className="flex flex-col items-start">
            <h2
              className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {mode === "add" ? "Tambah Pengguna" : "Edit Pengguna"}
            </h2>
            <p
              className={`text-sm transition-colors duration-300 ${
                isDark ? "text-gray-400" : "text-black/50"
              }`}
            >
              {mode === "add"
                ? "Lengkapi informasi pengguna untuk memberikan akses ke dashboard."
                : "Ubah informasi pengguna jika diperlukan"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <Input
            id="fullName"
            type="text"
            icon="fluent:person-28-filled"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap..."
            value={fullName}
            onChangeValue={setFullName}
            disabled={mode === "edit"}
            required
          />
          <Input
            id="username"
            type="text"
            icon="gridicons:nametag"
            label="Username"
            placeholder="Masukkan username..."
            value={username}
            onChangeValue={setUsername}
            disabled={mode === "edit"}
            required
          />
          <Input
            id="email"
            type="email"
            icon="fluent:mail-28-filled"
            label="Email"
            placeholder="Masukkan email..."
            value={email}
            onChangeValue={setEmail}
            disabled={mode === "edit"}
            required
          />
          <Input
            id="role"
            type="select"
            icon="mynaui:user-hexagon-solid"
            label="Role"
            placeholder="Pilih role..."
            selectOptions={roleOptions}
            value={roleOptions.find((option) => option.value === role) || null}
            onSelectChange={(option) => {
              if (option && !Array.isArray(option)) {
                setRole(option.value);
              }
            }}
            required
          />
          <Input
            id="status"
            type="select"
            icon="fluent:status-16-filled"
            label="Status"
            placeholder="Masukkan status..."
            selectOptions={statusOptions}
            value={
              statusOptions.find((option) => option.value === status) || null
            }
            onSelectChange={(option) => {
              if (option && !Array.isArray(option)) {
                setStatus(option.value);
              }
            }}
          />{" "}
          <div className="flex items-center w-full gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className={`w-full border py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-[#E2E2E2] text-[#5D6383] hover:bg-gray-50"
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!fullName || !username || !email || !role || !status}
              className="w-full enabled:bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 enabled:hover:opacity-90 transition cursor-pointer disabled:bg-[#DEDEDE] disabled:cursor-not-allowed disabled:text-[#A2A2A2]"
            >
              Simpan
              <Icon
                icon="material-symbols:save-rounded"
                className="text-base"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
