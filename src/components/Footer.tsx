import React from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Manrope } from "next/font/google";

const manropeFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const menuItems = [
  {
    section: "KATEGORI",
    items: [
      "Nasional",
      "Internasional",
      "Politik",
      "Ekonomi",
      "Teknologi",
      "Gaya Hidup",
      "Hiburan",
      "Olahraga",
    ],
  },
  {
    section: "INFORMASI HUKUM",
    items: ["Syarat dan Ketentuan", "Kebijakan Privasi", "Hak Cipta"],
  },
  {
    section: "TENTANG KAMI",
    items: [
      "Profil Redaksi",
      "Pedoman Media Siber",
      "Kode Etik Jurnalistik",
      "Disclaimer",
      "Karier / Bergabung dengan Kami",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="flex flex-col gap-6">
      {/* <div className="relative text-white px-12 py-6 rounded-3xl font-normal overflow-hidden flex justify-center items-center gap-10 h-48">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] z-0" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 flex flex-row justify-between items-center w-full">
          <p className="font-bold text-3xl w-96 leading-12">
            Ingin terus update dengan berita terbaik kami?
          </p>

          <button className="px-7 py-4 rounded-full border-2 border-white/60 bg-white/20 text-white font-bold text-base hover:bg-white/30 transition duration-300 ease-in-out cursor-pointer">
            DAFTAR SEKARANG
          </button>
        </div>
      </div> */}

      <div className="relative text-white px-12 py-6 rounded-3xl font-normal overflow-hidden flex flex-col gap-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] z-0" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 flex flex-row justify-between items-start w-full">
          <div className="flex flex-row justify-between gap-12">
            {menuItems.map((menu, index) => (
              <div key={index} className="flex flex-col gap-3 w-40">
                <p className="font-bold text-base">{menu.section}</p>
                <hr className="border-white/60" />
                <ul
                  className={`flex flex-col gap-3 font-medium ${manropeFont.className}`}
                >
                  {menu.items.map((item, index) => (
                    <li
                      key={index}
                      className="text-base cursor-pointer hover:underline"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 w-fit">
            <p className="font-bold text-base">HUBUNGI KAMI</p>
            <hr className="border-white/60" />
            <ul
              className={`flex flex-col gap-3 items-start font-medium ${manropeFont.className}`}
            >
              <li className="flex items-center gap-4 text-base cursor-pointer hover:underline">
                <Icon icon="ic:round-email" className="text-2xl" />
                <p>helpdesk@newsinsight.id</p>
              </li>
              <li className="flex items-center gap-4 text-base cursor-pointer hover:underline">
                <Icon icon="ic:round-phone" className="text-2xl" />
                <p>+62 81234567890</p>
              </li>
              <li className="flex items-center gap-4 text-base cursor-pointer hover:underline">
                <Icon icon="ph:map-pin-fill" className="text-2xl" />
                <p>Jl. Contoh No. 88, Jakarta Pusat</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-20 grid grid-cols-3 items-center text-center pt-4 border-t border-white/60">
          <div className="flex items-center gap-2">
            <Image
              src="/images/newsinsight-fullwhite.png"
              alt="Logo"
              width={20}
              height={20}
            />
            <p className="font-bold text-base">NewsInsight</p>
          </div>

          <p className="text-xs md:text-sm justify-self-center">
            &copy; {new Date().getFullYear()} NewsInsight. All rights reserved.
          </p>

          <div className="flex justify-end items-center gap-4">
            <Icon
              icon="ri:twitter-x-fill"
              className="text-2xl cursor-pointer"
            />
            <Icon
              icon="ri:instagram-fill"
              className="text-2xl cursor-pointer"
            />
            <Icon icon="ri:linkedin-fill" className="text-2xl cursor-pointer" />
            <Icon icon="ri:youtube-fill" className="text-2xl cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
