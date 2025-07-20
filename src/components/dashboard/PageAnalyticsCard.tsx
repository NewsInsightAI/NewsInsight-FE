import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface PopularPage {
  page_url: string;
  page_title: string;
  total_visits: number;
  unique_visitors: number;
  avg_time_spent: number;
  bounce_rate: number;
}

interface DeviceStats {
  device_type: string;
  visit_count: number;
  percentage: number;
}

interface BrowserStats {
  browser: string;
  visit_count: number;
  percentage: number;
}

export function PageAnalyticsCard() {
  const [popularPages, setPopularPages] = useState<PopularPage[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats[]>([]);
  const [browserStats, setBrowserStats] = useState<BrowserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch popular pages
      const pagesResponse = await fetch(
        "/api/analytics/popular-pages?limit=10"
      );
      const pagesData = await pagesResponse.json();

      // Fetch device stats
      const deviceResponse = await fetch("/api/analytics/device-stats");
      const deviceData = await deviceResponse.json();

      // Fetch browser stats
      const browserResponse = await fetch("/api/analytics/browser-stats");
      const browserData = await browserResponse.json();

      if (pagesData.success) setPopularPages(pagesData.data);
      if (deviceData.success) setDeviceStats(deviceData.data);
      if (browserData.success) setBrowserStats(browserData.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Gagal memuat data analytics");
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile":
        return "mdi:cellphone";
      case "tablet":
        return "mdi:tablet";
      case "desktop":
        return "mdi:monitor";
      default:
        return "mdi:devices";
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case "chrome":
        return "mdi:google-chrome";
      case "firefox":
        return "mdi:firefox";
      case "safari":
        return "mdi:apple-safari";
      case "edge":
        return "mdi:microsoft-edge";
      case "opera":
        return "mdi:opera";
      default:
        return "mdi:web";
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon
              icon="mdi:alert-circle-outline"
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
            />
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Popular Pages */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon icon="mdi:chart-line" className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Halaman Terpopuler</h3>
        </div>

        {popularPages.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              icon="mdi:file-document-outline"
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
            />
            <p className="text-gray-500">
              Belum ada data halaman yang dikunjungi
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {popularPages.map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p
                    className="font-medium text-sm truncate"
                    title={page.page_url}
                  >
                    {page.page_title || page.page_url}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {page.page_url}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-sm">
                    {page.total_visits.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {page.unique_visitors} unique
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Device and Browser Stats */}
      <div className="space-y-6">
        {/* Device Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Icon icon="mdi:devices" className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Perangkat</h3>
          </div>

          {deviceStats.length === 0 ? (
            <div className="text-center py-6">
              <Icon
                icon="mdi:devices"
                className="mx-auto h-8 w-8 text-gray-400 mb-2"
              />
              <p className="text-sm text-gray-500">Belum ada data perangkat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deviceStats.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={getDeviceIcon(device.device_type)}
                      className="h-4 w-4 text-gray-600"
                    />
                    <span className="text-sm capitalize">
                      {device.device_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {device.percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-medium">
                      {device.visit_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browser Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Icon icon="mdi:web" className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Browser</h3>
          </div>

          {browserStats.length === 0 ? (
            <div className="text-center py-6">
              <Icon
                icon="mdi:web"
                className="mx-auto h-8 w-8 text-gray-400 mb-2"
              />
              <p className="text-sm text-gray-500">Belum ada data browser</p>
            </div>
          ) : (
            <div className="space-y-3">
              {browserStats.map((browser, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={getBrowserIcon(browser.browser)}
                      className="h-4 w-4 text-gray-600"
                    />
                    <span className="text-sm capitalize">
                      {browser.browser}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {browser.percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-medium">
                      {browser.visit_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
