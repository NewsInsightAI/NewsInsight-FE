/**
 * Format large numbers for display (1000 -> 1K, 1200 -> 1.2K)
 */
export const formatMetricNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) {
    const k = num / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  const m = num / 1000000;
  return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
};

/**
 * Get appropriate icon name for metrics
 */
export const getMetricIcon = (
  type: "views" | "shares" | "comments" | "bookmarks"
): string => {
  const icons = {
    views: "mdi:eye",
    shares: "mdi:share-variant",
    comments: "mdi:comment",
    bookmarks: "mdi:bookmark",
  };
  return icons[type];
};
