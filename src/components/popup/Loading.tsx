"use client";
import React from "react";
import { SyncLoader } from "react-spinners";

export default function Loading(props: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6 text-black bg-black/30 backdrop-blur-sm"
      style={{ zIndex: 1000 }}
    >
      <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-[95%] text-center space-y-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <SyncLoader
            color="#367AF2"
            size={20}
            margin={4}
            speedMultiplier={1}
          />
          <p className="text-gray-800 text-sm">
            Sedang memuat, harap tunggu...
          </p>
        </div>
      </div>
    </div>
  );
}
