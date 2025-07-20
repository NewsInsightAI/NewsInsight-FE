"use client";
import React, { useState, useEffect, useCallback } from "react";
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

interface VisitData {
  name: string;
  value: number;
  date: string;
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    date: string;
    page_views: number;
    unique_visitors: number;
  }[];
}

export default function VisitChartCard() {
  const { isDark } = useDarkMode();
  const [selected, setSelected] = useState<"7D" | "14D" | "30D">("7D");
  const [data, setData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format date for display
  const formatDateForDisplay = (date: string, period: string) => {
    const d = new Date(date);
    if (period === "7D") {
      return d.toLocaleDateString("id-ID", { weekday: "short" }).slice(0, 3);
    } else {
      return d.getDate().toString();
    }
  };

  // Fetch analytics data
  const fetchVisitData = useCallback(
    async (days: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/analytics/visit-chart?days=${days}`);
        const result: AnalyticsResponse = await response.json();

        if (result.success) {
          if (result.data && result.data.length > 0) {
            const formattedData: VisitData[] = result.data.map((item) => ({
              name: formatDateForDisplay(item.date, selected),
              value: item.page_views,
              date: item.date,
            }));
            setData(formattedData);
          } else {
            // No real data available yet
            setData([]);
          }
        } else {
          setError("Gagal memuat data kunjungan");
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching visit data:", err);
        setError("Gagal memuat data kunjungan");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [selected]
  );

  useEffect(() => {
    const daysMap = { "7D": 7, "14D": 14, "30D": 30 };
    fetchVisitData(daysMap[selected]);
  }, [selected, fetchVisitData]);

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
          </div>
          <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
            <TranslatedText>Grafik Kunjungan</TranslatedText>
          </p>
        </div>
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

      {/* Loading/Error/Empty States */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Icon
              icon="mdi:alert-circle-outline"
              className="mx-auto h-8 w-8 text-gray-400 mb-2"
            />
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Icon
              icon="mdi:chart-line-variant"
              className="mx-auto h-12 w-12 text-gray-300 mb-4"
            />
            <p className="text-sm text-gray-500 mb-2">
              <TranslatedText>Belum ada data kunjungan</TranslatedText>
            </p>
            <p className="text-xs text-gray-400">
              <TranslatedText>
                Data akan muncul setelah ada aktivitas user
              </TranslatedText>
            </p>
          </div>
        </div>
      ) : (
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
                domain={[
                  0,
                  data.length > 0
                    ? Math.max(...data.map((d) => d.value), 150)
                    : 150,
                ]}
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
      )}
    </motion.div>
  );
}
