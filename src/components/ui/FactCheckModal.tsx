import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDarkMode } from "@/context/DarkModeContext";
import { useFactCheck } from "@/hooks/useFactCheck";

interface FactCheckClaim {
  text: string;
  claimant: string;
  claimDate: string | null;
  reviewPublisher: string;
  reviewTitle: string;
  reviewUrl: string;
  rating: string;
  languageCode: string;
}

interface FactCheckResult {
  query: string;
  totalClaims: number;
  claims: FactCheckClaim[];
  trustScore: number | null;
  isVerified: boolean;
  checkedAt: string;
}

interface FactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: FactCheckResult | null;
  newsTitle: string;
}

const FactCheckModal: React.FC<FactCheckModalProps> = ({
  isOpen,
  onClose,
  result,
  newsTitle,
}) => {
  const { isDark } = useDarkMode();
  const { getTrustScoreColor, getTrustScoreLabel, getFactCheckStatus } =
    useFactCheck();

  if (!isOpen || !result) return null;

  const status = getFactCheckStatus(result);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon
                icon="material-symbols:fact-check"
                className="w-6 h-6 text-blue-500"
              />
              <h2 className="text-xl font-bold">Hasil Fact Check</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Icon icon="material-symbols:close" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* News Title */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Berita yang dicek:
            </h3>
            <p className="font-medium">{newsTitle}</p>
          </div>

          {/* Overall Status */}
          <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Status Verifikasi</h4>
              <span className={`font-bold ${status.color}`}>
                {status.label}
              </span>
            </div>

            {result.trustScore !== null && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Skor Kepercayaan:
                </span>
                <span
                  className={`font-bold ${getTrustScoreColor(result.trustScore)}`}
                >
                  {result.trustScore}% - {getTrustScoreLabel(result.trustScore)}
                </span>
              </div>
            )}
          </div>

          {/* Query */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Query Pencarian:</h4>
            <p
              className={`p-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
            >
              {result.query}
            </p>
          </div>

          {/* Claims */}
          {result.totalClaims > 0 ? (
            <div className="mb-6">
              <h4 className="font-semibold mb-4">
                Ditemukan {result.totalClaims} klaim terkait:
              </h4>
              <div className="space-y-4">
                {result.claims.map((claim, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">Klaim #{index + 1}</h5>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          claim.rating.toLowerCase().includes("false") ||
                          claim.rating.toLowerCase().includes("salah")
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : claim.rating.toLowerCase().includes("true") ||
                                claim.rating.toLowerCase().includes("benar")
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        }`}
                      >
                        {claim.rating}
                      </span>
                    </div>

                    <p className="text-sm mb-3">{claim.text}</p>

                    <div className="text-xs space-y-1">
                      <p>
                        <span className="font-medium">Diklaim oleh:</span>{" "}
                        {claim.claimant}
                      </p>
                      <p>
                        <span className="font-medium">Direview oleh:</span>{" "}
                        {claim.reviewPublisher}
                      </p>
                      {claim.reviewTitle && (
                        <p>
                          <span className="font-medium">Judul Review:</span>{" "}
                          {claim.reviewTitle}
                        </p>
                      )}
                      {claim.reviewUrl && (
                        <p>
                          <span className="font-medium">Sumber:</span>{" "}
                          <a
                            href={claim.reviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Lihat Review
                          </a>
                        </p>
                      )}
                      {claim.claimDate && (
                        <p>
                          <span className="font-medium">Tanggal Klaim:</span>{" "}
                          {new Date(claim.claimDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:info"
                  className="w-5 h-5 text-yellow-600"
                />
                <p className="text-yellow-800 dark:text-yellow-200">
                  Tidak ditemukan klaim terkait untuk berita ini di database
                  fact-check. Ini tidak berarti berita tersebut pasti benar atau
                  salah.
                </p>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dicek pada: {new Date(result.checkedAt).toLocaleString("id-ID")}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactCheckModal;
