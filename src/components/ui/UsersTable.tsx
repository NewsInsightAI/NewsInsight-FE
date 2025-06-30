"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import UserForm from "../popup/AddEditUser";
import { AnimatePresence, motion } from "framer-motion";
import { useUsers } from "@/hooks/useUsers";
import { UpdateUserData } from "@/lib/api/users";
import ConfirmationModal from "./ConfirmationModal";

interface UsersData {
  id: number;
  fullName: string;
  username: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  googleId?: string | null;
  authProvider?: "email" | "google";
}

interface UsersTableProps {
  datas: UsersData[];
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}


const isGoogleUser = (user: UsersData): boolean => {
  if (user.authProvider === "google") {
    return true;
  }

  if (user.googleId) {
    return true;
  }

  return false;
};

const AuthProviderBadge = ({ user }: { user: UsersData }) => {
  const isGoogle = isGoogleUser(user);
  if (isGoogle) {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full w-fit shadow-md"
        title="User mendaftar menggunakan Google OAuth"
      >
        <Icon icon="mdi:google" className="w-3.5 h-3.5 text-white" />
        <span className="text-xs text-white font-semibold">Google</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 dark:bg-gray-700 rounded-full w-fit shadow-md"
      title="User mendaftar menggunakan email dan password"
    >
      <Icon icon="mage:email-opened-fill" className="w-3.5 h-3.5 text-white" />
      <span className="text-xs font-semibold text-white">Email</span>
    </div>
  );
};

export default function UsersTable({
  datas,
  loading = false,
}: UsersTableProps) {
  const { isDark } = useDarkMode();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsersData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UsersData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const { updateUser, deleteUser, bulkDeleteUsers } = useUsers();
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === datas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(datas.map((item) => item.id.toString()));
    }
  };

  const handleEditUser = async (data: {
    fullName: string;
    username: string;
    email: string;
    role: string;
    status: string;
    password?: string;
  }) => {
    if (!selectedUser) return;

    try {
      const updateData: UpdateUserData = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        role: data.role,
        status: data.status,
      };

      if (data.password) {
        updateData.password = data.password;
      }

      await updateUser(selectedUser.id, updateData);
      setShowEditUser(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = (user: UsersData) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedItems.length === 0 || isBulkDeleting) return;

    setIsBulkDeleting(true);
    try {
      const userIds = selectedItems.map((id) => parseInt(id));
      await bulkDeleteUsers(userIds);
      setSelectedItems([]);
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting users:", error);
    } finally {
      setIsBulkDeleting(false);
    }
  };
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon
              icon="eos-icons:admin"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            Admin
          </span>
        );
      case "editor":
        return (
          <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon
              icon="ic:round-person"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            Editor
          </span>
        );
      case "contributor":
        return (
          <span className="bg-[#F97316]/15 text-[#F97316] border border-[#F97316] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon
              icon="mingcute:pen-fill"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            Kontributor
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (level: string) => {
    switch (level) {
      case "active":
        return (
          <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon icon="mdi:check" className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            <span className="hidden sm:inline md:inline">Aktif</span>
          </span>
        );
      case "inactive":
        return (
          <span className="bg-[#6B7280]/15 text-[#6B7280] border border-[#6B7280] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon icon="mdi:close" className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            <span className="hidden sm:inline md:inline">Nonaktif</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteUser}
        title="Hapus Pengguna"
        message={
          userToDelete ? (
            <p>
              Apakah Anda yakin ingin menghapus pengguna &quot;
              {userToDelete.fullName}&quot;? Tindakan ini tidak dapat
              dibatalkan.
            </p>
          ) : (
            ""
          )
        }
        confirmText="Hapus"
        isLoading={isDeleting}
        loadingText="Menghapus..."
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
        title="Hapus Pengguna Terpilih"
        message={
          <p>
            Apakah Anda yakin ingin menghapus {selectedItems.length} pengguna
            yang dipilih? Tindakan ini tidak dapat dibatalkan.
          </p>
        }
        confirmText="Hapus Semua"
        isLoading={isBulkDeleting}
        loadingText="Menghapus..."
      />

      <AnimatePresence>
        {showEditUser && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <UserForm
                mode="edit"
                initialFullName={selectedUser?.fullName || ""}
                initialUsername={selectedUser?.username || ""}
                initialEmail={selectedUser?.email || ""}
                initialRole={selectedUser?.role || ""}
                initialStatus={selectedUser?.status || ""}
                onSubmit={handleEditUser}
                onClose={() => setShowEditUser(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-4 p-4 rounded-lg border transition-colors duration-300 ${
            isDark
              ? "bg-blue-900/20 border-blue-700 shadow-lg shadow-blue-900/20"
              : "bg-blue-50 border-blue-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isDark
                    ? "bg-blue-700/50 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Icon icon="mdi:check-all" className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedItems.length} pengguna dipilih
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedItems([])}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Icon icon="mingcute:delete-fill" className="w-4 h-4" />
                Hapus yang dipilih
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Memuat data...
          </span>
        </div>
      )}

      {/* Empty State */}
      {!loading && datas.length === 0 && (
        <div className="flex flex-col justify-center items-center py-12">
          <Icon
            icon="fluent:people-32-regular"
            className="w-16 h-16 text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            Tidak ada pengguna ditemukan
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Belum ada pengguna yang terdaftar dalam sistem
          </p>
        </div>
      )}

      {/* Desktop Table View - Hidden on mobile */}
      {!loading && datas.length > 0 && (
        <div
          className={`hidden md:block w-full overflow-x-auto rounded-xl transition-colors duration-300 border ${
            isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
          }`}
        >
          <table
            className={`w-full min-w-full rounded-xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}
          >
            <thead>
              <tr
                className={`border-b transition-colors duration-300 rounded-t-xl overflow-hidden ${
                  isDark
                    ? "bg-blue-600/20 border-gray-600"
                    : "bg-[#367AF2]/12 border-gray-200"
                }`}
              >
                <th className="py-2 md:py-3 px-2 md:px-4 w-12">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none hover:cursor-pointer hover:bg-[#367AF2]/10"
                      checked={
                        selectedItems.length === datas.length &&
                        datas.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                    {selectedItems.length === datas.length && (
                      <Icon
                        icon="mdi:check"
                        className="absolute text-white h-3 w-3 pointer-events-none"
                      />
                    )}
                  </div>
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[60px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  No
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[150px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Nama Lengkap
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Username
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[200px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Email
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Auth Provider
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Role
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y transition-colors duration-300 ${
                isDark ? "divide-gray-600" : "divide-gray-200"
              }`}
            >
              {datas.map((report, index) => (
                <tr
                  key={report.id}
                  className={`transition-colors duration-300 ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } ${index === datas.length - 1 ? "last:rounded-b-xl" : ""}`}
                >
                  <td className="py-2 md:py-4 px-2 md:px-4 w-12">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                        checked={selectedItems.includes(report.id.toString())}
                        onChange={() => toggleSelectItem(report.id.toString())}
                      />
                      {selectedItems.includes(report.id.toString()) && (
                        <Icon
                          icon="mdi:check"
                          className="absolute text-white h-3 w-3 pointer-events-none"
                        />
                      )}
                    </div>
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {index + 1}
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {report.fullName}
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {report.username || "-"}
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {report.email}
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    <AuthProviderBadge user={report} />
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {getRoleBadge(report.role)}
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm">
                    <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                      <button
                        className="border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15 whitespace-nowrap"
                        onClick={() => {
                          setSelectedUser(report);
                          setShowEditUser(true);
                        }}
                      >
                        <Icon
                          icon="mage:edit-fill"
                          className="inline mr-1"
                          width={12}
                          height={12}
                        />
                        <span className="hidden md:inline">Edit</span>
                      </button>
                      <button
                        className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
                        onClick={() => handleDeleteUser(report)}
                      >
                        <Icon
                          icon="mingcute:delete-fill"
                          className="inline mr-1"
                          width={12}
                          height={12}
                        />
                        <span className="hidden md:inline">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card View - Visible only on mobile */}
      {!loading && datas.length > 0 && (
        <div className="md:hidden space-y-4">
          {datas.map((user, index) => (
            <div
              key={user.id}
              className={`rounded-xl p-4 transition-colors duration-300 border ${
                isDark
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                    checked={selectedItems.includes(user.id.toString())}
                    onChange={() => toggleSelectItem(user.id.toString())}
                  />
                  {selectedItems.includes(user.id.toString()) && (
                    <Icon
                      icon="mdi:check"
                      className="absolute text-white h-2.5 w-2.5 pointer-events-none"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold text-base ${
                        isDark ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {user.fullName}
                    </h3>
                    <span
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    @{user.username || "username"}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Role:
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-600/20 dark:text-purple-400"
                        : user.role === "editor"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-600/20 dark:text-gray-400"
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Status:
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-600/20 dark:text-red-400"
                    }`}
                  >
                    {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Auth Provider:
                  </span>
                  <AuthProviderBadge user={user} />
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Bergabung:
                  </span>
                  <span
                    className={`text-xs ${isDark ? "text-gray-300" : "text-gray-900"}`}
                  >
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  className="flex-1 border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowEditUser(true);
                  }}
                >
                  <Icon icon="mage:edit-fill" width={12} height={12} />
                  <span>Edit</span>
                </button>
                <button
                  className="flex-1 border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                  onClick={() => handleDeleteUser(user)}
                >
                  <Icon icon="mingcute:delete-fill" width={12} height={12} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
