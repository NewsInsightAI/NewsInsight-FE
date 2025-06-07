"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

interface MFAData {
  userId: number;
  email: string;
  enabledMethods: string[];
}

export default function MFAVerifyPage() {
  const [code, setCode] = useState("");
  const [method, setMethod] = useState("totp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mfaData, setMFAData] = useState<MFAData | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setMFAData(parsedData);
        if (parsedData.enabledMethods?.length > 0) {
          setMethod(parsedData.enabledMethods[0]);
        }
      } catch (error) {
        console.error("Error parsing MFA data:", error);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaData || !code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/mfa/verify-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: mfaData.userId,
          code: code.trim(),
          method: method,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        const signInResult = await signIn("credentials", {
          identifier: mfaData.email,
          password: "__MFA_TOKEN__",
          mfaToken: result.data.token,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push("/dashboard");
        } else {
          setError("Gagal masuk setelah verifikasi MFA");
        }
      } else {
        setError(result.message || "Kode verifikasi tidak valid");
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      setError("Terjadi kesalahan saat verifikasi");
    } finally {
      setLoading(false);
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "totp":
        return "Aplikasi Authenticator";
      case "email":
        return "Email";
      case "sms":
        return "SMS";
      default:
        return method;
    }
  };

  const sendEmailCode = async () => {
    if (!mfaData || method !== "email") return;

    setLoading(true);
    try {
      const response = await fetch("/api/mfa/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "email",
          userId: mfaData.userId,
          purpose: "login",
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setError("");
        alert("Kode verifikasi telah dikirim ke email Anda");
      } else {
        setError(result.message || "Gagal mengirim kode verifikasi");
      }
    } catch (error) {
      console.error("Send email code error:", error);
      setError("Terjadi kesalahan saat mengirim kode");
    } finally {
      setLoading(false);
    }
  };

  if (!mfaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verifikasi Multi-Factor Authentication
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masukkan kode verifikasi untuk melanjutkan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleVerifyMFA}>
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                Metode Verifikasi
              </label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {mfaData.enabledMethods.map((m) => (
                  <option key={m} value={m}>
                    {getMethodLabel(m)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Kode Verifikasi
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={method === "totp" ? "Masukkan 6 digit kode" : "Masukkan kode verifikasi"}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                maxLength={method === "totp" ? 6 : 10}
                required
              />
            </div>

            {method === "email" && (
              <div>
                <button
                  type="button"
                  onClick={sendEmailCode}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim Kode ke Email"}
                </button>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Memverifikasi..." : "Verifikasi"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => router.push("/login")}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
            >
              Kembali ke halaman login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
