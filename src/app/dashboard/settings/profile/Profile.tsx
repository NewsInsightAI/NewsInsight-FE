"use client";
import Input from "@/components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import ListNewsCategory from "@/components/popup/ListNewsCategory";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getAvatarUrl } from "@/utils/avatarUtils";

export default function Profile() {
  const { status } = useSession();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>(""); 
  const [newsInterest, setNewsInterest] = useState<
    { label: string; value: string }[]
  >([]);
  const [headline, setHeadline] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [showListNewsCategory, setShowListNewsCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  
  const convertValueToCategory = (value: string) => {
    const categoryMap: { [key: string]: { label: string } } = {
      'teknologi': { label: 'Teknologi' },
      'pendidikan': { label: 'Pendidikan' },
      'politik': { label: 'Politik' },
      'ekonomi-bisnis': { label: 'Ekonomi & Bisnis' },
      'sains-kesehatan': { label: 'Sains & Kesehatan' },
      'olahraga': { label: 'Olahraga' },
      'hiburan-selebriti': { label: 'Hiburan & Selebriti' },
      'gaya-hidup': { label: 'Gaya Hidup' },
    };
    
    const category = categoryMap[value];
    return {
      value: value,
      label: category ? category.label : value.charAt(0).toUpperCase() + value.slice(1),
    };
  };

  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }
      
      setAvatarFile(file);
      setError(null);
      
      
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleRemoveCategory = (category: {
    value: string;
    label: string;
  }) => {
    setNewsInterest((prevInterest) =>
      prevInterest.filter((interest) => interest.value !== category.value)
    );
  };

  
  const fetchProfile = React.useCallback(async () => {
    if (status !== "authenticated") return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/profile/me", {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === "success" && result.data) {
        const profile = result.data;
        setFullName(profile.full_name || "");
        setUsername(profile.username || "");
        setEmail(profile.email || "");
        setAvatar(profile.avatar || "");
        setHeadline(profile.headline || "");
        setAbout(profile.biography || profile.about || ""); 

        
        
        if (profile.news_interest) {
          try {
            const interests = typeof profile.news_interest === "string" 
              ? JSON.parse(profile.news_interest) 
              : profile.news_interest;
            
            if (Array.isArray(interests)) {
              
              const convertedInterests = interests.map(interest => {
                if (typeof interest === 'string') {
                  
                  return convertValueToCategory(interest);
                } else if (interest && typeof interest === 'object' && interest.value) {
                  
                  return interest;
                }
                return null;
              }).filter(Boolean); 
              
              setNewsInterest(convertedInterests);
            } else {
              setNewsInterest([]);
            }
          } catch (e) {
            console.error("Error parsing news interests:", e);
            setNewsInterest([]);
          }
        }
      } else {
        console.error("Failed to fetch profile:", result.message);
        setError(result.message || "Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load profile data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [status]);

  
  const handleSubmit = async () => {
    if (status !== "authenticated") return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      let avatarUrl = avatar;
      
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        const uploadResponse = await fetch("/api/upload/avatar", {
          method: "POST",
          body: formData, 
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResponse.ok && uploadResult.status === "success") {
          avatarUrl = uploadResult.data.avatar;
        } else {
          throw new Error(uploadResult.message || "Failed to upload avatar");
        }
      }
      
      
      const currentProfileResponse = await fetch("/api/profile/me");
      const currentProfileResult = await currentProfileResponse.json();
      
      let currentProfile = {};
      if (currentProfileResponse.ok && currentProfileResult.status === "success" && currentProfileResult.data) {
        currentProfile = currentProfileResult.data;
      }

      const profileData = {
        ...currentProfile,
        full_name: fullName,
        username: username,
        headline: headline,
        biography: about,
        news_interest: JSON.stringify(newsInterest),
        avatar: avatarUrl
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
        setSuccess("Profil berhasil diperbarui!");
        setError(null);
        
        
        if (avatarFile) {
          setAvatar(avatarUrl);
          setAvatarPreview("");
        }
        
        
        setAvatarFile(null);
        
        
        window.dispatchEvent(new CustomEvent('profile-updated'));
        
        
        setTimeout(() => setSuccess(null), 3000);
        
        
        await fetchProfile();
        
      } else {
        console.error("Failed to update profile:", result.message);
        setError(result.message || "Failed to update profile");
        setSuccess(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      setError(errorMessage);
      setSuccess(null);
    } finally {
      setSaving(false);
    }
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

  
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, fetchProfile]);

  
  useEffect(() => {
    return () => {
      if (avatar && avatar.startsWith('blob:')) {
        URL.revokeObjectURL(avatar);
      }
    };
  }, [avatar]);

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
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Icon icon="line-md:loading-loop" className="text-4xl text-blue-500" />
              <p className="text-gray-600">Memuat data profil...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg mb-2.5">
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:error" className="text-red-500" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg mb-2.5">
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:check-circle" className="text-green-500" />
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              </div>
            )}
            <div className="flex flex-col items-start w-full h-full gap-2.5 overflow-y-auto">
              <div className="flex items-center justify-start w-full gap-3 pb-2.5 border-b border-[#CFCFCF]">
                <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                  <Icon
                    icon="fluent:person-28-filled"
                    className="text-4xl text-white"
                  />
                </div>
                <div className="w-full flex flex-col items-start">
                  <h1 className="text-xl font-bold">Edit Profil Pengguna</h1>
                  <p className="text-sm text-[#A0A0A0]">
                    Perbarui data profil Anda
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 w-full h-full overflow-y-auto">
                <div className="flex flex-col items-start">
                  <p className="font-medium text-gray-800">Foto Diri</p>
                  <div className="flex items-center justify-start gap-3 mt-2">
                    <Image
                      src={avatarPreview || getAvatarUrl(avatar)}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full border border-gray-300 bg-[#a7a6a7]"
                    />
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
                        <Icon icon="mynaui:image-solid" width={20} height={20} />
                      </label>
                      {avatarFile && (
                        <p className="text-sm text-green-600">
                          File terpilih: {avatarFile.name}
                        </p>
                      )}
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
                          {newsInterest.map((interest, index) => (
                            <div
                              key={`${interest.value}-${index}`}
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
                <Input
                  label="Tentang Saya"
                  type="text"
                  icon="mdi:account-details"
                  placeholder="Ceritakan tentang diri Anda..."
                  value={about}
                  onChangeValue={setAbout}
                  required
                />
              </div>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={saving || loading}
              className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Icon icon="line-md:loading-loop" width={20} height={20} />
                  Menyimpan...
                </>
              ) : (
                <>
                  Simpan Perubahan
                  <Icon icon="material-symbols:save" width={20} height={20} />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </>
  );
}
