"use client";
import ProfileCard from "@/components/ProfileCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [buttonsHeight, setButtonsHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    const buttons = document.querySelector("#buttons");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }
    if (buttons) {
      setButtonsHeight(buttons.clientHeight);
    }
    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
      if (buttons) {
        setButtonsHeight(buttons.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <div
        className="w-full h-42 fixed top-0 left-0 z-10"
        style={{
          background:
            "url('/images/pattern.png'), linear-gradient(to bottom right, #2FAACC, #2B62C2)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="flex flex-1 gap-8 w-full px-8 h-full pb-8 relative"
        style={{ paddingTop: navbarHeight + 8 }}
      >
        <div
          className="hidden lg:block sticky h-fit z-10"
          style={{ top: navbarHeight + 8 }}
        >
          <ProfileCard
            name="Rigel Ramadhani W"
            role="admin"
            email="rigel@gmail.com"
            shortBio="Mengikuti berita bukan karena kewajiban, tapi karena rasa ingin tahu yang nggak pernah habis."
            profilePicture="https://avatars.githubusercontent.com/u/115273885?v=4"
            newsInterests={[
              { label: "Teknologi", icon: "mdi:laptop" },
              { label: "Pendidikan", icon: "mdi:school" },
              { label: "Politik", icon: "mdi:vote" },
              { label: "Ekonomi & Bisnis", icon: "mdi:chart-line" },
            ]}
          />
        </div>
        <div className="flex flex-col w-full z-10">
          <div
            id="buttons"
            className="flex flex-row items-center w-full gap-4 mb-4 h-fit sticky"
            style={{ top: navbarHeight + 8 }}
          >
            <button className="flex items-center justify-center gap-2.5 px-6 py-3 w-full rounded-xl bg-white bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
              <Icon icon="mingcute:bookmark-fill" fontSize={24} />
              Tersimpan
            </button>
            <button className="flex items-center justify-center gap-2.5 px-6 py-3 w-full rounded-xl bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white cursor-pointer transition-all duration-300 ease-in-out">
              <Icon icon="iconamoon:history-duotone" fontSize={24} />
              Riwayat
            </button>
          </div>
          <main
            className="flex flex-col w-full mt-6 -z-10"
            style={{
              height: `calc(100vh - ${navbarHeight}px - ${buttonsHeight}px - 80px)`,
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
