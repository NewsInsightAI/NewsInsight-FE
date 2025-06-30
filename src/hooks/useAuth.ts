"use client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  username?: string | null;
  isProfileComplete?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasStaffAccess: boolean;
  hasEditorAccess: boolean;
  hasContributorAccess: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    hasStaffAccess: false,
    hasEditorAccess: false,
    hasContributorAccess: false,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/auth/user-info", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === "success" && data.data) {
            const user = data.data;
            const userRole = user.role?.toLowerCase() || "user";

            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: true,
              isAdmin: userRole === "admin",
              hasStaffAccess: ["admin", "editor", "contributor"].includes(
                userRole
              ),
              hasEditorAccess: ["admin", "editor"].includes(userRole),
              hasContributorAccess: ["admin", "editor", "contributor"].includes(
                userRole
              ),
            });
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              isAdmin: false,
              hasStaffAccess: false,
              hasEditorAccess: false,
              hasContributorAccess: false,
            });
          }
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
            hasStaffAccess: false,
            hasEditorAccess: false,
            hasContributorAccess: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          hasStaffAccess: false,
          hasEditorAccess: false,
          hasContributorAccess: false,
        });
      }
    };

    fetchUserInfo();
  }, []);

  return authState;
}
