import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFactCheck } from "@/hooks/useFactCheck";
import FactCheckModal from "./FactCheckModal";

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

interface FactCheckButtonProps {
  newsId: number;
  newsTitle: string;
  newsContent?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const FactCheckButton: React.FC<FactCheckButtonProps> = ({
  newsId,
  newsTitle,
  newsContent,
  disabled = false,
  size = "md",
  fullWidth = false,
}) => {
  const { loading, checkSingleNews } = useFactCheck();
  const [modalOpen, setModalOpen] = useState(false);
  const [factCheckResult, setFactCheckResult] =
    useState<FactCheckResult | null>(null);

  const handleFactCheck = async () => {
    if (disabled || loading) return;

    // Use title and content as query for fact checking
    const query = newsContent ? `${newsTitle} ${newsContent}` : newsTitle;

    const result = await checkSingleNews(newsId, query, "id");

    if (result?.success && result.data) {
      setFactCheckResult(result.data.factCheck);
      setModalOpen(true);
    }
  };

  const buttonSizes = {
    sm: "px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const mobileSizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <>
      <button
        onClick={handleFactCheck}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-1 rounded-full
          transition-colors duration-200 border min-w-0
          ${fullWidth ? "w-full flex-1" : "sm:gap-2"}
          ${fullWidth ? mobileSizes[size] : buttonSizes[size]}
          ${
            disabled || loading
              ? "border-[#DFDFDF] text-[#DFDFDF] bg-[#F5F5F5]/15 cursor-not-allowed"
              : "border-[#10B981] bg-[#10B981]/15 text-[#10B981] hover:opacity-80 hover:cursor-pointer"
          }
        `}
        title="Cek fakta berita ini"
      >
        {loading ? (
          <Icon
            icon="eos-icons:loading"
            className={`animate-spin ${fullWidth ? "" : "sm:mr-1"}`}
            width={12}
            height={12}
          />
        ) : (
          <Icon
            icon="material-symbols:fact-check"
            className={fullWidth ? "" : "sm:mr-1"}
            width={12}
            height={12}
          />
        )}
        <span className={fullWidth ? "" : "hidden sm:inline"}>
          {loading ? "Mengecek..." : "Fact Check"}
        </span>
      </button>

      <FactCheckModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        result={factCheckResult}
        newsTitle={newsTitle}
      />
    </>
  );
};

export default FactCheckButton;
