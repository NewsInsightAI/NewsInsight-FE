"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

const rawData = {
  "7D": [
    { name: "Min", value: 50 },
    { name: "Sen", value: 80 },
    { name: "Sel", value: 40 },
    { name: "Rab", value: 100 },
    { name: "Kam", value: 70 },
    { name: "Jum", value: 120 },
    { name: "Sab", value: 90 },
  ],
  "14D": Array.from({ length: 14 }, (_, i) => ({
    name: `H${i + 1}`,
    value: Math.floor(Math.random() * 100) + 30,
  })),
  "30D": Array.from({ length: 30 }, (_, i) => ({
    name: `H${i + 1}`,
    value: Math.floor(Math.random() * 100) + 30,
  })),
};

export default function VisitChartCard() {
  const { isDark } = useDarkMode();
  const [selected, setSelected] = useState<"7D" | "14D" | "30D">("7D");
  const data = rawData[selected];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full h-full rounded-3xl p-4 md:p-6 lg:p-8 border flex flex-col gap-4 transition-colors duration-300 min-h-[240px] md:min-h-[280px] lg:min-h-[380px] xl:min-h-[420px] ${
        isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
            <Icon icon="solar:graph-bold" className="text-2xl" />
          </div>{" "}
          <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
            <TranslatedText>Grafik Kunjungan</TranslatedText>
          </p>
        </div>{" "}
        <div
          className={`flex items-center rounded-full ${
            isDark ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          {["7D", "14D", "30D"].map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option as "7D" | "14D" | "30D")}
              className={`text-sm px-4 py-2 rounded-full transition ${
                selected === option
                  ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-600 cursor-pointer"
                    : "text-gray-600 hover:bg-gray-200 cursor-pointer"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap={
              selected === "7D" ? 20 : selected === "14D" ? 10 : 5
            }
          >
            {" "}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#4B5563" : "#E5E7EB"}
            />
            <XAxis dataKey="name" stroke={isDark ? "#9CA3AF" : "#6B7280"} />
            <YAxis
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              hide
              domain={[0, 150]}
            />
            <Tooltip
              cursor={{ fill: isDark ? "#374151" : "#F3F4F6" }}
              contentStyle={{
                backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                border: `1px solid ${isDark ? "#4B5563" : "#E5E7EB"}`,
                borderRadius: "8px",
                color: isDark ? "#F9FAFB" : "#111827",
              }}
            />
            <Bar
              dataKey="value"
              radius={[20, 20, 20, 20]}
              fill="url(#colorUv)"
              label={({ x, y, width, value }) => (
                <text
                  x={x + width / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  gradientUnits="userSpaceOnUse"
                  fill="url(#colorUv)"
                  className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold"
                >
                  {value}
                </text>
              )}
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3BD5FF" stopOpacity={1} />
                <stop offset="100%" stopColor="#367AF2" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
