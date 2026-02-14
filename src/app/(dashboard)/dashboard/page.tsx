"use client";

import { StatCard } from "@/src/components/dashboard/StatsCard";
import { useDashboardStats } from "@/src/hooks/useDashboard";
import { useAuthStore } from "@/src/store/useAuthStore"; // Mengambil identitas admin
import {
  Package,
  FileText,
  Users,
  Activity,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DashboardPage() {
  // Mengakses state user dari Zustand store yang diisi saat login
  const { user } = useAuthStore();
  
  // Mengambil data statistik dari backend
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6 p-6">
      {/* HEADER SECTION - Menampilkan Nama Admin Secara Dinamis */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {/* Jika user.name tidak ada, fallback ke 'Admin' */}
              Selamat Datang, <span className="text-cyan-600">{user?.name || "Admin"}</span>!
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1e3a5f] to-[#00d4ff] rounded-lg text-white shadow-lg shadow-blue-100/50">
          <Activity size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">System Active</span>
        </div>
      </div>

      {/* STATS CARDS - Sinkronisasi Data Produk, Artikel, dan Member */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Produk"
          value={isLoading ? "..." : stats?.totalProducts || 0}
          icon={Package}
          color="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f]"
          iconBg="bg-[#1e3a5f]/10"
          iconColor="text-[#1e3a5f]"
        />
        <StatCard
          title="Artikel Publish"
          value={isLoading ? "..." : stats?.totalArticles || 0}
          icon={FileText}
          color="bg-gradient-to-br from-[#00d4ff] to-[#00a8cc]"
          iconBg="bg-[#00d4ff]/10"
          iconColor="text-[#00d4ff]"
        />
        <StatCard
          title="Total Member"
          value={isLoading ? "..." : stats?.totalMembers || 0}
          icon={Users}
          color="bg-gradient-to-br from-[#1e3a5f] to-[#00d4ff]"
          iconBg="bg-gradient-to-br from-[#1e3a5f]/10 to-[#00d4ff]/10"
          iconColor="text-[#1e3a5f]"
        />
      </div>

      {/* FOOTER INFO - Status Sinkronisasi */}
      <div className="text-center py-6 border-t border-gray-100 mt-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Data disinkronkan dengan Database Backend Express
        </p>
      </div>
    </div>
  );
}