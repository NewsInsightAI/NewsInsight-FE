import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDarkMode } from "@/context/DarkModeContext";
import { useFactCheck } from "@/hooks/useFactCheck";

interface NewsData {
  id: number;
  title: string;
  content?: string;
}

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

interface BatchFactCheckResultItem {
  newsId: number;
  success: boolean;
  factCheck?: FactCheckResult;
  error?: string;
}

interface BatchFactCheckData {
  totalChecked: number;
  results: BatchFactCheckResultItem[];
}

interface BatchFactCheckButtonProps {
  selectedNewsIds: number[];
  newsData: NewsData[];
  onFactCheckComplete?: (results: BatchFactCheckData) => void;
  disabled?: boolean;
}

const BatchFactCheckButton: React.FC<BatchFactCheckButtonProps> = ({
  selectedNewsIds,
  newsData,
  onFactCheckComplete,
  disabled = false,
}) => {
  const { isDark } = useDarkMode();
  const { loading, checkBatchNews } = useFactCheck();
  const [showResults, setShowResults] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchFactCheckData | null>(
    null
  );

  const handleBatchFactCheck = async () => {
    if (disabled || loading || selectedNewsIds.length === 0) return;

    // Prepare news items for batch checking
    const newsItems = selectedNewsIds.map((id) => {
      const news = newsData.find((n) => n.id === id);
      return {
        id,
        query: news
          ? news.content
            ? `${news.title} ${news.content}`
            : news.title
          : `News ID ${id}`,
        languageCode: "id",
      };
    });

    const result = await checkBatchNews(newsItems);

    if (result?.success && result.data) {
      setBatchResults(result.data);
      setShowResults(true);
      onFactCheckComplete?.(result.data);
    }
  };

  const getSelectedCount = () => selectedNewsIds.length;

  return (
    <>
      <button
        onClick={handleBatchFactCheck}
        disabled={disabled || loading || selectedNewsIds.length === 0}
        className={`
          inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full md:rounded-3xl font-medium
          transition-all duration-300 ease-in-out text-sm md:text-base
          ${
            disabled || loading || selectedNewsIds.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-80"
          }
          ${
            isDark
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }
        `}
        title={`Fact check ${getSelectedCount()} berita yang dipilih`}
      >
        {loading ? (
          <Icon
            icon="eos-icons:loading"
            className="w-4 h-4 md:w-5 md:h-5 animate-spin"
          />
        ) : (
          <Icon
            icon="material-symbols:batch-prediction"
            className="w-4 h-4 md:w-5 md:h-5"
          />
        )}
        <span className="whitespace-nowrap">
          <span className="hidden sm:inline">
            {loading ? "Mengecek..." : `Fact Check (${getSelectedCount()})`}
          </span>
          <span className="sm:hidden">
            {loading ? "Cek..." : `FC (${getSelectedCount()})`}
          </span>
        </span>
      </button>

      {/* Batch Results Modal */}
      {showResults && batchResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    icon="material-symbols:batch-prediction"
                    className="w-6 h-6 text-purple-500"
                  />
                  <h2 className="text-xl font-bold">Hasil Batch Fact Check</h2>
                </div>
                <button
                  onClick={() => setShowResults(false)}
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
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Ringkasan: {batchResults.totalChecked} berita dicek
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div
                    className={`p-4 rounded-lg ${isDark ? "bg-green-900/20" : "bg-green-50"}`}
                  >
                    <div className="text-green-600 font-bold text-xl">
                      {
                        batchResults.results.filter(
                          (r: BatchFactCheckResultItem) => r.success
                        ).length
                      }
                    </div>
                    <div className="text-sm text-green-600">Berhasil dicek</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${isDark ? "bg-red-900/20" : "bg-red-50"}`}
                  >
                    <div className="text-red-600 font-bold text-xl">
                      {
                        batchResults.results.filter(
                          (r: BatchFactCheckResultItem) => !r.success
                        ).length
                      }
                    </div>
                    <div className="text-sm text-red-600">Gagal dicek</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${isDark ? "bg-blue-900/20" : "bg-blue-50"}`}
                  >
                    <div className="text-blue-600 font-bold text-xl">
                      {
                        batchResults.results.filter(
                          (r: BatchFactCheckResultItem) =>
                            r.success && r.factCheck?.isVerified
                        ).length
                      }
                    </div>
                    <div className="text-sm text-blue-600">Ditemukan klaim</div>
                  </div>
                </div>

                {/* Individual Results */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Detail Hasil:</h4>
                  {batchResults.results.map(
                    (result: BatchFactCheckResultItem) => {
                      const news = newsData.find((n) => n.id === result.newsId);
                      return (
                        <div
                          key={result.newsId}
                          className={`p-4 rounded-lg border ${
                            isDark
                              ? "border-gray-600 bg-gray-700"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">
                              {news?.title || `Berita ID ${result.newsId}`}
                            </h5>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                result.success
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {result.success ? "Berhasil" : "Gagal"}
                            </span>
                          </div>

                          {result.success && result.factCheck ? (
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-medium">
                                  Klaim ditemukan:
                                </span>{" "}
                                {result.factCheck.totalClaims}
                              </p>
                              {result.factCheck.trustScore !== null && (
                                <p>
                                  <span className="font-medium">
                                    Skor kepercayaan:
                                  </span>{" "}
                                  <span
                                    className={`font-bold ${
                                      result.factCheck.trustScore >= 70
                                        ? "text-green-600"
                                        : result.factCheck.trustScore >= 40
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {result.factCheck.trustScore}%
                                  </span>
                                </p>
                              )}
                              <p>
                                <span className="font-medium">Status:</span>{" "}
                                {result.factCheck.isVerified
                                  ? "Terverifikasi"
                                  : "Belum terverifikasi"}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-red-600">
                              {result.error ||
                                "Terjadi kesalahan saat fact check"}
                            </p>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
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
                  onClick={() => setShowResults(false)}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatchFactCheckButton;
