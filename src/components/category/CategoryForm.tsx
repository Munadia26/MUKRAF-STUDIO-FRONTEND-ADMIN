"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCategoryMutations } from "@/src/hooks/useCategory";
import { Save, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const CategoryForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) => {
  const { createMutation, updateMutation } = useCategoryMutations();
  const isEdit = !!initialData;
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: initialData?.name || ""
    }
  });

  // Sinkronisasi form saat modal edit dibuka
  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.name });
    } else {
      reset({ name: "" });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        if (!initialData?.id) return toast.error("ID tidak ditemukan");

        // Memanggil updateMutation dengan objek {id, name}
        await updateMutation.mutateAsync({ 
          id: initialData.id, 
          name: data.name 
        });
      } else {
        await createMutation.mutateAsync(data.name);
      }
      onSuccess(); // Modal hanya ditutup jika mutateAsync berhasil
    } catch (error) {
      // Error ditangani oleh onError di useCategoryMutations
      console.error("Submit Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">
          Nama Kategori
        </label>
        <input 
          {...register("name", { required: "Nama kategori tidak boleh kosong" })} 
          placeholder="CONTOH: FURNITURE"
          className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border-none text-xs font-bold uppercase focus:ring-2 focus:ring-[#1e3a5f] transition-all" 
        />
      </div>

      <button 
        type="submit" 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="w-full py-4 rounded-2xl bg-[#1e3a5f] text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {createMutation.isPending || updateMutation.isPending ? (
          <Loader2 className="animate-spin" size={16} />
        ) : isEdit ? (
          <RefreshCw size={16} />
        ) : (
          <Save size={16} />
        )}
        {isEdit ? "Perbarui Kategori" : "Simpan Kategori"}
      </button>
    </form>
  );
};