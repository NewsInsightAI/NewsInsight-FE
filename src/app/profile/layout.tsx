"use client";
import ProfileCard from "@/components/ProfileCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { getAvatarUrl } from "@/utils/avatarUtils";

interface ProfileData {
  id: number;
  user_id: number;
  full_name: string;
  gender: string;
  date_of_birth: string;
  phone_number: string;
  domicile: string;
  news_interest: string[];
  headline: string;
  biography: string;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  email: string;
  username: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [buttonsHeight, setButtonsHeight] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

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
    
    
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile/me');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfileData(data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
          {loading ? (
            <div className="w-80 bg-white rounded-3xl shadow-lg p-8 border-2 border-[#E1E1E1] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : profileData ? (
            <ProfileCard
              name={profileData.full_name || profileData.username}
              role="reader" 
              email={profileData.email}
              shortBio={profileData.biography || profileData.headline || "Mengikuti berita bukan karena kewajiban, tapi karena rasa ingin tahu yang nggak pernah habis."}
              profilePicture={getAvatarUrl(profileData.avatar)}
              joinedDate={profileData.created_at}
              newsInterests={profileData.news_interest?.map(interest => {
                
                const interestMap: { [key: string]: { label: string } } = {
                  'teknologi': { label: "Teknologi" },
                  'pendidikan': { label: "Pendidikan" },
                  'politik': { label: "Politik" },
                  'ekonomi-bisnis': { label: "Ekonomi & Bisnis" },
                  'sains-kesehatan': { label: "Sains & Kesehatan" },
                  'olahraga': { label: "Olahraga" },
                  'hiburan': { label: "Hiburan" },
                  'internasional': { label: "Internasional" }
                };
                return interestMap[interest] || { label: interest };
              }) || [
                { label: "Teknologi" },
                { label: "Pendidikan" },
                { label: "Politik" },
                { label: "Ekonomi & Bisnis" },
              ]}
            />
          ) : (
            <div className="w-80 bg-white rounded-3xl shadow-lg p-8 border-2 border-[#E1E1E1] flex items-center justify-center">
              <p className="text-gray-600">Failed to load profile</p>
            </div>
          )}
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
