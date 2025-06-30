"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TabType = "bookmarks" | "history";

interface ProfileTabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProfileTabContext = createContext<ProfileTabContextType | undefined>(
  undefined
);

interface ProfileTabProviderProps {
  children: ReactNode;
}

export const ProfileTabProvider: React.FC<ProfileTabProviderProps> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("bookmarks");

  return (
    <ProfileTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ProfileTabContext.Provider>
  );
};

export const useProfileTab = () => {
  const context = useContext(ProfileTabContext);
  if (context === undefined) {
    throw new Error("useProfileTab must be used within a ProfileTabProvider");
  }
  return context;
};
