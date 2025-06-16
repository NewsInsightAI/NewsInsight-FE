"use client";
import Input from "@/components/ui/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastProvider";
import VerifyEmail from "@/components/popup/VerifyEmail";
import MFASetup from "@/components/popup/MFASetup";
import MFAManager from "@/components/popup/MFAManager";
import { useDarkMode } from "@/context/DarkModeContext";

export default function AccountSecurity() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const { isDark } = useDarkMode();

  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState("");
  const [userIdForVerification, setUserIdForVerification] = useState<
    number | null
  >(null);

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [enabledMethods, setEnabledMethods] = useState<string[]>([]);
  const [showMfaSetup, setShowMfaSetup] = useState(false);

  useEffect(() => {
    if (session?.backendUser) {
      setLoading(true);
      setCurrentUserEmail(session.backendUser.email || "");

      const checkGoogleUser = async () => {
        try {
          const response = await fetch("/api/auth/user-info");
          if (response.ok) {
            const result = await response.json();
            if (result.status === "success" && result.data) {
              setIsGoogleUser(!!result.data.google_id);
            }
          }
        } catch (error) {
          console.error("Error checking user data:", error);
          setIsGoogleUser(false);
        }
      };

      const fetchMFAStatus = async () => {
        try {
          const response = await fetch("/api/mfa/status");
          if (response.ok) {
            const result = await response.json();
            if (result.status === "success" && result.data) {
              setMfaEnabled(result.data.isEnabled);
              setEnabledMethods(result.data.enabledMethods || []);
            }
          }
        } catch (error) {
          console.error("Error fetching MFA status:", error);
        }
      };

      Promise.all([checkGoogleUser(), fetchMFAStatus()]).finally(() => {
        setLoading(false);
      });
    }
  }, [session]);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Email baru wajib diisi", "error");
      return;
    }

    if (email === currentUserEmail) {
      showToast("Email baru harus berbeda dengan email saat ini", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Format email tidak valid", "error");
      return;
    }

    if (isGoogleUser) {
      showToast("Akun Google tidak dapat mengubah email", "error");
      return;
    }

    setIsEmailLoading(true);
    try {
      const response = await fetch("/api/auth/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail: email }),
      });
      const result = await response.json();

      if (response.ok && result.status === "success") {
        showToast(
          "Kode verifikasi telah dikirim ke email baru Anda",
          "success"
        );
        setPendingEmailChange(email);
        setUserIdForVerification(
          session?.backendUser?.id ? parseInt(session.backendUser.id) : null
        );
        setShowOtpVerification(true);
        setEmail("");
      } else {
        showToast(result.message || "Gagal mengubah email", "error");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      showToast("Terjadi kesalahan saat mengubah email", "error");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      showToast("Password lama wajib diisi", "error");
      return;
    }

    if (!newPassword.trim()) {
      showToast("Password baru wajib diisi", "error");
      return;
    }

    if (!confirmPassword.trim()) {
      showToast("Konfirmasi password wajib diisi", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Password baru dan konfirmasi password tidak cocok", "error");
      return;
    }

    if (currentPassword === newPassword) {
      showToast("Password baru harus berbeda dengan password lama", "error");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      showToast(
        "Gunakan minimal 8 karakter dengan kombinasi huruf dan angka",
        "error"
      );
      return;
    }

    if (isGoogleUser) {
      showToast("Akun Google tidak dapat mengubah password", "error");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        showToast("Password berhasil diubah", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(result.message || "Gagal mengubah password", "error");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showToast("Terjadi kesalahan saat mengubah password", "error");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleOtpVerificationComplete = () => {
    showToast("Email berhasil diubah dan diverifikasi!", "success");
    setCurrentUserEmail(pendingEmailChange);
    setPendingEmailChange("");
    setUserIdForVerification(null);
    setShowOtpVerification(false);
  };

  const handleOtpVerificationClose = () => {
    setPendingEmailChange("");
    setUserIdForVerification(null);
    setShowOtpVerification(false);
  };

  const handleMFAStatusChange = (isEnabled: boolean, methods: string[]) => {
    setMfaEnabled(isEnabled);
    setEnabledMethods(methods);
  };

  const handleMFASetupComplete = (method: string) => {
    showToast(`MFA ${method} berhasil diaktifkan!`, "success");

    fetchMFAStatus();
  };

  const fetchMFAStatus = async () => {
    try {
      const response = await fetch("/api/mfa/status");
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setMfaEnabled(result.data.isEnabled);
          setEnabledMethods(result.data.enabledMethods || []);
        }
      }
    } catch (error) {
      console.error("Error fetching MFA status:", error);
    }
  };
  return (
    <>
      <div
        className={`w-full h-full flex flex-col items-center rounded-xl border ${isDark ? "border-gray-600 bg-[#1A1A1A]" : "border-[#CFCFCF] bg-white"} p-3 md:p-5 gap-2.5 transition-colors duration-300`}
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Icon
                icon="line-md:loading-loop"
                className="text-4xl text-blue-500"
              />
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Memuat pengaturan keamanan...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start w-full h-full gap-10 overflow-y-auto">
            {" "}
            <div className="flex flex-col items-start w-full gap-2.5">
              <div
                className={`flex items-center justify-start w-full gap-3 pb-2.5 border-b ${isDark ? "border-gray-600" : "border-[#CFCFCF]"}`}
              >
                <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                  <Icon icon="mdi:email-sync" className="text-4xl text-white" />
                </div>
                <div className="w-full flex flex-col items-start">
                  <h1
                    className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
                  >
                    Ubah Email
                  </h1>
                  <p className="text-sm text-[#A0A0A0]">
                    Kelola email yang digunakan untuk masuk ke akun Anda
                  </p>
                  {currentUserEmail && (
                    <p
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} mt-1`}
                    >
                      Email saat ini:{" "}
                      <span className="font-medium">{currentUserEmail}</span>
                    </p>
                  )}
                </div>
              </div>{" "}
              {isGoogleUser ? (
                <div
                  className={`w-full p-4 ${isDark ? "bg-yellow-900/30 border-yellow-600" : "bg-yellow-50 border-yellow-200"} border rounded-lg`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="material-symbols:email"
                      className="text-yellow-600"
                    />
                    <p
                      className={`text-sm ${isDark ? "text-yellow-300" : "text-yellow-800"}`}
                    >
                      Akun Anda terdaftar melalui Google. Email tidak dapat
                      diubah.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleEmailChange}
                  className="w-full flex flex-col gap-2.5"
                >
                  <Input
                    label="Email Baru"
                    type="email"
                    icon="mage:email-opened-fill"
                    placeholder="Masukkan email baru..."
                    value={email}
                    onChangeValue={setEmail}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isEmailLoading}
                    className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEmailLoading ? (
                      <>
                        <Icon icon="eos-icons:loading" width={20} height={20} />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Simpan Perubahan
                        <Icon
                          icon="material-symbols:save"
                          width={20}
                          height={20}
                        />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>{" "}
            <div className="flex flex-col items-start w-full gap-2.5">
              <div
                className={`flex items-center justify-start w-full gap-3 pb-2.5 border-b ${isDark ? "border-gray-600" : "border-[#CFCFCF]"}`}
              >
                <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                  <Icon
                    icon="mdi:password-reset"
                    className="text-4xl text-white"
                  />
                </div>
                <div className="w-full flex flex-col items-start">
                  <h1
                    className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
                  >
                    Ubah Password
                  </h1>
                  <p className="text-sm text-[#A0A0A0]">
                    Kelola password yang digunakan untuk masuk ke akun Anda
                  </p>
                </div>
              </div>{" "}
              {isGoogleUser ? (
                <div
                  className={`w-full p-4 ${isDark ? "bg-yellow-900/30 border-yellow-600" : "bg-yellow-50 border-yellow-200"} border rounded-lg`}
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:information" className="text-yellow-600" />
                    <p
                      className={`text-sm ${isDark ? "text-yellow-300" : "text-yellow-800"}`}
                    >
                      Akun Anda terdaftar melalui Google. Password tidak dapat
                      diubah.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handlePasswordChange}
                  className="w-full flex flex-col gap-2.5"
                >
                  <Input
                    label="Password Lama"
                    type="password"
                    icon="mdi:lock"
                    placeholder="Masukkan password lama..."
                    value={currentPassword}
                    onChangeValue={setCurrentPassword}
                    required
                  />
                  <Input
                    label="Password Baru"
                    type="password"
                    icon="mdi:lock-plus"
                    placeholder="Masukkan password baru..."
                    value={newPassword}
                    onChangeValue={setNewPassword}
                    required
                  />{" "}
                  <div
                    className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"} -mt-2`}
                  >
                    Minimal 8 karakter dengan kombinasi huruf dan angka
                  </div>
                  <Input
                    label="Konfirmasi Password Baru"
                    type="password"
                    icon="mdi:lock-check"
                    placeholder="Masukkan konfirmasi password baru..."
                    value={confirmPassword}
                    onChangeValue={setConfirmPassword}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPasswordLoading ? (
                      <>
                        <Icon icon="eos-icons:loading" width={20} height={20} />
                        Memproses...
                      </>
                    ) : (
                      <>
                        Simpan Perubahan
                        <Icon
                          icon="material-symbols:save"
                          width={20}
                          height={20}
                        />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>{" "}
            <div className="flex flex-col items-start w-full gap-2.5">
              <div
                className={`flex items-center justify-start w-full gap-3 pb-2.5 border-b ${isDark ? "border-gray-600" : "border-[#CFCFCF]"}`}
              >
                <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                  <Icon
                    icon="mdi:two-factor-authentication"
                    className="text-4xl text-white"
                  />
                </div>
                <div className="w-full flex flex-col items-start">
                  <h1
                    className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
                  >
                    Multi-factor Authentication (MFA)
                  </h1>
                  <p className="text-sm text-[#A0A0A0]">
                    Tingkatkan keamanan akun dengan otentikasi multi-faktor
                  </p>
                </div>
              </div>{" "}
              {/* MFA Status Display */}
              <div
                className={`w-full p-4 ${isDark ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"} border rounded-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={mfaEnabled ? "mdi:shield-check" : "mdi:shield-off"}
                      className={`text-2xl ${mfaEnabled ? "text-green-600" : "text-gray-400"}`}
                    />
                    <div>
                      <p
                        className={`font-medium ${isDark ? "text-white" : "text-black"}`}
                      >
                        Status MFA: {mfaEnabled ? "Aktif" : "Tidak Aktif"}
                      </p>
                      {mfaEnabled && enabledMethods.length > 0 && (
                        <p
                          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                        >
                          Metode aktif: {enabledMethods.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mfaEnabled
                        ? "bg-green-100 text-green-800"
                        : isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {mfaEnabled ? "Aman" : "Rentan"}
                  </div>
                </div>
              </div>{" "}
              {/* MFA Action Buttons */}
              <div className="w-full flex flex-col gap-2.5">
                {!mfaEnabled ? (
                  <button
                    onClick={() => setShowMfaSetup(true)}
                    className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg"
                  >
                    <>
                      Aktifkan MFA
                      <Icon icon="mdi:shield-plus" width={20} height={20} />
                    </>
                  </button>
                ) : (
                  <div className="w-full flex flex-col gap-2">
                    <button
                      onClick={() => setShowMfaSetup(true)}
                      className="flex hover:opacity-80 cursor-pointer items-center justify-center gap-2.5 w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg"
                    >
                      <>
                        Kelola MFA
                        <Icon icon="mdi:cog" width={20} height={20} />
                      </>
                    </button>{" "}
                    <div
                      className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"} text-center`}
                    >
                      Tambah metode baru atau kelola pengaturan MFA yang ada
                    </div>
                  </div>
                )}
              </div>{" "}
            </div>
          </div>
        )}
      </div>{" "}
      {/* OTP Verification Modal */}
      {showOtpVerification && (
        <VerifyEmail
          email={pendingEmailChange}
          userId={userIdForVerification || undefined}
          onClose={handleOtpVerificationClose}
          onVerificationComplete={handleOtpVerificationComplete}
        />
      )}{" "}
      {/* MFA Setup Modal */}
      {showMfaSetup &&
        (mfaEnabled ? (
          <MFAManager
            isEnabled={mfaEnabled}
            enabledMethods={enabledMethods}
            onStatusChange={handleMFAStatusChange}
            onSetupClick={() => {
              setShowMfaSetup(false);
            }}
          />
        ) : (
          <MFASetup
            onClose={() => setShowMfaSetup(false)}
            onSetupComplete={handleMFASetupComplete}
          />
        ))}
    </>
  );
}
