"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import UserForm from "../popup/AddEditUser";
import { AnimatePresence, motion } from "framer-motion";

interface UsersData {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersTableProps {
  datas: UsersData[];
}

export default function UsersTable({ datas }: UsersTableProps) {
  const { isDark } = useDarkMode();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsersData | null>(null);

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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="eos-icons:admin" className="w-4 h-4 mr-1" />
            Admin
          </span>
        );
      case "editor":
        return (
          <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="ic:round-person" className="w-4 h-4 mr-1" />
            Editor
          </span>
        );
      case "contributor":
        return (
          <span className="bg-[#F97316]/15 text-[#F97316] border border-[#F97316] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="mingcute:pen-fill" className="w-4 h-4 mr-1" />
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
          <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="mdi:check" className="w-4 h-4 mr-1" />
            Aktif
          </span>
        );
      case "inactive":
        return (
          <span className="bg-[#6B7280]/15 text-[#6B7280] border border-[#6B7280] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="mdi:close" className="w-4 h-4 mr-1" />
            Nonaktif
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showEditUser && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
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
                onSubmit={(data) => {
                  console.log(data);
                  setShowEditUser(false);
                }}
                onClose={() => setShowEditUser(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div
        className={`overflow-hidden rounded-xl w-full transition-colors duration-300 border ${
          isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <table className={`min-w-full ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <thead>
            <tr
              className={`border-b transition-colors duration-300 ${
                isDark
                  ? "bg-blue-600/20 border-gray-600"
                  : "bg-[#367AF2]/12 border-gray-200"
              }`}
            >
              <th className="py-3 px-4 relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none hover:cursor-pointer hover:bg-[#367AF2]/10"
                  checked={
                    selectedItems.length === datas.length && datas.length > 0
                  }
                  onChange={toggleSelectAll}
                />
                {selectedItems.length === datas.length && (
                  <Icon
                    icon="mdi:check"
                    className="absolute text-white h-3 w-3 pointer-events-none"
                  />
                )}
              </th>
              <th
                className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                No
              </th>
              <th
                className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Nama Lengkap
              </th>
              <th
                className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Username
              </th>
              <th
                className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Email
              </th>
              <th
                className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Role
              </th>
              <th
                className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Status
              </th>
              <th
                className={`py-3 px-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Aksi
              </th>{" "}
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
                <td className="py-4 px-4">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                      checked={selectedItems.includes(report.id.toString())}
                      onChange={() => toggleSelectItem(report.id.toString())}
                    />
                    {selectedItems.includes(report.id.toString()) && (
                      <Icon
                        icon="mdi:check"
                        className="absolute text-white h-3 w-3 pointer-events-none"
                      />
                    )}{" "}
                  </div>
                </td>
                <td
                  className={`py-4 px-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {index + 1}
                </td>
                <td
                  className={`py-4 px-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {report.fullName}
                </td>
                <td
                  className={`py-4 px-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {report.username}
                </td>
                <td
                  className={`py-4 px-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {report.email}
                </td>
                <td
                  className={`py-4 px-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {getRoleBadge(report.role)}
                </td>
                <td
                  className={`py-4 px-4 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {getStatusBadge(report.status)}
                </td>
                <td className="py-4 px-4 text-sm space-x-2">
                  <button
                    className="border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-sm hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15"
                    onClick={() => {
                      setSelectedUser(report);
                      setShowEditUser(true);
                    }}
                  >
                    <Icon
                      icon="mage:edit-fill"
                      className="inline mr-1"
                      width={16}
                      height={16}
                    />
                    Edit
                  </button>
                  <button className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-sm hover:opacity-80 hover:cursor-pointer">
                    <Icon
                      icon="mingcute:delete-fill"
                      className="inline mr-1"
                      width={16}
                      height={16}
                    />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
