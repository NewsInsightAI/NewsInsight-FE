/**
 * Utility function to get the correct avatar URL
 * @param avatarPath - The avatar path from the database (e.g., "/uploads/avatars/avatar-29-1749212761525.jpg")
 * @param fallback - Fallback image path (default: "/images/default_profile.png")
 * @returns Complete URL for the avatar
 */
export const getAvatarUrl = (avatarPath: string | null | undefined, fallback: string = "/images/default_profile.png"): string => {
  if (!avatarPath) {
    return fallback;
  }
  
  
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
  
  
  if (avatarPath.startsWith('/uploads/')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    return `${backendUrl}${avatarPath}`;
  }
  
  
  return avatarPath;
};
