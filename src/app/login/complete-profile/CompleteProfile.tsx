/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastProvider";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Breadcrumbs from "@/components/Breadcrumbs";
import SummaryProfile from "@/components/SummaryProfile";
import { Icon } from "@iconify/react/dist/iconify.js";
import ListNewsCategory from "@/components/popup/ListNewsCategory";
import { getAvatarUrl } from "@/utils/avatarUtils";
import { ClipLoader } from "react-spinners";
import { useDarkMode } from "@/context/DarkModeContext";

const breadcrumbsItems = [
  { label: "Beranda", href: "/" },
  { label: "Masuk", href: "/login" },
  { label: "Data Diri", isActive: true },
];

interface City {
  id: string;
  name: string;
  province_id: string;
  province_name?: string;
}

export default function CompleteProfile() {
  const { isDark } = useDarkMode();
  const router = useRouter();
  const { showToast } = useToast();
  const { data: session } = useSession();
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [domicile, setDomicile] = useState<City | null>(null);
  const [newsInterest, setNewsInterest] = useState<
    { label: string; value: string }[]
  >([]);
  const [headline, setHeadline] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avatar, setAvatar] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [showSummary, setShowSummary] = useState(false);
  const [showListNewsCategory, setShowListNewsCategory] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [isLoadingCities, setIsLoadingCities] = useState(true);

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

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const showProfileSummary = () => {
    setShowSummary(true);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Mohon pilih file gambar yang valid", "error");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        showToast("Ukuran file harus kurang dari 2MB", "error");
        return;
      }

      setAvatarFile(file);

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const submitProfile = async () => {
    setIsSubmitting(true);
    try {
      let avatarUrl = avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const uploadResponse = await fetch("/api/upload/avatar", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.status === "success") {
          avatarUrl = uploadResult.data.avatar;
          setAvatar(avatarUrl);
        } else {
          throw new Error(uploadResult.message || "Gagal mengupload avatar");
        }
      }

      const profileData = {
        full_name: fullName,
        gender: gender,
        date_of_birth: dateOfBirth?.toISOString().split("T")[0],
        phone_number: phoneNumber,
        domicile: domicile?.name || "",
        news_interest: JSON.stringify(newsInterest),
        headline: headline,
        biography: shortBio,
        avatar: avatarUrl,
      };

      const response = await fetch("/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        showToast("Profil berhasil dilengkapi!", "success");

        setShowSummary(false);
        setTimeout(() => {
          const userRole = session?.user?.role;
          if (userRole === "user") {
            router.push("/");
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        throw new Error(result.message || "Gagal menyimpan profil");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan profil",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCategory = (category: { value: string; label: string }) => {
    setNewsInterest((prevInterest) =>
      prevInterest.filter((interest) => interest.value !== category.value)
    );
  };
  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        setIsLoadingCities(true);
        const response = await fetch("/api/cities/regencies");
        const result = await response.json();

        if (response.ok && result.status === "success" && result.data) {
          const formattedOptions = result.data.map(
            (city: City & { province_name: string }) => ({
              value: city.name,
              label: `${city.name}, ${city.province_name}`,
            })
          );
          setOptions(formattedOptions);
        } else {
          console.error("Failed to fetch cities:", result.message);
        }
      } catch (error) {
        console.error("Gagal mengambil data kota/kabupaten:", error);
      } finally {
        setIsLoadingCities(false);
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
                avatar={avatarPreview || avatar}
                onClose={() => setShowSummary(false)}
                onSave={submitProfile}
                isSubmitting={isSubmitting}
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
        className={`flex flex-col min-h-screen w-full ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"} p-6 overflow-hidden`}
        style={{ paddingTop: navbarHeight }}
      >
        <motion.div
          className={`flex flex-col gap-6 items-center justify-start w-full h-full ${isDark ? "text-white" : "text-black"} p-6`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isLoadingCities ? (
            <div className="flex items-center justify-center flex-1 w-full">
              <ClipLoader
                color="#367AF2"
                size={50}
                cssOverride={{
                  borderWidth: "4px",
                }}
              />
            </div>
          ) : (
            <>
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
                {/* Profile Picture Upload */}
                <div className="flex flex-col gap-2.5 w-full">
                  <p
                    className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    Foto Profil (Opsional)
                  </p>
                  <div className="flex items-center justify-start gap-3">
                    <div
                      className={`w-20 h-20 rounded-full border ${isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-200"} overflow-hidden`}
                    >
                      <Image
                        src={avatarPreview || getAvatarUrl(avatar)}
                        alt="Profile Preview"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-medium hover:opacity-80 transition cursor-pointer flex items-center justify-center gap-2 w-fit"
                      >
                        Pilih Foto
                        <Icon
                          icon="mynaui:image-solid"
                          width={16}
                          height={16}
                        />
                      </label>
                      {avatarFile && (
                        <p className="text-sm text-green-600">
                          File terpilih: {avatarFile.name}
                        </p>
                      )}
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Gambar profil sebaiknya memiliki rasio 1:1 dan berukuran
                        tidak lebih dari 2MB.
                      </p>
                    </div>
                  </div>
                </div>

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
                  <p
                    className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    Jenis Kelamin
                  </p>
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
              : isDark
                ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 cursor-pointer"
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
                            : {
                                id: "",
                                name: selectedCity.value,
                                province_id: "",
                              };
                        }
                        return null;
                      });
                    }
                  }}
                />
                <div className="flex flex-col gap-2.5 w-full">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      Minat Berita
                    </p>
                    <div className="font-medium bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] px-2 py-1 rounded-full text-xs text-white">
                      Maks. 5
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 w-full">
                    {newsInterest.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => setShowListNewsCategory(true)}
                        className={`px-4 py-2 rounded-xl border font-medium transition cursor-pointer w-full ${isDark ? "border-blue-400 text-blue-400 hover:bg-blue-400/10" : "border-blue-500 text-blue-500 hover:bg-blue-50"}`}
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
                              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border font-medium transition cursor-pointer w-full ${isDark ? "border-blue-400 text-blue-400 hover:bg-blue-400/10" : "border-blue-500 text-blue-500 hover:bg-blue-50"}`}
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
                onClick={showProfileSummary}
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
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
