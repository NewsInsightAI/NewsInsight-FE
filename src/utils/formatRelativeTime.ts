/**
 * Format timestamp to relative time
 * @param timestamp - ISO string timestamp
 * @returns Relative time string
 */
export const formatRelativeTime = (timestamp: string): string => {
  if (!timestamp) {
    return "Waktu tidak tersedia";
  }

  const now = new Date();
  const date = new Date(timestamp);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid timestamp:", timestamp);
    return "Waktu tidak valid";
  }

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Check for negative difference (future date)
  if (diffInSeconds < 0) {
    return "Baru saja";
  }

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`;
  }

  // Less than 1 hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  }

  // Less than 24 hours
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  }

  // Less than 30 days
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  }

  // Less than 12 months
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} bulan yang lalu`;
  }

  // More than 12 months
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} tahun yang lalu`;
};
