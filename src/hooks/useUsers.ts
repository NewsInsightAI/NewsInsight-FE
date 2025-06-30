import { useState, useEffect, useCallback, useRef } from "react";
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

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const doFetchUsers = async (params: GetUsersParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersAPI.getAllUsers(params);

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
  };

  const fetchUsers = useCallback(
    async (params: GetUsersParams = {}) => {
      const finalParams = {
        search: searchQuery,
        role: filters.role || undefined,
        status: filters.status || undefined,
        page: 1,
        limit: 10,
        ...params,
      };

      await doFetchUsers(finalParams);
    },
    [searchQuery, filters.role, filters.status]
  );

  const debouncedFetchUsers = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchUsers();
    }, 500);
  }, [fetchUsers]);

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
    doFetchUsers({
      search: "",
      page: 1,
      limit: 10,
    });
  }, []);

  useEffect(() => {
    debouncedFetchUsers();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, filters.role, filters.status, debouncedFetchUsers]);

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
