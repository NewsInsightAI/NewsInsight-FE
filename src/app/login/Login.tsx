"use client";
import React, { useState, useEffect } from "react";
import Input from "../../components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ForgotPassword from "@/components/popup/ForgotPassword";
import VerifyEmail from "@/components/popup/VerifyEmail";
import MFAVerification from "@/components/popup/MFAVerification";
import { useToast } from "@/context/ToastProvider";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";

export default function Login() {
  const { isDark } = useDarkMode();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [highlightGoogleSignIn, setHighlightGoogleSignIn] = useState(false);
  const { promise, showToast } = useToast();
  const router = useRouter();
  const [verifyEmailData, setVerifyEmailData] = useState<{
    email: string;
    userId: number;
  } | null>(null);
  const [mfaData, setMfaData] = useState<{
    email: string;
    tempToken: string;
    userId: number;
    availableMethods: string[];
  } | null>(null);

  useEffect(() => {
    const navbar = document.querySelector("#navbar");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      const navbar = document.querySelector("#navbar");
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (navbar && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        setNavbarHeight(navbar.clientHeight);
      });
      observer.observe(navbar);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer && navbar) observer.disconnect();
    };
  }, []);

  const advancedFeatures = [
    "Update berita real-time",
    "Komentar dan diskusi komunitas",
    "Bookmark berita favorit",
    "Personalisasi kategori berita",
  ];
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await promise(
        (async () => {
          const result = await signIn("credentials", {
            identifier: email,
            password: password,
            redirect: false,
          });
          if (result?.ok) {
            const session = await getSession();
            if (session?.backendUser) {
              try {
                const profileCheckRes = await fetch("/api/profile/me");
                const profileData = await profileCheckRes.json();

                let isProfileComplete = false;
                if (profileData.status === "success" && profileData.data) {
                  const profile = profileData.data;
                  isProfileComplete = !!(
                    profile.full_name &&
                    profile.gender &&
                    profile.date_of_birth &&
                    profile.phone_number &&
                    profile.domicile &&
                    profile.news_interest &&
                    profile.headline &&
                    profile.biography
                  );
                }
                if (!isProfileComplete) {
                  router.push("/login/complete-profile");
                } else {
                  const userRole = session.backendUser.role;
                  if (userRole === "user") {
                    router.push("/");
                  } else {
                    router.push("/dashboard");
                  }
                }

                window.dispatchEvent(new CustomEvent("login-success"));
              } catch (error) {
                console.error("Error checking profile completion:", error);
                router.push("/dashboard");

                window.dispatchEvent(new CustomEvent("login-success"));
              }
            } else {
              throw new Error("Gagal mendapatkan data sesi.");
            }
          } else if (result?.error) {
            if (result.error.includes("EMAIL_UNVERIFIED:")) {
              const errorData = JSON.parse(
                result.error.replace("EMAIL_UNVERIFIED:", "")
              );
              setVerifyEmailData({
                email: errorData.email,
                userId: errorData.userId,
              });
              setShowVerifyEmail(true);
              return;
            }
            if (result.error.includes("MFA_REQUIRED:")) {
              const errorData = JSON.parse(
                result.error.replace("MFA_REQUIRED:", "")
              );
              setMfaData({
                email: errorData.email,
                tempToken: errorData.tempToken,
                userId: errorData.userId,
                availableMethods: errorData.availableMethods,
              });
              setShowMFAVerification(true);
              return;
            }

            if (result.error.includes("Akun ini terdaftar melalui Google")) {
              setHighlightGoogleSignIn(true);
              setTimeout(() => setHighlightGoogleSignIn(false), 5000);
            }

            throw new Error(result.error);
          } else {
            throw new Error("Login gagal. Silakan coba lagi.");
          }
        })(),
        {
          loading: "Sedang login...",
          success: () => "Login berhasil!",
          error: (err) =>
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan. Silakan coba lagi.",
        }
      );
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleMFASuccess = async () => {
    setShowMFAVerification(false);
    setMfaData(null);

    const session = await getSession();
    if (session?.backendUser) {
      try {
        const profileCheckRes = await fetch("/api/profile/me");
        const profileData = await profileCheckRes.json();

        let isProfileComplete = false;
        if (profileData.status === "success" && profileData.data) {
          const profile = profileData.data;
          isProfileComplete = !!(
            profile.full_name &&
            profile.gender &&
            profile.date_of_birth &&
            profile.phone_number &&
            profile.domicile &&
            profile.news_interest &&
            profile.headline &&
            profile.biography
          );
        }
        showToast("Login berhasil!", "success");
        if (!isProfileComplete) {
          router.push("/login/complete-profile");
        } else {
          const userRole = session.backendUser.role;
          if (userRole === "user") {
            router.push("/");
          } else {
            router.push("/dashboard");
          }
        }

        window.dispatchEvent(new CustomEvent("login-success"));
      } catch (error) {
        console.error("Error checking profile completion:", error);
        showToast("Login berhasil!", "success");

        const userRole = session?.backendUser?.role;
        if (userRole === "user") {
          router.push("/");
        } else {
          router.push("/dashboard");
        }

        window.dispatchEvent(new CustomEvent("login-success"));
      }
    }
  };
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const currentOrigin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://newsinsight.space";
      const callbackUrl = `${currentOrigin}/`;

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: callbackUrl,
      });

      if (result?.ok) {
        const session = await getSession();
        if (session) {
          try {
            const profileCheckRes = await fetch("/api/profile/me");
            const profileData = await profileCheckRes.json();

            let isProfileComplete = false;
            if (profileData.status === "success" && profileData.data) {
              const profile = profileData.data;
              isProfileComplete = !!(
                profile.full_name &&
                profile.gender &&
                profile.date_of_birth &&
                profile.phone_number &&
                profile.domicile &&
                profile.news_interest &&
                profile.headline &&
                profile.biography
              );
            }
            const message = session.isNewUser
              ? "Akun berhasil dibuat dan Anda telah masuk. Selamat datang di NewsInsight!"
              : "Selamat datang kembali!";
            showToast(message, "success");
            if (!isProfileComplete) {
              router.push("/login/complete-profile");
            } else {
              const userRole = session?.backendUser?.role;
              if (userRole === "user") {
                router.push("/");
              } else {
                router.push("/dashboard");
              }
            }

            window.dispatchEvent(new CustomEvent("login-success"));
          } catch (error) {
            console.error("Error checking profile completion:", error);
            const message = session.isNewUser
              ? "Akun berhasil dibuat dan Anda telah masuk. Selamat datang di NewsInsight!"
              : "Selamat datang kembali!";
            showToast(message, "success");

            const userRole = session?.backendUser?.role;
            if (userRole === "user") {
              router.push("/");
            } else {
              router.push("/dashboard");
            }

            window.dispatchEvent(new CustomEvent("login-success"));
          }
        } else {
          showToast(
            "Terjadi kesalahan saat masuk. Silakan coba lagi.",
            "error"
          );
        }
      } else if (result?.error) {
        console.error("Google sign in error:", result.error);
        if (result.error === "AccessDenied") {
          showToast("Login dengan Google dibatalkan.", "error");
        } else {
          showToast("Gagal masuk dengan Google. Silakan coba lagi.", "error");
        }
      }
    } catch (error) {
      console.error("Error during Google sign in:", error);
      showToast("Terjadi kesalahan saat masuk dengan Google.", "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center"
          >
            <ForgotPassword onClose={() => setShowForgotPassword(false)} />
          </motion.div>
        )}{" "}
        {showVerifyEmail && (
          <motion.div
            key="verify-email"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center"
          >
            <VerifyEmail
              onClose={() => setShowVerifyEmail(false)}
              {...(verifyEmailData
                ? {
                    email: verifyEmailData.email,
                    userId: verifyEmailData.userId,
                  }
                : {})}
            />
          </motion.div>
        )}
        {showMFAVerification && mfaData && (
          <motion.div
            key="mfa-verification"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center"
          >
            {" "}
            <MFAVerification
              onClose={() => {
                setShowMFAVerification(false);
                setMfaData(null);
              }}
              onVerificationComplete={handleMFASuccess}
              email={mfaData.email}
              tempToken={mfaData.tempToken}
              userId={mfaData.userId}
              availableMethods={mfaData.availableMethods}
              isLoginFlow={true}
            />
          </motion.div>
        )}
      </AnimatePresence>{" "}
      <div
        style={{
          paddingTop:
            typeof window !== "undefined" && window.innerWidth < 768
              ? navbarHeight
              : navbarHeight + 20,
        }}
        className={`flex flex-col md:flex-row w-full ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"} p-4 md:p-6 min-h-screen overflow-hidden`}
      >
        <div className="flex flex-1 w-full items-center justify-center min-h-full">
          {" "}
          <motion.div
            className={`flex flex-col gap-6 items-center justify-start w-full ${isDark ? "text-white" : "text-black"} px-4 md:px-8 py-6`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold">Masuk ke Akun Anda</h1>{" "}
              <p
                className={`${isDark ? "text-gray-300" : "text-gray-600"} text-center mb-2`}
              >
                Kelola berita dan komentar Anda dengan mudah.
              </p>
            </div>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
              <Input
                label="Username atau Email"
                placeholder="Masukkan username atau email..."
                type="text"
                icon="mage:email-opened-fill"
                value={email}
                onChangeValue={setEmail}
              />
              <Input
                label="Password"
                placeholder="Masukkan password..."
                type="password"
                icon="material-symbols:password-rounded"
                value={password}
                onChangeValue={setPassword}
              />{" "}
              <button
                type="submit"
                className="cursor-pointer text-white rounded-lg px-5 py-3 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] transition duration-300 ease-in-out hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Masuk
              </button>
            </form>
            <div className="flex flex-col gap-2.5 items-end w-full">
              {" "}
              <p
                onClick={() => setShowForgotPassword(true)}
                className={`${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-600"} text-sm cursor-pointer transition-colors duration-200`}
              >
                Lupa password?
              </p>
            </div>{" "}
            <div className="flex flex-row gap-4 items-center w-full opacity-20">
              <hr
                className={`border-t ${isDark ? "border-gray-300" : "border-black"} w-full`}
              />
              <p
                className={`${isDark ? "text-gray-300" : "text-black"} text-sm`}
              >
                atau
              </p>
              <hr
                className={`border-t ${isDark ? "border-gray-300" : "border-black"} w-full`}
              />
            </div>{" "}
            <button
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {" "}
              <div
                className={`flex flex-row gap-2 items-center justify-center w-full rounded-lg px-5 py-3 transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  highlightGoogleSignIn
                    ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white border-2 border-blue-400 shadow-lg transform scale-105"
                    : isDark
                      ? "bg-gray-700 border border-gray-600 hover:bg-gray-600 text-white"
                      : "bg-white border border-gray-300 hover:opacity-80 text-black"
                }`}
              >
                {isGoogleLoading ? (
                  <Icon
                    icon="line-md:loading-loop"
                    className="text-2xl animate-spin"
                  />
                ) : (
                  <>
                    {" "}
                    <p
                      className={`text-sm ${
                        highlightGoogleSignIn
                          ? "text-white"
                          : isDark
                            ? "text-white"
                            : "text-black"
                      }`}
                    >
                      Masuk dengan Google
                    </p>
                    <Icon icon="flat-color-icons:google" className="text-2xl" />
                  </>
                )}
              </div>
            </button>{" "}
            <p
              className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm text-center mt-4`}
            >
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Panel kanan hanya tampil di md ke atas, layout desktop kembali ke semula */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden md:flex relative text-white px-14 py-12 rounded-3xl font-normal overflow-hidden justify-center items-center w-fit min-h-full bg-gradient-to-br from-[#2FAACC] to-[#2B62C2]"
        >
          <div className="relative z-20 flex flex-col justify-between items-start w-full h-full">
            <div className="flex flex-col gap-4 items-start">
              <p className="font-bold text-2xl">Kenapa NewsInsight?</p>
              <ul className="flex flex-col gap-2 font-normal text-base">
                {advancedFeatures.map((feature, index) => (
                  <li key={index}>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="akar-icons:check-box-fill"
                        className="text-2xl"
                      />
                      <p>{feature}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gambar dinamis, responsive */}
            <div className="relative w-full h-40 md:h-60 lg:h-80 mt-6">
              <Image
                src="/images/undraw_online-articles.png"
                alt="NewsInsight"
                fill
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
