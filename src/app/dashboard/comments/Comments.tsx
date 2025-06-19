"use client";
import CommentForm from "@/components/popup/AddEditComment";
import CommentTable from "@/components/ui/CommentTable";
import { commentData } from "@/utils/commentData";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/context/DarkModeContext";

export default function Comments() {
  const { isDark } = useDarkMode();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [showAddComment, setShowAddComment] = useState(false);

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
      <AnimatePresence>
        {showAddComment && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <CommentForm
                mode="add"
                initialReaderName=""
                initialNewsTitle=""
                initialComment=""
                initialDateTime=""
                onSubmit={(data) => {
                  console.log(data);
                  setShowAddComment(false);
                }}
                onClose={() => setShowAddComment(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>{" "}
      <div className="flex flex-col justify-start items-start gap-3 md:gap-4 h-full w-full p-2 md:p-0 overflow-hidden">
        {/* Header Section - Fixed at top */}
        <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center justify-between w-full gap-3 lg:gap-0">
          {/* Title Section with AI Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/comment.svg"
                alt="news"
                width={28}
                height={28}
              />
              <p className="text-lg md:text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
                Daftar Komentar
              </p>
            </div>
            <div
              className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-3 md:px-4 py-2 md:py-2.5 font-bold self-start"
              title="The results may be inaccurate, please check the moderation results before taking any action."
            >
              <Icon icon="mingcute:ai-fill" fontSize={16} />
              <p className="text-xs md:text-sm">AI-Moderation</p>
            </div>
          </div>

          {/* Search and Action Section - Responsive */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="flex items-center justify-center w-full sm:max-w-52">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari komentar..."
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
              onClick={() => {
                setShowAddComment(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-4 md:px-5 py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base whitespace-nowrap"
            >
              <Icon icon="basil:add-solid" fontSize={18} />
              <span className="hidden sm:inline">Tambah Komentar</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        </div>{" "}
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-auto w-full">
          <CommentTable datas={commentData} />
        </div>
      </div>
    </>
  );
}
