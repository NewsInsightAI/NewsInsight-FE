/**
 * Format timestamp based on language locale
 * @param timestamp - ISO string timestamp
 * @param language - Language code (id, en, es, fr, etc.)
 * @returns Formatted timestamp string
 */
export const formatTimestamp = (
  timestamp: string,
  language: string = "id"
): string => {
  const date = new Date(timestamp);

  const localeMap: { [key: string]: string } = {
    id: "id-ID",
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
    ar: "ar-SA",
    pt: "pt-BR",
    ru: "ru-RU",
    hi: "hi-IN",
    tr: "tr-TR",
    it: "it-IT",
    nl: "nl-NL",
  };

  const locale = localeMap[language] || "id-ID";

  try {
    if (language === "id") {
      const parts = new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
        hour12: true,
      }).formatToParts(date);

      const day = parts.find((p) => p.type === "day")?.value;
      const month = parts.find((p) => p.type === "month")?.value;
      const year = parts.find((p) => p.type === "year")?.value;
      const hour = parts.find((p) => p.type === "hour")?.value;
      const minute = parts.find((p) => p.type === "minute")?.value;
      const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value;

      return `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod?.toUpperCase()} GMT+7`;
    }

    const formatted = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
      hour12: false,
    }).format(date);

    return formatted;
  } catch {
    return date.toLocaleDateString(locale);
  }
};
