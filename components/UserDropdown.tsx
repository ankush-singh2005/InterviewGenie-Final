"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

const UserDropdown = ({ user }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={handleClickOutside} />
      )}

      <div className="relative">
        {/* User Avatar/Button */}
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* User Name */}
          <span className="text-sm font-medium text-primary-100 hidden sm:block">
            {user.name}
          </span>

          {/* Dropdown Arrow */}
          <svg
            className={`w-4 h-4 text-primary-100 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDropdown;
