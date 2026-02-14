"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/src/services/api"; // WAJIB: Gunakan api.tsx yang sudah ada interceptornya

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data profil
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      // Menggunakan 'api' agar token otomatis terkirim
      const response = await api.get("/profile"); 
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat profil");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fungsi untuk update data
  const updateProfile = async (formData: FormData) => {
    try {
      // Menggunakan 'api' agar token otomatis terkirim
      const response = await api.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.data.data) {
        setProfile(response.data.data);
      }
      return { success: true, message: "Profil berhasil diperbarui!" };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Gagal memperbarui profil" 
      };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, updateProfile, refetch: fetchProfile };
};