import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDarkMode } from "@/context/DarkModeContext";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  currentStatus: string;
  newsTitle: string;
  hasFactCheck: boolean;
  isLoading?: boolean;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  newsTitle,
  hasFactCheck,
  isLoading = false,
}) => {
  const { isDark } = useDarkMode();
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    {
      value: "draft",
      label: "Draft",
      icon: "material-symbols:draft",
      color: "text-gray-500",
      bgColor: "bg-gray-100",
      description: "Berita masih dalam tahap penulisan",
    },
    {
      value: "review",
      label: "Review",
      icon: "mdi:eye-check",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      description: "Berita menunggu review dari editor",
    },
    {
      value: "scheduled",
      label: "Terjadwal",
      icon: "mdi:calendar-clock",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      description: "Berita dijadwalkan untuk dipublikasi",
    },
    {
      value: "published",
      label: "Terbit",
      icon: "ic:round-publish",
      color: "text-green-500",
      bgColor: "bg-green-100",
      description: "Berita telah dipublikasi dan dapat dilihat publik",
      requiresFactCheck: true,
    },
    {
      value: "archived",
      label: "Arsip",
      icon: "material-symbols:archive-rounded",
      color: "text-red-500",
      bgColor: "bg-red-100",
      description: "Berita diarsipkan dan tidak ditampilkan",
    },
  ];

  const handleStatusChange = (status: string) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);

    // Check if status requires fact check but hasn't been done
    if (statusOption?.requiresFactCheck && !hasFactCheck) {
      return; // Don't allow selection
    }

    setSelectedStatus(status);
  };

  const handleConfirm = () => {
    if (selectedStatus !== currentStatus) {
      onConfirm(selectedStatus);
    }
  };

  const isStatusDisabled = (status: string) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.requiresFactCheck && !hasFactCheck;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md mx-4 rounded-xl shadow-xl transition-colors duration-300 ${
          isDark
            ? "bg-gray-800 border border-gray-600"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Ubah Status Berita
            </h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
            </button>
          </div>
          <p
            className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {newsTitle}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Fact Check Warning */}
          {!hasFactCheck && (
            <div
              className={`mb-4 p-3 rounded-lg border ${
                isDark
                  ? "bg-yellow-900/20 border-yellow-700 text-yellow-300"
                  : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon
                  icon="material-symbols:warning"
                  className="w-5 h-5 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">Fact Check Diperlukan</p>
                  <p className="text-xs mt-1">
                    Berita ini belum menjalankan fact check. Status
                    &quot;Terbit&quot; tidak dapat dipilih tanpa fact check.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Options */}
          <div className="space-y-2">
            {statusOptions.map((option) => {
              const isDisabled = isStatusDisabled(option.value);
              const isSelected = selectedStatus === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={isDisabled}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? isDark
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-blue-500 bg-blue-50"
                      : isDark
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-200 hover:border-gray-300"
                  } ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-sm cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? "bg-gray-700" : option.bgColor
                      }`}
                    >
                      <Icon
                        icon={option.icon}
                        className={`w-5 h-5 ${isDark ? "text-gray-300" : option.color}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {option.label}
                        </span>
                        {isDisabled && (
                          <Icon
                            icon="material-symbols:lock"
                            className="w-4 h-4 text-gray-400"
                          />
                        )}
                        {isSelected && (
                          <Icon
                            icon="mdi:check-circle"
                            className="w-4 h-4 text-blue-500"
                          />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex items-center justify-end gap-3 ${
            isDark ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isDark
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || selectedStatus === currentStatus}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              isLoading || selectedStatus === currentStatus
                ? "opacity-50 cursor-not-allowed"
                : ""
            } ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading && (
              <Icon icon="eos-icons:loading" className="w-4 h-4 animate-spin" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
