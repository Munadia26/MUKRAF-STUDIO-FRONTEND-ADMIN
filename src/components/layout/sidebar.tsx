"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  User,
  Tags,
  Package,
  FileText,
  Users,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore"; // Import store

export const Sidebar = () => {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout); // Ambil fungsi logout dari store

  const menu = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Profil", href: "/profile", icon: User },
    { title: "Kategori Produk", href: "/category", icon: Tags },
    { title: "Product", href: "/product", icon: Package },
    { title: "Artikel", href: "/articles", icon: FileText },
    { title: "Client", href: "/member", icon: Users },
  ];

  // Fungsi untuk menangani klik logout
  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      logout();
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      {/* LOGO SECTION */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <div className="relative h-20 w-full">
          <Image
            src="/logo_mukraf_studio2.png"
            alt="Mukraf Studio"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="p-4 space-y-1">
        <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Menu
        </p>
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#1e3a5f] to-[#00d4ff] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon
                size={18}
                className={isActive ? "text-white" : "text-gray-500"}
                strokeWidth={2}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT BUTTON - Sekarang sudah aktif */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout} // Menghubungkan tombol ke fungsi logout
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};