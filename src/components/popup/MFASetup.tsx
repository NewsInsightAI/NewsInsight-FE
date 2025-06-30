/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastProvider";
import Input from "../ui/Input";

interface MFASetupProps {
  onClose: () => void;
  onSetupComplete: (method: string) => void;
}

interface TOTPSetupData {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
}

export default function MFASetup({ onClose, onSetupComplete }: MFASetupProps) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<
    "choose" | "totp-setup" | "totp-verify" | "email-setup"
  >("choose");
  const [totpData, setTotpData] = useState<TOTPSetupData | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const handleMethodChoice = (method: "totp" | "email") => {
    if (method === "totp") {
      setupTOTP();
    } else if (method === "email") {
      setupEmailMFA();
    }
  };

  const setupTOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mfa/totp/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setTotpData(result.data);
        setCurrentStep("totp-setup");
      } else {
        showToast(result.message || "Gagal setup TOTP", "error");
      }
    } catch (error) {
      console.error("Error setting up TOTP:", error);
      showToast("Terjadi kesalahan saat setup TOTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTOTP = async () => {
    if (!totpCode.trim()) {
      showToast("Kode TOTP wajib diisi", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/mfa/totp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: totpCode }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setBackupCodes(result.data.backupCodes || []);
        setShowBackupCodes(true);
        showToast("TOTP berhasil diaktifkan!", "success");
      } else {
        showToast(result.message || "Gagal verifikasi TOTP", "error");
      }
    } catch (error) {
      console.error("Error verifying TOTP:", error);
      showToast("Terjadi kesalahan saat verifikasi TOTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const setupEmailMFA = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mfa/email/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        showToast("MFA Email berhasil diaktifkan!", "success");
        onSetupComplete("email");
        onClose();
      } else {
        showToast(result.message || "Gagal mengaktifkan MFA Email", "error");
      }
    } catch (error) {
      console.error("Error setting up email MFA:", error);
      showToast("Terjadi kesalahan saat setup MFA Email", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupCodesComplete = () => {
    onSetupComplete("totp");
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Disalin ke clipboard", "success");
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join("\\n");
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "newsinsight-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Setup MFA</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon icon="mdi:close" className="text-xl" />
          </button>
        </div>

        {/* Choose Method Step */}
        {currentStep === "choose" && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Pilih metode autentikasi dua faktor yang ingin Anda gunakan:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleMethodChoice("totp")}
                disabled={isLoading}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon
                      icon="mdi:cellphone-key"
                      className="text-blue-600 text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Authenticator App (TOTP)</h3>
                    <p className="text-sm text-gray-500">
                      Gunakan aplikasi seperti Google Authenticator atau Authy
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodChoice("email")}
                disabled={isLoading}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Icon
                      icon="mdi:email-lock"
                      className="text-green-600 text-xl"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Verification</h3>
                    <p className="text-sm text-gray-500">
                      Terima kode verifikasi melalui email
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TOTP Setup Step */}
        {currentStep === "totp-setup" && totpData && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium mb-2">Scan QR Code</h3>
              <div className="bg-white p-4 rounded-lg border inline-block">
                <img
                  src={totpData.qrCode}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Atau masukkan kode manual ini ke aplikasi authenticator Anda:
              </p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm font-mono break-all">
                  {totpData.manualEntryKey}
                </code>
                <button
                  onClick={() => copyToClipboard(totpData.manualEntryKey)}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <Icon icon="mdi:content-copy" className="text-gray-600" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep("totp-verify")}
              className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg hover:opacity-80 transition"
            >
              Lanjutkan
            </button>
          </div>
        )}

        {/* TOTP Verify Step */}
        {currentStep === "totp-verify" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Verifikasi Setup</h3>
              <p className="text-sm text-gray-600 mb-4">
                Masukkan kode 6 digit dari aplikasi authenticator Anda:
              </p>

              <Input
                label="Kode TOTP"
                type="text"
                icon="mdi:key"
                placeholder="123456"
                value={totpCode}
                onChangeValue={setTotpCode}
                maxLength={6}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep("totp-setup")}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Kembali
              </button>
              <button
                onClick={verifyTOTP}
                disabled={isLoading || totpCode.length !== 6}
                className="flex-1 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg hover:opacity-80 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <Icon
                    icon="eos-icons:loading"
                    className="animate-spin mx-auto"
                  />
                ) : (
                  "Verifikasi"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Backup Codes Display */}
        {showBackupCodes && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-green-600">
                Setup TOTP Berhasil!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Simpan kode backup ini di tempat yang aman. Anda dapat
                menggunakan kode ini jika tidak dapat mengakses aplikasi
                authenticator.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:warning" className="text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Penting: Simpan kode ini sekarang!
                  </span>
                </div>
                <p className="text-sm text-yellow-700">
                  Kode backup hanya ditampilkan sekali. Setelah Anda menutup
                  dialog ini, kode tidak akan ditampilkan lagi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg mb-4">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm text-center py-2 bg-white rounded border"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => copyToClipboard(backupCodes.join(", "))}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:content-copy" />
                  Salin
                </button>
                <button
                  onClick={downloadBackupCodes}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:download" />
                  Unduh
                </button>
              </div>
            </div>

            <button
              onClick={handleBackupCodesComplete}
              className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg hover:opacity-80 transition"
            >
              Selesai
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
