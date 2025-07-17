/**
 * Format number dengan koma sebagai pemisah ribuan (format Indonesia)
 * @param num - Number to format
 * @returns Formatted string
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("id-ID").format(num);
};

/**
 * Format number dengan singkatan (1.2K, 1.5M, dll)
 * @param num - Number to format
 * @returns Formatted string with abbreviation
 */
export const formatNumberAbbreviated = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return formatNumber(num);
};

/**
 * Format news count dengan spasi yang tepat
 * @param count - News count number
 * @returns Formatted string ready for display
 */
export const formatNewsCount = (count: number | undefined): string => {
  if (!count) return "";
  return formatNumber(count);
};
