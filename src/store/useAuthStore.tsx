import { create } from "zustand";
import Cookies from "js-cookie";
import api from "@/src/services/api"; // Pastikan path ke file api.tsx benar

interface AuthState {
  user: any | null;
  setAuth: (user: any, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>; // Gunakan Promise karena kita akan memanggil API
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  
  // Tambahkan tipe data eksplisit pada parameter untuk menghilangkan error TS
  setAuth: (user: any, accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken, { expires: 1 });
    Cookies.set("refreshToken", refreshToken, { expires: 7 });
    set({ user });
  },

  // Perbaikan fungsi logout agar menghapus data di Database juga
  logout: async () => {
    try {
      // Panggil backend agar token di tabel DB dihapus
      await api.post("/auth/logout"); 
    } catch (error) {
      console.error("Gagal logout di server:", error);
    } finally {
      // Hapus sisa sesi di browser
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      set({ user: null });
      window.location.href = "/login";
    }
  },
}));