"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMemberMutations } from "@/src/hooks/useMember";
import { Image as ImageIcon, Loader2, Save } from "lucide-react";

export const MemberForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) => {
  const { createMutation, updateMutation } = useMemberMutations();
  const isEdit = !!initialData;
  const { register, handleSubmit, reset } = useForm();
  
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.name });
      setPreview(`http://localhost:3000/uploads/${initialData.image}`);
    } else {
      reset({ name: "" });
      setPreview(null);
      setSelectedFile(null);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    
    if (selectedFile) {
      formData.append("image", selectedFile); 
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: initialData.id, formData });
      } else {
        if (!selectedFile) return alert("Pilih foto terlebih dahulu!");
        await createMutation.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nama Client</label>
        <input 
          {...register("name", { required: true })} 
          className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#1e3a5f]" 
          placeholder="Contoh: Google" 
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Logo</label>
        <div className="relative h-40 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} className="w-full h-full object-contain p-4" alt="Preview" />
          ) : (
            <ImageIcon className="text-gray-300" size={32} />
          )}
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="w-full py-4 bg-[#1e3a5f] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
      >
        {createMutation.isPending || updateMutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Save size={18} />
            <span>{isEdit ? "SIMPAN PERUBAHAN" : "TAMBAH CLIENT"}</span>
          </>
        )}
      </button>
    </form>
  );
};