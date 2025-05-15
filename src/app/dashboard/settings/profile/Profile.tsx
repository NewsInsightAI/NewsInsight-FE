"use client";
import RichTextEditor from "@/components/RichTextEditor";
import Input from "@/components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import ListNewsCategory from "@/components/popup/ListNewsCategory";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Profile() {
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newsInterest, setNewsInterest] = useState<
    { label: string; value: string; icon: string }[]
  >([]);
  const [headline, setHeadline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [showListNewsCategory, setShowListNewsCategory] = useState(false);

  const handleRemoveCategory = (category: {
    value: string;
    label: string;
    icon: string;
  }) => {
    setNewsInterest((prevInterest) =>
      prevInterest.filter((interest) => interest.value !== category.value)
    );
  };

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
        {showListNewsCategory && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <ListNewsCategory
                onSave={(selectedCategories) => {
                  console.log(
                    "Selected categories from CompleteProfile:",
                    selectedCategories
                  );
                  setNewsInterest(selectedCategories);
                  setShowListNewsCategory(false);
                }}
                onClose={() => setShowListNewsCategory(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="w-full h-full flex flex-col items-center rounded-xl border border-[#CFCFCF] p-5 gap-2.5">
        <div className="flex flex-col items-start w-full h-full gap-2.5 overflow-y-auto">
          <div className="flex items-center justify-start w-full gap-3 pb-2.5 border-b border-[#CFCFCF]">
            <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
              <Icon
                icon="fluent:person-28-filled"
                className="text-4xl text-white"
              />
            </div>
            <div className="w-full flex flex-col items-start">
              <h1 className="text-xl font-bold">Profil Pengguna</h1>
              <p className="text-sm text-[#A0A0A0]">
                Masukkan data dasar profil Anda
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 w-full h-full overflow-y-auto">
            <div className="flex flex-col items-start">
              <p className="font-medium text-gray-800">Foto Diri</p>
              <div className="flex items-center justify-start gap-3 mt-2">
                <Image
                  src="/images/profile.jpeg"
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-xl border border-gray-300"
                />
                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={() => console.log("Edit Profile")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-medium hover:bg-blue-50 transition cursor-pointer flex items-center justify-center gap-2 w-fit"
                  >
                    Pilih Foto
                    <Icon icon="mynaui:image-solid" width={20} height={20} />
                  </button>
                  <p className="text-sm text-black/50">
                    Gambar Profile Anda sebaiknya memiliki rasio 1:1 dan
                    berukuran tidak lebih dari 2MB.
                  </p>
                </div>
              </div>
            </div>
            <Input
              label="Nama Lengkap"
              type="text"
              icon="fluent:person-12-filled"
              placeholder="Masukkan nama lengkap..."
              value={fullName}
              onChangeValue={setFullName}
              required
            />
            <Input
              label="Username"
              type="text"
              icon="gridicons:nametag"
              placeholder="Masukkan username..."
              value={username}
              onChangeValue={setUsername}
              required
            />
            <Input
              label="Email"
              type="email"
              icon="fluent:mail-12-filled"
              placeholder="Masukkan email..."
              value={email}
              onChangeValue={setEmail}
              disabled
              required
            />
            <div className="flex flex-col gap-2.5 w-full">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">Minat Berita</p>
                <div className="font-medium bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] px-2 py-1 rounded-full text-xs text-white">
                  Maks. 5
                </div>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                {newsInterest.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowListNewsCategory(true)}
                    className="px-4 py-2 rounded-xl border border-blue-500 text-blue-500 font-medium hover:bg-blue-50 transition cursor-pointer w-full"
                  >
                    Pilih Minat Berita
                  </button>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                      {newsInterest.map((interest) => (
                        <div
                          key={interest.value}
                          className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] px-4 py-2 rounded-xl text-base text-white"
                        >
                          <Icon icon={interest.icon} />
                          <p className="truncate">{interest.label}</p>

                          <button
                            onClick={() => handleRemoveCategory(interest)}
                            className="text-white ml-2 rounded-full p-1 hover:bg-white/20 transition cursor-pointer"
                          >
                            <Icon icon="mdi:close" />
                          </button>
                        </div>
                      ))}

                      {newsInterest.length < 5 && (
                        <button
                          type="button"
                          onClick={() => setShowListNewsCategory(true)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-500 font-medium hover:bg-blue-50 transition cursor-pointer w-full"
                        >
                          <Icon icon="mdi:plus" />
                          Tambah Kategori
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <Input
              label="Headline"
              type="text"
              icon="material-symbols:view-headline-rounded"
              placeholder="Masukkan headline..."
              value={headline}
              onChangeValue={setHeadline}
              required
            />
            <div className="flex flex-col gap-2.5 w-full">
              <p className="font-medium text-gray-800">Minat Berita</p>
              <RichTextEditor value={about} onChange={setAbout} />
            </div>
          </div>
        </div>
        <button className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg">
          Simpan Perubahan
          <Icon icon="material-symbols:save" width={20} height={20} />
        </button>
      </div>
    </>
  );
}
