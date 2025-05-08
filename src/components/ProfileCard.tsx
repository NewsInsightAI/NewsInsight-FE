/* eslint-disable @next/next/no-img-element */
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

interface NewsInterest {
  label: string;
  icon: string;
}

interface ProfileCardProps {
  name: string;
  role: string;
  email: string;
  shortBio: string;
  profilePicture: string;
  newsInterests: NewsInterest[];
}

export default function ProfileCard({
  name,
  role,
  email,
  shortBio,
  profilePicture,
  newsInterests,
}: ProfileCardProps) {
  const [navbarHeight, setNavbarHeight] = useState(0);

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

  return (
    <div
      className="flex flex-col items-center justify-between w-80 bg-white rounded-3xl shadow-lg p-8 border-2 border-[#E1E1E1] text-black"
      style={{ height: `calc(100vh - ${navbarHeight}px - 40px)` }}
    >
      <div className="flex flex-col items-center">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-56 h-56 rounded-full border-4 border-white"
        />
        <h2 className="text-2xl font-bold mt-4">{name}</h2>
        <p className="text-base opacity-40">{email}</p>
        {role == "reader" ? (
          <div className="flex items-center gap-2 bg-[#367AF2]/15 border border-[#367AF2] rounded-full px-4 py-2 my-2.5">
            <Icon icon="fa-solid:book-reader" fontSize={20} color="#367AF2" />
            <p className="text-sm font-semibold text-[#367AF2]">Pembaca</p>
          </div>
        ) : role == "contributor" ? (
          <div className="flex items-center gap-2 bg-[#F97316]/15 border border-[#F97316] rounded-full px-4 py-2 my-2.5">
            <Icon icon="mingcute:pen-fill" fontSize={20} color="#F97316" />
            <p className="text-sm font-semibold text-[#F97316]">Kontributor</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[#FF0000]/15 border border-[#FF0000] rounded-full px-4 py-2 my-2.5">
            <Icon
              icon="material-symbols:admin-panel-settings-rounded"
              fontSize={20}
              color="#FF0000"
            />
            <p className="text-sm font-semibold text-[#FF0000]">Admin</p>
          </div>
        )}
        <p className="text-base font-light opacity-40 mt-2 text-center">
          {shortBio}
        </p>
        <div className="mt-4 w-full">
          <div className="grid grid-cols-2 gap-2 mt-2 w-full">
            {newsInterests.map((interest, index) => (
              <div
                key={index}
                title={interest.label}
                className="flex items-center justify-center gap-2 text-sm px-3.5 py-2.5 rounded-lg bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
              >
                <Icon icon={interest.icon} fontSize={16} />
                <p className=" truncate">{interest.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="opacity-30 text-sm">Bergabung sejak 19 Maret 2025</p>
    </div>
  );
}
