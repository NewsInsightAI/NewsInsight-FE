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
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
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
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: true,
              isAdmin: user.role === "admin",
            });
          } else {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              isAdmin: false,
            });
          }
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    };

    fetchUserInfo();
  }, []);

  return authState;
}
