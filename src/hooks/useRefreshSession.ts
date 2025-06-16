import { useSession } from "next-auth/react";
import { useCallback } from "react";

export const useRefreshSession = () => {
  const { data: session, update } = useSession();

  const refreshSession = useCallback(async () => {
    try {
      console.log("Refreshing session...");

      await update({
        user: session?.user,
        trigger: "refresh",
      });

      console.log("Session refreshed successfully");
      return true;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return false;
    }
  }, [session?.user, update]);

  const refreshUserData = useCallback(async () => {
    try {
      console.log("Fetching fresh user data...");

      const response = await fetch("/api/auth/refresh-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          await update({
            user: result.data.user,
            trigger: "refresh",
          });
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error fetching fresh user data:", error);
      return false;
    }
  }, [update]);

  return {
    refreshSession,
    refreshUserData,
    isLoading: !session && session !== null,
  };
};
