const API_BASE_URL = "/api";

interface ApiError {
  code: string;
  message?: string;
}

interface User {
  id: number;
  fullName: string;
  username: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  googleId?: string | null;
  authProvider?: "email" | "google"; // Proper auth provider field
}

interface UsersResponse {
  status: string;
  message: string;
  data: User[];
  error: ApiError | null;
  metadata: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface UserResponse {
  status: string;
  message: string;
  data: User;
  error: ApiError | null;
  metadata: Record<string, unknown> | null;
}

interface CreateUserData {
  email: string;
  username: string | null;
  password: string;
  role: string;
  fullName?: string;
  status?: string;
}

interface UpdateUserData {
  email?: string;
  username?: string | null;
  role?: string;
  fullName?: string;
  status?: string;
  password?: string;
}

interface GetUsersParams {
  search?: string;
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}

class UsersAPI {
  async getAllUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append("search", params.search);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.role) searchParams.append("role", params.role);
    if (params.status) searchParams.append("status", params.status);

    const response = await fetch(`${API_BASE_URL}/users?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getUserById(id: number): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createUser(userData: CreateUserData): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async updateUser(
    id: number,
    userData: UpdateUserData
  ): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async bulkDeleteUsers(userIds: number[]): Promise<{
    status: string;
    message: string;
    data: User[];
    error: ApiError | null;
    metadata: { deletedCount: number };
  }> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }
}

export const usersAPI = new UsersAPI();
export type { User, CreateUserData, UpdateUserData, GetUsersParams };
