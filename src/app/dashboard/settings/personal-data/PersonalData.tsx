"use client";
import Input from "@/components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";

interface City {
  id: string;
  name: string;
  province_id: string;
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
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [domicile, setDomicile] = useState<City | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [lastEducation, setLastEducation] = useState<string | null>(null);
  const [workExperience, setWorkExperience] = useState<string>("");
  const [, setCvFile] = useState<File | null>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );

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
    <div className="w-full h-full flex flex-col items-center justify-between rounded-xl border border-[#CFCFCF] p-5 gap-2.5">
      <div className="flex flex-col items-start w-full h-full gap-2.5 overflow-y-auto">
        <div className="flex items-center justify-start w-full gap-3 pb-2.5 border-b border-[#CFCFCF]">
          <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
            <Icon icon="solar:document-bold" className="text-4xl text-white" />
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
          />
          <Input
            label="Kota Domisili"
            placeholder="Masukkan kota domisili..."
            type="select"
            selectOptions={[...options]}
            icon="ph:city-fill"
            value={options.find((opt) => opt.value === domicile?.name) || null}
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
              listLastEducation.find((opt) => opt.value === lastEducation) ||
              null
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
            placeholder="Masukkan nomor telepon..."
            type="text"
            icon="ic:round-phone"
            value={workExperience}
            onChangeValue={setWorkExperience}
          />
          <Input
            label="Curriculum Vitae (CV)"
            placeholder="Pilih file CV..."
            type="file"
            accept="application/pdf"
            onFileChange={(files) => {
              if (files && files.length > 0) {
                setCvFile(files[0]);
              }
            }}
            required
          />
        </div>
      </div>
      <button className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg">
        Simpan Perubahan
        <Icon icon="material-symbols:save" width={20} height={20} />
      </button>
    </div>
  );
}
