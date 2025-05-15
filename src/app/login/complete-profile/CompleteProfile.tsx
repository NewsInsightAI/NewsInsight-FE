/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { AnimatePresence, motion } from "framer-motion";

import Breadcrumbs from "@/components/Breadcrumbs";
import SummaryProfile from "@/components/SummaryProfile";
import { Icon } from "@iconify/react/dist/iconify.js";
import ListNewsCategory from "@/components/popup/ListNewsCategory";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Masuk", href: "/login" },
  { label: "Data Diri", isActive: true },
];

interface City {
  id: string;
  name: string;
  province_id: string;
}

export default function CompleteProfile() {
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [email, setEmail] = useState("rigel@gmail.com");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [domicile, setDomicile] = useState<City | null>(null);
  const [newsInterest, setNewsInterest] = useState<
    { label: string; value: string; icon: string }[]
  >([]);
  const [headline, setHeadline] = useState("");
  const [shortBio, setShortBio] = useState("");

  const [showSummary, setShowSummary] = useState(false);
  const [showListNewsCategory, setShowListNewsCategory] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const submitProfile = () => {
    setShowSummary(true);
  };

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
    const fetchAllCities = async () => {
      try {
        const provinceIds = [
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "21",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "51",
          "52",
          "53",
          "61",
          "62",
          "63",
          "64",
          "65",
          "71",
          "72",
          "73",
          "74",
          "75",
          "76",
          "81",
          "82",
          "91",
          "94",
        ];
        let allCitiesData: City[] = [];
        for (const id of provinceIds) {
          const response = await fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`
          );
          const data: City[] = await response.json();
          allCitiesData = [...allCitiesData, ...data];
        }

        const formattedOptions = allCitiesData.map((city) => ({
          value: city.name,
          label: city.name,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Gagal mengambil data kota/kabupaten:", error);
      }
    };

    fetchAllCities();
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <SummaryProfile
                email={email}
                fullName={fullName}
                gender={gender === "Laki-laki"}
                dateOfBirth={
                  dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : ""
                }
                phoneNumber={phoneNumber}
                domicile={domicile?.name ?? ""}
                newsInterest={newsInterest.map((interest) => interest.label)}
                headline={headline}
                shortBio={shortBio}
                onClose={() => setShowSummary(false)}
                onSave={submitProfile}
              />
            </motion.div>
          </div>
        )}
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
      <div
        className="flex flex-col min-h-screen w-full bg-white text-black p-6 overflow-hidden"
        style={{ paddingTop: navbarHeight }}
      >
        <motion.div
          className="flex flex-col gap-6 items-center justify-start w-full h-full bg-white rounded-lg p-6 text-black"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex w-full items-start">
            <Breadcrumbs items={breadcrumbsItems} />
          </div>
          <div className="flex items-center justify-between w-full bg-gradient-to-br from-[#2FAACC] to-[#2B62C2] pl-14 p-6 rounded-3xl">
            <div className="flex flex-col gap-2.5 w-full">
              <p className="text-white text-3xl font-bold font-['Inter']">
                Lengkapi Data Diri Anda
              </p>
              <p className="text-white text-xl font-normal font-['Inter']">
                Untuk mulai mengatur personalisasi berita Anda
              </p>
            </div>
            <img
              src="/images/personal_info.svg"
              alt="Personal Info"
              className="h-[183px] w-auto"
            />
          </div>
          <form className="flex flex-col gap-5 w-full">
            <Input
              label="Email"
              placeholder="Masukkan email..."
              type="email"
              disabled
              icon="mage:email-fill"
              value={email}
              onChangeValue={setEmail}
            />
            <Input
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap..."
              type="text"
              icon="fluent:person-28-filled"
              value={fullName}
              onChangeValue={setFullName}
            />
            <div className="flex flex-col gap-2.5 w-full">
              <p className="font-medium text-gray-800">Jenis Kelamin</p>
              <div className="flex flex-row gap-4 w-full">
                {["Laki-laki", "Perempuan"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex items-center justify-center gap-2 flex-1 rounded-xl px-4 py-3 border font-medium transition-all duration-200 ease-in-out
          ${
            gender === g
              ? g === "Laki-laki"
                ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
                : "bg-gradient-to-br from-[#FF66C4] to-[#FF318F] text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer"
          }
        `}
                  >
                    <Icon
                      icon={
                        g === "Laki-laki"
                          ? "ph:gender-male-bold"
                          : "ph:gender-female-bold"
                      }
                      className="w-5 h-5"
                    />
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Tanggal Lahir"
              type="date"
              value={dateOfBirth}
              onDateChange={(date) => setDateOfBirth(date)}
              placeholder="HH/BB/TTTT"
              icon="lets-icons:date-today"
            />
            <Input
              label="Nomor Telepon"
              placeholder="Masukkan nomor telepon..."
              type="text"
              icon="ic:round-phone"
              value={phoneNumber}
              onChangeValue={setPhoneNumber}
            />
            <Input
              label="Kota Domisili"
              placeholder="Masukkan kota domisili..."
              type="select"
              selectOptions={[...options]}
              icon="ph:city-fill"
              value={
                options.find((opt) => opt.value === domicile?.name) || null
              }
              onSelectChange={(option) => {
                if (Array.isArray(option) || !option) {
                  setDomicile(null);
                } else {
                  setDomicile((prev) => {
                    const selectedCity = options.find(
                      (opt) => opt.value === option.value
                    );
                    if (selectedCity) {
                      return prev && prev.name === selectedCity.value
                        ? prev
                        : { id: "", name: selectedCity.value, province_id: "" };
                    }
                    return null;
                  });
                }
              }}
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
              placeholder="Masukkan headline..."
              type="text"
              value={headline}
              onChangeValue={setHeadline}
              icon="material-symbols:view-headline-rounded"
            />
            <Input
              label="Biografi Singkat"
              placeholder="Masukkan biografi singkat..."
              type="text"
              value={shortBio}
              onChangeValue={setShortBio}
              icon="material-symbols:short-text-rounded"
            />
          </form>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowSummary(true)}
            disabled={
              !email ||
              !fullName ||
              !gender ||
              !dateOfBirth ||
              !phoneNumber ||
              !domicile ||
              newsInterest.length === 0 ||
              !headline ||
              !shortBio
            }
            className="cursor-pointer text-white rounded-lg px-5 py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Lanjutkan
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
