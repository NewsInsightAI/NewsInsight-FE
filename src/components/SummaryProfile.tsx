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
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center`}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-[600px]">
        {/* Header */}
        <div className="p-4 flex flex-col items-center border border-gray-200 rounded-2xl text-black bg-white shadow-sm">
          <h2 className={`text-xl font-bold text-center`}>
            Ringkasan Data Diri
          </h2>
          <p className={`text-base text-center text-gray-600 mt-2`}>
            Periksa kembali informasi profil kamu sebelum melanjutkan ke langkah
            berikutnya.
          </p>
        </div>

        {/* Avatar Section */}
        {props.avatar && (
          <div className="flex justify-center mt-4">
            <Image
              src={getAvatarUrl(props.avatar)}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full border border-gray-300 bg-gray-200 object-cover"
            />
          </div>
        )}

        {/* Scrollable info list */}
        <div className="w-full mt-4 space-y-3 max-h-[40vh] overflow-y-auto pr-2">
          {infoList.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-base text-gray-700"
            >
              <div className="flex items-center gap-2 text-gray-500 sm:w-48">
                <Icon
                  icon={item.icon}
                  className="text-gray-400"
                  width={16}
                  height={16}
                />
                <span>{item.label}</span>
              </div>
              <span className="hidden sm:inline-block text-gray-500">:</span>
              <div className="text-black font-semibold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-row items-center mt-6 gap-2 w-full">
          <button
            onClick={props.onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer w-full"
          >
            Batal
          </button>

          <button
            onClick={props.onSave}
            disabled={props.isSubmitting}
            className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-medium py-2 px-4 rounded-lg cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {props.isSubmitting ? (
              <>
                <Icon icon="line-md:loading-loop" className="text-lg animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
