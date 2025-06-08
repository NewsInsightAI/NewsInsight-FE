import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { getAvatarUrl } from "@/utils/avatarUtils";

interface SummaryProfileProps {
  email: string;
  fullName: string;
  gender: boolean;
  dateOfBirth: string;
  phoneNumber: string;
  domicile: string;
  newsInterest: string[];
  headline: string;
  shortBio: string;
  avatar?: string;
}

const convertToDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${day} ${monthNames[month - 1]} ${year}`;
};

export default function SummaryProfile(
  props: SummaryProfileProps & {
    onClose: () => void;
    onSave: () => void;
    isSubmitting?: boolean;
  }
) {
  const infoList = [
    {
      label: "Email",
      value: props.email,
      icon: "mage:email-fill",
    },
    {
      label: "Nama Lengkap",
      value: props.fullName,
      icon: "fluent:person-28-filled",
    },
    {
      label: "Jenis Kelamin",
      value: props.gender ? "Laki-laki" : "Perempuan",
      icon: "mdi:gender-male-female",
    },
    {
      label: "Tanggal Lahir",
      value: convertToDate(props.dateOfBirth),
      icon: "lets-icons:date-today",
    },
    {
      label: "Nomor Telepon",
      value: props.phoneNumber,
      icon: "ic:round-phone",
    },
    {
      label: "Kota Domisili",
      value: props.domicile,
      icon: "ph:city-fill",
    },
    {
      label: "Minat Berita",
      value: props.newsInterest.join(", "),
      icon: "iconamoon:category-fill",
    },
    {
      label: "Headline",
      value: props.headline,
      icon: "material-symbols:view-headline-rounded",
    },
    {
      label: "Biografi Singkat",
      value: props.shortBio,
      icon: "material-symbols:short-text-rounded",
    },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-3">
              <Icon
                icon="material-symbols:person-check"
                className="text-3xl mr-3"
              />
              <h2 className="text-2xl font-bold">Ringkasan Profil</h2>
            </div>
            <p className="text-center text-blue-100 text-sm">
              Verifikasi data profil Anda sebelum menyimpan
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6 -mt-12 relative z-10">
            {props.avatar ? (
              <div className="relative">
                <Image
                  src={getAvatarUrl(props.avatar)}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white shadow-lg bg-gray-100 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <Icon
                    icon="material-symbols:check"
                    className="text-white text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="w-[100px] h-[100px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Icon
                  icon="material-symbols:person"
                  className="text-4xl text-gray-400"
                />
              </div>
            )}
            <h3 className="font-bold text-lg text-gray-800 mt-3">
              {props.fullName}
            </h3>
            <p className="text-gray-500 text-sm">{props.email}</p>
          </div>

          {/* Info Cards Grid */}
          <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {/* Personal Info Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Icon
                  icon="material-symbols:person-outline"
                  className="mr-2 text-blue-600"
                />
                Informasi Personal
              </h4>
              <div className="grid gap-3">
                {infoList.slice(1, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon
                          icon={item.icon}
                          className="text-blue-600 text-sm"
                        />
                      </div>
                      <span className="text-gray-600 text-sm font-medium">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-gray-800 font-semibold text-sm">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Info Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Icon
                  icon="material-symbols:location-on-outline"
                  className="mr-2 text-emerald-600"
                />
                Domisili
              </h4>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Icon
                        icon={infoList[5].icon}
                        className="text-emerald-600 text-sm"
                      />
                    </div>
                    <span className="text-gray-600 text-sm font-medium">
                      {infoList[5].label}
                    </span>
                  </div>
                  <span className="text-gray-800 font-semibold text-sm">
                    {infoList[5].value}
                  </span>
                </div>
              </div>
            </div>

            {/* Interests & Bio Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Icon
                  icon="material-symbols:interests-outline"
                  className="mr-2 text-purple-600"
                />
                Minat & Profil
              </h4>
              <div className="space-y-3">
                {infoList.slice(6).map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                        <Icon
                          icon={item.icon}
                          className="text-purple-600 text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-600 text-sm font-medium block mb-1">
                          {item.label}
                        </span>
                        <span className="text-gray-800 font-semibold text-sm leading-relaxed">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={props.onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
            >
              <Icon icon="material-symbols:close" className="text-lg" />
              Batal
            </button>
            <button
              onClick={props.onSave}
              disabled={props.isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] hover:from-[#2BC5EF] hover:to-[#2E6AE2] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {props.isSubmitting ? (
                <>
                  <Icon
                    icon="line-md:loading-loop"
                    className="text-lg animate-spin"
                  />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Icon icon="material-symbols:save" className="text-lg" />
                  Simpan Profil
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
