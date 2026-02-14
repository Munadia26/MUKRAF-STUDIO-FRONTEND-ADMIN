import { useQuery } from "@tanstack/react-query";
import api from "../services/api"; // Pastikan path ini mengarah ke file api.tsx kamu

// Hook untuk mengambil angka statistik utama
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");
      return response.data.data;
    },
  });
};

// Hook untuk mengambil aktivitas terbaru (tabel)
export const useRecentActivity = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await api.get("/dashboard/activities");
      return response.data.data;
    },
  });
};