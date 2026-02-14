"use client";
import { Bell, Search, User } from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
  const displayName = "Admin Mukraf";
  const displayRole = "Super Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* KIRI: Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari data..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
        </div>
      </div>

      {/* KANAN: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50">
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-500 border-2 border-white"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{displayRole}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#00d4ff] text-white font-semibold text-sm">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
