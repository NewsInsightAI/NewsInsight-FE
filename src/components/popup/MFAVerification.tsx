"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastProvider";
import { signIn } from "next-auth/react";

interface MFAVerificationProps {
  email: string;
  onClose: () => void;
  onVerificationComplete: (backupCodeUsed?: boolean) => void;
  tempToken?: string;
  userId?: number;
  availableMethods?: string[];
  isLoginFlow?: boolean;
}

export default function MFAVerification({ 
  email, 
  onClose, 
  onVerificationComplete,
  tempToken,
  userId,
  availableMethods: propAvailableMethods,
  isLoginFlow = false
}: MFAVerificationProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [showTrustedDevice, setShowTrustedDevice] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  useEffect(() => {
    if (isLoginFlow && propAvailableMethods) {
      setAvailableMethods(propAvailableMethods);
      if (propAvailableMethods.length > 0) {
        setSelectedMethod(propAvailableMethods[0]);
      }
      setShowTrustedDevice(true);
    } else {
      fetchAvailableMethods();
    }
  }, [isLoginFlow, propAvailableMethods]);

  const fetchAvailableMethods = async () => {
    try {
      const response = await fetch("/api/mfa/status");
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setAvailableMethods(result.data.enabledMethods || []);
          if (result.data.enabledMethods?.length > 0) {
            setSelectedMethod(result.data.enabledMethods[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching MFA methods:", error);
    }
  };
  const handleSendCode = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);
    try {
      let body;
      if (isLoginFlow) {
        body = { 
          tempToken,
          method: selectedMethod,
          purpose: "login" 
        };
      } else {
        body = { 
          method: selectedMethod,
          purpose: "login" 
        };
      }

      const response = await fetch("/api/mfa/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        showToast("Kode verifikasi telah dikirim", "success");
      } else {
        showToast(result.message || "Gagal mengirim kode verifikasi", "error");
      }
    } catch (error) {
      console.error("Error sending MFA code:", error);
      showToast("Terjadi kesalahan saat mengirim kode", "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showToast("Masukkan kode verifikasi", "error");
      return;
    }

    setIsLoading(true);
    try {
      let endpoint, body;
        if (isLoginFlow) {
        endpoint = "/api/mfa/verify-login";
        body = {
          userId: userId,
          code: verificationCode,
          method: useBackupCode ? "backup" : selectedMethod,
          trustDevice
        };
      } else {
        endpoint = useBackupCode ? "/api/mfa/verify-backup" : "/api/mfa/verify-code";
        body = { 
          code: verificationCode,
          method: useBackupCode ? undefined : selectedMethod,
          trustDevice
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });      const result = await response.json();
      if (response.ok && result.status === "success") {
        if (isLoginFlow) {
          const signInResult = await signIn("credentials", {
            identifier: result.data.account.email,
            password: "__MFA_TOKEN__",
            mfaToken: result.data.token,
            redirect: false,
          });

          if (signInResult?.ok) {
            showToast("Verifikasi berhasil!", "success");
            onVerificationComplete(useBackupCode);
          } else {
            showToast("Gagal masuk setelah verifikasi MFA", "error");
          }
        } else {
          showToast("Verifikasi berhasil!", "success");
          onVerificationComplete(useBackupCode);
        }
      } else {
        showToast(result.message || "Kode verifikasi tidak valid", "error");
      }
    } catch (error) {
      console.error("Error verifying MFA code:", error);
      showToast("Terjadi kesalahan saat verifikasi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-lg">
              <Icon icon="mdi:shield-check" className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Verifikasi MFA
              </h2>
              <p className="text-sm text-gray-600">
                Langkah keamanan tambahan diperlukan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon icon="mdi:close" className="text-xl text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Account Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <Icon icon="mdi:account" className="inline mr-2" />
              Akun: <span className="font-medium">{email}</span>
            </p>
          </div>

          {!useBackupCode ? (
            <>
              {/* Method Selection */}
              {availableMethods.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Metode Verifikasi
                  </label>
                  <div className="space-y-2">
                    {availableMethods.map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          name="mfaMethod"
                          value={method}
                          checked={selectedMethod === method}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center gap-2">
                          <Icon 
                            icon={
                              method === "totp" ? "mdi:cellphone-key" :
                              method === "email" ? "mdi:email" : "mdi:shield"
                            } 
                            className="text-lg text-gray-600"
                          />
                          <span className="text-sm">
                            {method === "totp" ? "Aplikasi Authenticator" :
                             method === "email" ? "Email" : method}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Code Button */}
              {selectedMethod === "email" && (
                <button
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Icon icon="eos-icons:loading" className="inline mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:send" className="inline mr-2" />
                      Kirim Kode ke Email
                    </>
                  )}
                </button>
              )}              {/* Verification Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {`Kode Verifikasi ${selectedMethod === "totp" ? "(dari Aplikasi Authenticator)" : "(dari Email)"}`}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 z-10">
                    <Icon icon="mdi:key" width={20} height={20} />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Masukkan 6 digit kode..."
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
            </>
          ) : (            <>
              {/* Backup Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Cadangan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 z-10">
                    <Icon icon="mdi:backup-restore" width={20} height={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Masukkan kode cadangan..."
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Setiap kode cadangan hanya dapat digunakan sekali
                </p>
              </div>
            </>)}

          {/* Trust Device Option - Only show for login flow */}
          {showTrustedDevice && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="trustDevice"
                checked={trustDevice}
                onChange={(e) => setTrustDevice(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="trustDevice" className="text-sm text-gray-700">
                Percayai perangkat ini selama 30 hari
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode.trim()}
              className="w-full bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Icon icon="eos-icons:loading" className="inline mr-2" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="inline mr-2" />
                  Verifikasi
                </>
              )}
            </button>

            {/* Backup Code Toggle */}
            <button
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setVerificationCode("");
              }}
              className="w-full text-gray-600 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              {useBackupCode ? (
                <>
                  <Icon icon="mdi:arrow-left" className="inline mr-2" />
                  Kembali ke Verifikasi Normal
                </>
              ) : (
                <>
                  <Icon icon="mdi:backup-restore" className="inline mr-2" />
                  Gunakan Kode Cadangan
                </>
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Kode verifikasi berlaku selama 5 menit</p>
            <p>• Jika tidak menerima kode, periksa folder spam</p>
            <p>• Hubungi admin jika mengalami masalah</p>
          </div>
        </div>
      </div>
    </div>
  );
}
