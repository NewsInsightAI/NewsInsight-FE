"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastProvider";

interface MFAManagerProps {
  isEnabled: boolean;
  enabledMethods: string[];
  onStatusChange: (isEnabled: boolean, methods: string[]) => void;
  onSetupClick: () => void;
}

export default function MFAManager({
  isEnabled,
  enabledMethods,
  onStatusChange,
  onSetupClick,
}: MFAManagerProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const disableMethod = async (method: string) => {
    if (enabledMethods.length === 1) {
      if (
        !confirm(
          "Ini adalah metode MFA terakhir Anda. Menonaktifkannya akan menghapus seluruh perlindungan MFA. Lanjutkan?"
        )
      ) {
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/mfa/method/${method}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        onStatusChange(result.data.isEnabled, result.data.enabledMethods);
        showToast(`MFA ${method} berhasil dinonaktifkan`, "success");
      } else {
        showToast(result.message || "Gagal menonaktifkan MFA", "error");
      }
    } catch (error) {
      console.error("Error disabling MFA method:", error);
      showToast("Terjadi kesalahan saat menonaktifkan MFA", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const viewBackupCodes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/mfa/backup-codes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setBackupCodes(result.data.backupCodes || []);
        setShowBackupCodes(true);
      } else {
        showToast(result.message || "Gagal mengambil backup codes", "error");
      }
    } catch (error) {
      console.error("Error getting backup codes:", error);
      showToast("Terjadi kesalahan saat mengambil backup codes", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateBackupCodes = async () => {
    if (!confirm("Backup codes lama akan tidak berlaku lagi. Lanjutkan?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/mfa/backup-codes/regenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setBackupCodes(result.data.backupCodes || []);
        showToast("Backup codes baru berhasil dibuat", "success");
      } else {
        showToast(result.message || "Gagal membuat backup codes baru", "error");
      }
    } catch (error) {
      console.error("Error regenerating backup codes:", error);
      showToast("Terjadi kesalahan saat membuat backup codes baru", "error");
    } finally {
      setIsLoading(false);
    }
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

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "totp":
        return "mdi:cellphone-key";
      case "email":
        return "mdi:email-lock";
      case "sms":
        return "mdi:message-lock";
      default:
        return "mdi:security";
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case "totp":
        return "Authenticator App";
      case "email":
        return "Email Verification";
      case "sms":
        return "SMS Verification";
      default:
        return method;
    }
  };

  if (!isEnabled) {
    return (
      <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Icon icon="mdi:shield-off" className="text-gray-400 text-2xl" />
          <div>
            <h3 className="font-medium text-gray-700">MFA Tidak Aktif</h3>
            <p className="text-sm text-gray-500">
              Tingkatkan keamanan akun Anda dengan mengaktifkan MFA
            </p>
          </div>
        </div>
        <button
          onClick={onSetupClick}
          className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-semibold py-2.5 rounded-lg hover:opacity-80 transition"
        >
          Aktifkan MFA
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Icon icon="mdi:shield-check" className="text-green-600 text-2xl" />
            <div>
              <h3 className="font-medium text-green-700">MFA Aktif</h3>
              <p className="text-sm text-green-600">
                Akun Anda dilindungi dengan {enabledMethods.length} metode MFA
              </p>
            </div>
          </div>
        </div>

        {/* Enabled Methods */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Metode Aktif:</h4>
          {enabledMethods.map((method) => (
            <div
              key={method}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon
                    icon={getMethodIcon(method)}
                    className="text-blue-600"
                  />
                </div>
                <div>
                  <h5 className="font-medium">{getMethodName(method)}</h5>
                  <p className="text-sm text-gray-500">
                    Aktif dan terkonfigurasi
                  </p>
                </div>
              </div>
              <button
                onClick={() => disableMethod(method)}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                <Icon icon="mdi:delete" className="text-lg" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onSetupClick}
            className="w-full border border-blue-300 text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-blue-50 transition"
          >
            Tambah Metode MFA
          </button>

          <div className="flex gap-2">
            <button
              onClick={viewBackupCodes}
              disabled={isLoading}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              {isLoading ? (
                <Icon
                  icon="eos-icons:loading"
                  className="animate-spin mx-auto"
                />
              ) : (
                "Lihat Backup Codes"
              )}
            </button>
            <button
              onClick={regenerateBackupCodes}
              disabled={isLoading}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Buat Ulang Codes
            </button>
          </div>
        </div>
      </div>

      {/* Backup Codes Modal */}
      <AnimatePresence>
        {showBackupCodes && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Backup Codes</h2>
                <button
                  onClick={() => setShowBackupCodes(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:close" className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="mdi:warning" className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Penting
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Simpan kode-kode ini di tempat yang aman. Setiap kode hanya
                    dapat digunakan sekali.
                  </p>
                </div>

                {backupCodes.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg">
                      {backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="font-mono text-sm text-center py-2 bg-white rounded border"
                        >
                          {code}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
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
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Icon
                      icon="mdi:key-off"
                      className="text-4xl mb-2 mx-auto"
                    />
                    <p>Tidak ada backup codes tersedia</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
