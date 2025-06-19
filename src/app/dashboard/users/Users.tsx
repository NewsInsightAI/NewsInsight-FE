"use client";
import UsersTable from "@/components/ui/UsersTable";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import UserForm from "@/components/popup/AddEditUser";
import { useDarkMode } from "@/context/DarkModeContext";
import { useUsers } from "@/hooks/useUsers";
import { CreateUserData } from "@/lib/api/users";
import AdminGuard from "@/components/AdminGuard";

export default function Users() {
  const { isDark } = useDarkMode();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [showAddUser, setShowAddUser] = useState(false);

  const {
    users,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    createUser,
    refreshUsers,
  } = useUsers();
  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);
  const handleAddUser = async (data: {
    fullName: string;
    username: string;
    email: string;
    role: string;
    status: string;
    password?: string;
  }) => {
    try {
      if (!data.password) {
        throw new Error("Password is required for new user");
      }

      const createUserData: CreateUserData = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        role: data.role,
        status: data.status,
        password: data.password,
      };

      await createUser(createUserData);
      setShowAddUser(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  return (
    <AdminGuard>
      <AnimatePresence>
        {showAddUser && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <UserForm
                mode="add"
                initialFullName=""
                initialUsername=""
                initialEmail=""
                initialRole=""
                initialStatus=""
                onSubmit={handleAddUser}
                onClose={() => setShowAddUser(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>{" "}
      <div className="flex flex-col justify-start items-start gap-3 md:gap-4 h-full w-full p-2 md:p-0 overflow-hidden">
        {/* Header Section - Fixed at top */}
        <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center justify-between w-full gap-3 lg:gap-0">
          {/* Title Section */}
          <div className="flex items-center gap-2">
            <Image src="/images/user.svg" alt="news" width={28} height={28} />
            <p className="text-lg md:text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
              Daftar Pengguna
            </p>
          </div>

          {/* Search and Action Section - Responsive */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="flex items-center justify-center w-full sm:max-w-52">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full px-4 md:px-6 py-2.5 md:py-3 border rounded-full text-sm md:text-base transition-colors duration-300 ${
                    isDark
                      ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400"
                      : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"
                  }`}
                />
                <Icon
                  icon="material-symbols:search-rounded"
                  fontSize={20}
                  className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-400" : "text-black"
                  }`}
                />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-4 md:px-5 py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base whitespace-nowrap"
            >
              <span className="hidden sm:inline">Tambah Pengguna</span>
              <span className="sm:hidden">Tambah</span>
              <Icon icon="basil:add-solid" fontSize={18} />
            </button>
          </div>
        </div>{" "}
        {/* Error Message */}
        {error && (
          <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-auto w-full">
          <UsersTable
            datas={users}
            loading={loading}
            onRefresh={refreshUsers}
          />{" "}
        </div>
      </div>
    </AdminGuard>
  );
}
