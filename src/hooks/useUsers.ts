import { useState, useEffect, useCallback } from "react";
import {
  usersAPI,
  User,
  CreateUserData,
  UpdateUserData,
  GetUsersParams,
} from "@/lib/api/users";

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    role: string;
    status: string;
  };
  setFilters: (filters: { role: string; status: string }) => void;
  fetchUsers: (params?: GetUsersParams) => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: number, userData: UpdateUserData) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  bulkDeleteUsers: (userIds: number[]) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ role: "", status: "" });
  const fetchUsers = useCallback(
    async (params: GetUsersParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const finalParams = {
          search: searchQuery,
          role: filters.role || undefined,
          status: filters.status || undefined,
          page: 1,
          limit: 10,
          ...params,
        };

        const response = await usersAPI.getAllUsers(finalParams);

        if (response.status === "success") {
          setUsers(response.data);
          setPagination(response.metadata.pagination);
        } else {
          setError(response.error?.message || "Failed to fetch users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, filters.role, filters.status]
  );

  const createUser = useCallback(
    async (userData: CreateUserData) => {
      try {
        setError(null);
        const response = await usersAPI.createUser(userData);

        if (response.status === "success") {
          await fetchUsers();
        } else {
          throw new Error(response.error?.message || "Failed to create user");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (id: number, userData: UpdateUserData) => {
      try {
        setError(null);
        const response = await usersAPI.updateUser(id, userData);

        if (response.status === "success") {
          await fetchUsers();
        } else {
          throw new Error(response.error?.message || "Failed to update user");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      try {
        setError(null);
        const response = await usersAPI.deleteUser(id);

        if (response.status === "success") {
          await fetchUsers();
        } else {
          throw new Error(response.error?.message || "Failed to delete user");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [fetchUsers]
  );

  const bulkDeleteUsers = useCallback(
    async (userIds: number[]) => {
      try {
        setError(null);
        const response = await usersAPI.bulkDeleteUsers(userIds);

        if (response.status === "success") {
          await fetchUsers();
        } else {
          throw new Error(response.error?.message || "Failed to delete users");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [fetchUsers]
  );

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    refreshUsers,
  };
}
