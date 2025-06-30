"use client";
import { useAuth } from "@/hooks/useAuth";

export function useRoleAccess() {
  const {
    user,
    isAdmin,
    hasStaffAccess,
    hasEditorAccess,
    hasContributorAccess,
  } = useAuth();

  return {
    isUser: user?.role?.toLowerCase() === "user",
    isContributor: user?.role?.toLowerCase() === "contributor",
    isEditor: user?.role?.toLowerCase() === "editor",
    isAdmin,

    hasStaffAccess,
    hasEditorAccess,
    hasContributorAccess,

    canManageUsers: isAdmin,
    canManageCategories: hasEditorAccess,
    canManageNews: hasStaffAccess,
    canManageComments: hasStaffAccess,
    canViewSettings: hasStaffAccess,
    canViewDashboard: hasStaffAccess,

    userRole: user?.role?.toLowerCase() || "user",
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email,
  };
}
