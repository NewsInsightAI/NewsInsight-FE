"use client";
import Input from "@/components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastProvider";
import CvPreview from "@/components/popup/CvPreview";

interface City {
  id: string;
  name: string;
  province_id: string;
  province_name?: string;
}

interface ProfileData {
  date_of_birth?: string;
  domicile?: string;
  phone_number?: string;
  last_education?: string;
  work_experience?: string;
  cv_file?: string;
  [key: string]: string | string[] | null | undefined;
}

const listLastEducation = [
  { value: "SD", label: "Sekolah Dasar" },
  { value: "SMP", label: "Sekolah Menengah Pertama" },
  { value: "SMA", label: "Sekolah Menengah Atas" },
  { value: "D1", label: "Diploma 1" },
  { value: "D2", label: "Diploma 2" },
  { value: "D3", label: "Diploma 3" },
  { value: "D4", label: "Diploma 4" },
  { value: "S1", label: "Sarjana S1" },
  { value: "S2", label: "Magister S2" },
  { value: "S3", label: "Doktor S3" },
];

export default function PersonalData() {
  const { status } = useSession();
  const { showToast } = useToast();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [domicile, setDomicile] = useState<City | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [lastEducation, setLastEducation] = useState<string | null>(null);
  const [workExperience, setWorkExperience] = useState<string>("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCvFile, setCurrentCvFile] = useState<string | null>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCvPreview, setShowCvPreview] = useState(false);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);
  const searchCities = useCallback(async (search: string) => {
    if (!search || search.length < 2) {
      try {
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
        }
      } catch (error) {
        console.error("Error loading all cities:", error);
      }
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `/api/cities/search?search=${encodeURIComponent(search)}`
      );
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
        console.error("Failed to search cities:", result.message);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCities(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchCities]);

  useEffect(() => {
    searchCities("");
  }, [searchCities]);

  useEffect(() => {
    const fetchPersonalData = async () => {
      if (status !== "authenticated") return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/profile/me");
        const result = await response.json();

        if (response.ok && result.status === "success" && result.data) {
          const profile = result.data;

          if (profile.date_of_birth) {
            setDateOfBirth(new Date(profile.date_of_birth));
          }

          if (profile.domicile) {
            setDomicile({ id: "", name: profile.domicile, province_id: "" });
          }

          if (profile.phone_number) {
            setPhoneNumber(profile.phone_number);
          }

          if (profile.last_education) {
            setLastEducation(profile.last_education);
          }

          if (profile.work_experience) {
            setWorkExperience(profile.work_experience);
          }

          if (profile.cv_file) {
            setCurrentCvFile(profile.cv_file);
          }
        }
      } catch (error) {
        console.error("Error fetching personal data:", error);
        setError("Failed to load personal data");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, [status]);

  const handleSaveChanges = async () => {
    if (status !== "authenticated") return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let cvFileUrl = currentCvFile;

      if (cvFile) {
        const formData = new FormData();
        formData.append("cv", cvFile);

        const uploadResponse = await fetch("/api/upload/cv", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.status === "success") {
          cvFileUrl = uploadResult.data.cv_file;
        } else {
          throw new Error(uploadResult.message || "Failed to upload CV file");
        }
      }

      const currentProfileResponse = await fetch("/api/profile/me");
      const currentProfileResult = await currentProfileResponse.json();

      let currentProfile: ProfileData = {};
      if (
        currentProfileResponse.ok &&
        currentProfileResult.status === "success" &&
        currentProfileResult.data
      ) {
        currentProfile = currentProfileResult.data;
      }

      const personalData = {
        ...currentProfile,
        date_of_birth:
          dateOfBirth?.toISOString().split("T")[0] ||
          currentProfile.date_of_birth,
        domicile: domicile?.name || currentProfile.domicile,
        phone_number: phoneNumber || currentProfile.phone_number,
        last_education: lastEducation || currentProfile.last_education,
        work_experience: workExperience || currentProfile.work_experience,
        cv_file: cvFileUrl || currentProfile.cv_file,
      };

      const response = await fetch("/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setSuccess("Data pribadi berhasil disimpan!");
        setError(null);
        setCurrentCvFile(cvFileUrl);
        setCvFile(null);
        showToast("Data pribadi berhasil disimpan!", "success");

        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.message || "Failed to save personal data");
      }
    } catch (error) {
      console.error("Error saving personal data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save personal data";
      setError(errorMessage);
      setSuccess(null);
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="w-full h-full flex flex-col items-center rounded-xl border border-[#CFCFCF] p-5 gap-2.5">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Icon
              icon="line-md:loading-loop"
              className="text-4xl text-blue-500"
            />
            <p className="text-gray-600">Memuat data pribadi...</p>
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
                <Icon
                  icon="material-symbols:check-circle"
                  className="text-green-500"
                />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col items-start w-full h-full gap-2.5 overflow-y-auto">
            <div className="flex items-center justify-start w-full gap-3 pb-2.5 border-b border-[#CFCFCF]">
              <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                <Icon
                  icon="solar:document-bold"
                  className="text-4xl text-white"
                />
              </div>
              <div className="w-full flex flex-col items-start">
                <h1 className="text-xl font-bold">Data Pribadi</h1>
                <p className="text-sm text-[#A0A0A0]">
                  Isi informasi tambahan untuk melengkapi profil Anda. Data ini
                  hanya digunakan untuk keperluan internal dan tidak ditampilkan
                  secara publik.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 w-full h-full overflow-y-auto">
              <Input
                label="Tanggal Lahir"
                type="date"
                value={dateOfBirth}
                onDateChange={(date) => setDateOfBirth(date)}
                placeholder="HH/BB/TTTT"
                icon="lets-icons:date-today"
              />{" "}
              <Input
                label="Kota Domisili"
                placeholder="Cari kota domisili..."
                type="select"
                selectOptions={[...options]}
                icon="ph:city-fill"
                isLoading={isSearching}
                isSearchable={true}
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
                onInputChange={(inputValue) => {
                  setSearchTerm(inputValue);
                }}
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
                label="Pendidikan Terakhir"
                placeholder="Pilih pendidikan terakhir..."
                type="select"
                selectOptions={listLastEducation}
                icon="ph:graduation-cap-fill"
                value={
                  listLastEducation.find(
                    (opt) => opt.value === lastEducation
                  ) || null
                }
                onSelectChange={(option) => {
                  if (Array.isArray(option) || !option) {
                    setLastEducation(null);
                  } else {
                    setLastEducation((prev) => {
                      const selectedEducation = listLastEducation.find(
                        (opt) => opt.value === option.value
                      );
                      if (selectedEducation) {
                        return prev === selectedEducation.value
                          ? prev
                          : selectedEducation.value;
                      }
                      return null;
                    });
                  }
                }}
              />
              <Input
                label="Pengalaman Pekerjaan"
                placeholder="Ceritakan pengalaman pekerjaan Anda..."
                type="text"
                icon="ic:round-work"
                value={workExperience}
                onChangeValue={setWorkExperience}
              />{" "}
              <div className="flex flex-col gap-2 w-full">
                <Input
                  label="Curriculum Vitae (CV)"
                  placeholder="Pilih file CV..."
                  type="file"
                  accept="application/pdf"
                  currentFileName={
                    currentCvFile ? currentCvFile.split("/").pop() : undefined
                  }
                  onFileChange={(files) => {
                    if (files && files.length > 0) {
                      setCvFile(files[0]);
                    }
                  }}
                  required
                />
                {currentCvFile && !cvFile && (
                  <button
                    onClick={() => setShowCvPreview(true)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors self-start"
                  >
                    <Icon
                      icon="material-symbols:visibility"
                      className="text-sm"
                    />
                    Lihat CV
                  </button>
                )}
                {cvFile && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <Icon icon="mdi:file-pdf" className="text-red-600" />
                    <span className="text-sm text-green-700">
                      CV baru: {cvFile.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveChanges}
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
            )}{" "}
          </button>
        </>
      )}

      {/* CV Preview Popup */}
      <CvPreview
        isOpen={showCvPreview}
        onClose={() => setShowCvPreview(false)}
        cvUrl={
          currentCvFile
            ? `/api/uploads/cv/${currentCvFile.split("/").pop()}`
            : ""
        }
        fileName={currentCvFile?.split("/").pop()}
      />
    </div>
  );
}
