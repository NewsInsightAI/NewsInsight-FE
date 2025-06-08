"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion, AnimatePresence } from "framer-motion";

interface CvPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string;
  fileName?: string;
}

export default function CvPreview({
  isOpen,
  onClose,
  cvUrl,
  fileName,
}: CvPreviewProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = fileName || "CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center p-2 rounded-lg bg-red-100">
                  <Icon icon="mdi:file-pdf" className="text-2xl text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Preview CV
                  </h2>
                  {fileName && (
                    <p className="text-sm text-gray-600">{fileName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Icon icon="material-symbols:download" className="text-lg" />
                  Download
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-6">
              <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
                <iframe
                  src={`${cvUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  title="CV Preview"
                  onError={() => {
                    console.error("Failed to load PDF");
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Icon
                      icon="mdi:file-pdf"
                      className="text-6xl text-red-600"
                    />
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">
                        Browser Anda tidak mendukung preview PDF
                      </p>
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </iframe>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon icon="material-symbols:info" className="text-lg" />
                  <span>File PDF - Klik dan geser untuk navigasi</span>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
