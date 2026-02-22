"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "@/src/hooks/useProfile"; 
import { Upload, Save, Building2, FileText, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ProfileAdminPage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const { register, handleSubmit, setValue } = useForm();
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  // LOGIKA BARU YANG LEBIH AMAN:
  useEffect(() => {
    if (profile && profile.name) {
      setValue("name", profile.name);
      setValue("description", profile.description);
      
      if (profile.logo) {
        // 1. Ambil URL dasar dari .env (misal: http://127.0.0.1:3000/uploads)
        const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "";
        
        // 2. Bersihkan "/uploads" dari .env jika ada
        const BASE_URL = STORAGE_URL.replace(/\/uploads$/, ""); 

        // 3. Bersihkan "/" di awal data database jika ada (misal: /uploads/abc.jpg -> uploads/abc.jpg)
        const CLEAN_LOGO_PATH = profile.logo.replace(/^\//, "");

        // 4. Gabungkan: Hasilnya pasti http://127.0.0.1:3000/uploads/namafile.jpg
        const finalUrl = `${BASE_URL}/${CLEAN_LOGO_PATH}`;
        
        console.log("Debug URL Preview:", finalUrl); // Cek di console F12 browser
        setPreviewLogo(finalUrl);
      }
    }
  }, [profile, setValue]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    
    if (data.logo && data.logo[0]) {
      formData.append("logo", data.logo[0]); 
    }

    const result = await updateProfile(formData);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <Building2 className="text-[#1e3a5f]" size={32} />
        <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800">
          Pengaturan Profile
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <FileText size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Detail Informasi</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Nama Website/Studio</label>
              <input 
                {...register("name", { required: true })}
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Deskripsi Tentang Kami</label>
              <textarea 
                {...register("description", { required: true })}
                rows={8}
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
             <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
              <ImageIcon size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Logo Studio</span>
            </div>

            <div className="relative group mx-auto w-48 h-48 mb-4">
              <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                {previewLogo ? (
                  <img src={previewLogo} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <Upload className="text-gray-300" size={48} />
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                {...register("logo", {
                  onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreviewLogo(URL.createObjectURL(file));
                  }
                })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#1e3a5f] hover:bg-[#2d507d] text-white font-bold flex items-center justify-center gap-2"
          >
            <Save size={20} />
            SIMPAN PERUBAHAN
          </button>
        </div>
      </form>
    </div>
  );
}