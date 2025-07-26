"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type FontAccessibilityContextType = {
  isOpenDyslexicEnabled: boolean;
  toggleOpenDyslexic: () => void;
  isHighContrastEnabled: boolean;
  toggleHighContrast: () => void;
  isLoading: boolean;
};

const FontAccessibilityContext = createContext<
  FontAccessibilityContextType | undefined
>(undefined);

export function FontAccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpenDyslexicEnabled, setIsOpenDyslexicEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's font preference from API or localStorage
  useEffect(() => {
    const loadFontPreference = async () => {
      try {
        // First, try to load from localStorage for immediate UI response
        const localSavedFont = localStorage.getItem("openDyslexicFont");
        const localSavedContrast = localStorage.getItem("highContrastMode");
        if (localSavedFont !== null) {
          setIsOpenDyslexicEnabled(localSavedFont === "true");
        }
        if (localSavedContrast !== null) {
          setIsHighContrastEnabled(localSavedContrast === "true");
        }

        // Then try to sync with database if user is logged in
        const response = await fetch("/api/profile/font-settings");
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success" && data.data) {
            const dbFontValue = data.data.openDyslexicEnabled || false;
            const dbContrastValue = data.data.highContrastEnabled || false;
            setIsOpenDyslexicEnabled(dbFontValue);
            setIsHighContrastEnabled(dbContrastValue);
            // Sync localStorage with database values
            localStorage.setItem("openDyslexicFont", dbFontValue.toString());
            localStorage.setItem(
              "highContrastMode",
              dbContrastValue.toString()
            );
          }
        } else if (response.status === 401) {
          // User not logged in - use localStorage only
          console.log("User not authenticated, using localStorage only");
          const savedFont = localStorage.getItem("openDyslexicFont");
          const savedContrast = localStorage.getItem("highContrastMode");
          setIsOpenDyslexicEnabled(savedFont === "true");
          setIsHighContrastEnabled(savedContrast === "true");
        } else {
          // Other API errors - fallback to localStorage
          console.log("API error, falling back to localStorage");
          const savedFont = localStorage.getItem("openDyslexicFont");
          const savedContrast = localStorage.getItem("highContrastMode");
          setIsOpenDyslexicEnabled(savedFont === "true");
          setIsHighContrastEnabled(savedContrast === "true");
        }
      } catch (error) {
        console.error("Error loading font preference:", error);
        // Network error or other issues - use localStorage
        const savedFont = localStorage.getItem("openDyslexicFont");
        const savedContrast = localStorage.getItem("highContrastMode");
        setIsOpenDyslexicEnabled(savedFont === "true");
        setIsHighContrastEnabled(savedContrast === "true");
      } finally {
        setIsLoading(false);
      }
    };

    loadFontPreference();
  }, []);

  // Apply font and contrast to document
  useEffect(() => {
    if (isLoading) return;

    const applyAccessibilitySettings = () => {
      // Apply OpenDyslexic font
      if (isOpenDyslexicEnabled) {
        document.documentElement.classList.add("font-opendyslexic");
        document.documentElement.style.setProperty(
          "--font-family",
          "OpenDyslexic, Arial, sans-serif"
        );
      } else {
        document.documentElement.classList.remove("font-opendyslexic");
        document.documentElement.style.removeProperty("--font-family");
      }

      // Apply High Contrast mode
      if (isHighContrastEnabled) {
        document.documentElement.classList.add("high-contrast");
      } else {
        document.documentElement.classList.remove("high-contrast");
      }
    };

    applyAccessibilitySettings();
  }, [isOpenDyslexicEnabled, isHighContrastEnabled, isLoading]);

  const saveAccessibilityPreferences = useCallback(
    async (fontEnabled: boolean, contrastEnabled: boolean) => {
      // Always save to localStorage first for immediate persistence
      localStorage.setItem("openDyslexicFont", fontEnabled.toString());
      localStorage.setItem("highContrastMode", contrastEnabled.toString());

      try {
        // Try to save to database if user is logged in
        const response = await fetch("/api/profile/font-settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            openDyslexicEnabled: fontEnabled,
            highContrastEnabled: contrastEnabled,
          }),
        });

        if (response.status === 401) {
          // User not logged in - localStorage is sufficient
          console.log(
            "User not authenticated, settings saved to localStorage only"
          );
          return;
        }

        if (!response.ok) {
          console.warn(
            "Failed to save accessibility preferences to database, keeping localStorage"
          );
        } else {
          console.log(
            "Accessibility preferences saved to database and localStorage"
          );
        }
      } catch (error) {
        console.error(
          "Error saving accessibility preferences to database:",
          error
        );
        console.log("Settings maintained in localStorage");
      }
    },
    []
  );

  const saveFontPreference = useCallback(
    async (enabled: boolean) => {
      await saveAccessibilityPreferences(enabled, isHighContrastEnabled);
    },
    [saveAccessibilityPreferences, isHighContrastEnabled]
  );

  const saveContrastPreference = useCallback(
    async (enabled: boolean) => {
      await saveAccessibilityPreferences(isOpenDyslexicEnabled, enabled);
    },
    [saveAccessibilityPreferences, isOpenDyslexicEnabled]
  );

  const toggleOpenDyslexic = useCallback(() => {
    setIsOpenDyslexicEnabled((prev) => {
      const next = !prev;
      // Save preference asynchronously
      saveFontPreference(next);
      return next;
    });
  }, [saveFontPreference]);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrastEnabled((prev) => {
      const next = !prev;
      // Save preference asynchronously
      saveContrastPreference(next);
      return next;
    });
  }, [saveContrastPreference]);

  return (
    <FontAccessibilityContext.Provider
      value={{
        isOpenDyslexicEnabled,
        toggleOpenDyslexic,
        isHighContrastEnabled,
        toggleHighContrast,
        isLoading,
      }}
    >
      {children}
    </FontAccessibilityContext.Provider>
  );
}

export function useFontAccessibility() {
  const ctx = useContext(FontAccessibilityContext);
  if (!ctx) {
    throw new Error(
      "useFontAccessibility must be used within FontAccessibilityProvider"
    );
  }
  return ctx;
}
