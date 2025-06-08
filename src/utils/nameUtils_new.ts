/**
 * Utility function to shorten long names intelligently
 * @param fullName - The full name to shorten (e.g., "Rigel Ramadhani Waloni")
 * @param maxLength - Maximum length before shortening (default: 15)
 * @returns Shortened name using second name initial (e.g., "Rigel R.")
 */
export const shortenName = (
  fullName: string,
  maxLength: number = 15
): string => {
  if (!fullName || fullName.trim().length === 0) {
    return "";
  }

  const trimmedName = fullName.trim();

  if (trimmedName.length <= maxLength) {
    return trimmedName;
  }

  const nameParts = trimmedName.split(" ").filter((part) => part.length > 0);

  if (nameParts.length === 1) {
    return nameParts[0].length > maxLength
      ? nameParts[0].substring(0, maxLength - 3) + "..."
      : nameParts[0];
  }

  if (nameParts.length === 2) {
    const firstName = nameParts[0];
    const secondInitial = nameParts[1].charAt(0).toUpperCase() + ".";
    const shortened = `${firstName} ${secondInitial}`;

    if (shortened.length <= maxLength) {
      return shortened;
    }

    const maxFirstNameLength = maxLength - secondInitial.length - 1;
    return firstName.length > maxFirstNameLength
      ? `${firstName.substring(0, maxFirstNameLength - 3)}... ${secondInitial}`
      : shortened;
  }

  const firstName = nameParts[0];
  const secondInitial = nameParts[1].charAt(0).toUpperCase() + ".";
  const shortened = `${firstName} ${secondInitial}`;

  if (shortened.length <= maxLength) {
    return shortened;
  }

  const maxFirstNameLength = maxLength - secondInitial.length - 1;
  return firstName.length > maxFirstNameLength
    ? `${firstName.substring(0, maxFirstNameLength - 3)}... ${secondInitial}`
    : shortened;
};
