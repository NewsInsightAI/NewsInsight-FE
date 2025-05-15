"use client";
import CategoryForm from "@/components/popup/AddEditCategory";
import CategoryTable from "@/components/ui/CategoryTable";
import { categoryData } from "@/utils/categoryData";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function Categories() {
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategory] = useState<Category | null>(null);

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
        {showAddCategory && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <CategoryForm
                mode="add"
                initialName={selectedCategory?.name || ""}
                initialDescription={selectedCategory?.description || ""}
                onClose={() => setShowAddCategory(false)}
                onSubmit={(data) => {
                  console.log(data);
                  setShowAddCategory(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex flex-col justify-start items-start gap-3 h-full w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Image
              src="/images/category_fill.svg"
              alt="news"
              width={28}
              height={28}
            />
            <p className="text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
              Daftar Kategori
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center max-w-52 mx-auto">
              <div className={`relative w-full `}>
                <input
                  type="text"
                  placeholder="Cari kategori..."
                  className={`w-full px-6 py-3 border border-[#E2E2E2] rounded-full placeholder:text-[#818181] bg-white`}
                />
                <Icon
                  icon="material-symbols:search-rounded"
                  fontSize={24}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setShowAddCategory(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-5 py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer"
            >
              <Icon icon="basil:add-solid" fontSize={20} />
              <p>Tambah Kategori</p>
            </button>
          </div>
        </div>
        <CategoryTable datas={categoryData} />
      </div>
    </>
  );
}
