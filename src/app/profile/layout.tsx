"use client";
import ProfileCard from "@/components/ProfileCard";
import { useEffect, useState } from "react";
import { getAvatarUrl } from "@/utils/avatarUtils";
import { useDarkMode } from "@/context/DarkModeContext";
import { ProfileTabProvider } from "@/context/ProfileTabContext";
import TabButtons from "@/components/ui/TabButtons";

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
  return (
    <ProfileTabProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ProfileTabProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDark } = useDarkMode();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
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

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile/me");

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className={`flex flex-col min-h-screen w-full transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div
        className="flex flex-1 flex-col lg:flex-row lg:gap-8 w-full px-4 lg:px-8 h-full pb-8 relative"
        style={{ paddingTop: navbarHeight + 8 }}
      >
        {" "}
        <div className="lg:hidden mb-4 z-10">
          {loading ? (
            <div
              className={`rounded-2xl shadow-lg p-6 border-2 flex items-center justify-center transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-[#E1E1E1]"
              }`}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : profileData ? (
            <ProfileCard
              name={profileData.full_name || profileData.username}
              role="reader"
              email={profileData.email}
              shortBio={
                profileData.biography ||
                profileData.headline ||
                "Mengikuti berita bukan karena kewajiban, tapi karena rasa ingin tahu yang nggak pernah habis."
              }
              profilePicture={getAvatarUrl(profileData.avatar)}
              joinedDate={profileData.created_at}
              newsInterests={
                profileData.news_interest?.map((interest) => {
                  const interestMap: { [key: string]: { label: string } } = {
                    teknologi: { label: "Teknologi" },
                    pendidikan: { label: "Pendidikan" },
                    politik: { label: "Politik" },
                    "ekonomi-bisnis": { label: "Ekonomi & Bisnis" },
                    "sains-kesehatan": { label: "Sains & Kesehatan" },
                    olahraga: { label: "Olahraga" },
                    hiburan: { label: "Hiburan" },
                    internasional: { label: "Internasional" },
                  };
                  return interestMap[interest] || { label: interest };
                }) || [
                  { label: "Teknologi" },
                  { label: "Pendidikan" },
                  { label: "Politik" },
                  { label: "Ekonomi & Bisnis" },
                ]
              }
            />
          ) : (
            <div
              className={`rounded-2xl shadow-lg p-6 border-2 flex items-center justify-center transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-[#E1E1E1]"
              }`}
            >
              <p
                className={`transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Failed to load profile
              </p>
            </div>
          )}
        </div>
        <div
          className="hidden lg:block sticky h-fit z-10"
          style={{ top: navbarHeight + 8 }}
        >
          {loading ? (
            <div
              className={`w-80 rounded-3xl shadow-lg p-8 border-2 flex items-center justify-center transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-[#E1E1E1]"
              }`}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : profileData ? (
            <ProfileCard
              name={profileData.full_name || profileData.username}
              role="reader"
              email={profileData.email}
              shortBio={
                profileData.biography ||
                profileData.headline ||
                "Mengikuti berita bukan karena kewajiban, tapi karena rasa ingin tahu yang nggak pernah habis."
              }
              profilePicture={getAvatarUrl(profileData.avatar)}
              joinedDate={profileData.created_at}
              newsInterests={
                profileData.news_interest?.map((interest) => {
                  const interestMap: { [key: string]: { label: string } } = {
                    teknologi: { label: "Teknologi" },
                    pendidikan: { label: "Pendidikan" },
                    politik: { label: "Politik" },
                    "ekonomi-bisnis": { label: "Ekonomi & Bisnis" },
                    "sains-kesehatan": { label: "Sains & Kesehatan" },
                    olahraga: { label: "Olahraga" },
                    hiburan: { label: "Hiburan" },
                    internasional: { label: "Internasional" },
                  };
                  return interestMap[interest] || { label: interest };
                }) || [
                  { label: "Teknologi" },
                  { label: "Pendidikan" },
                  { label: "Politik" },
                  { label: "Ekonomi & Bisnis" },
                ]
              }
            />
          ) : (
            <div
              className={`w-80 rounded-3xl shadow-lg p-8 border-2 flex items-center justify-center transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-[#E1E1E1]"
              }`}
            >
              <p
                className={`transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Failed to load profile
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full z-10">
          <TabButtons navbarHeight={navbarHeight} />
          <main className="flex flex-col w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
