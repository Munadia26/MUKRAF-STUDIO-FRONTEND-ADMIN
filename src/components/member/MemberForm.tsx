"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMemberMutations } from "@/src/hooks/useMember";
import { Save, Loader2, RefreshCw, Image as ImageIcon, User, Briefcase } from "lucide-react";

export const MemberForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) => {
  const { createMutation, updateMutation } = useMemberMutations();
  const isEdit = !!initialData;
  const { register, handleSubmit, reset } = useForm();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.name, position: initialData.position });
      setPreview(`http://localhost:3000/uploads/${initialData.image}`);
    } else {
      reset({ name: "", position: "" });
      setPreview(null);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("position", data.position);
    
    const fileInput = document.getElementById("fileMember") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("image", fileInput.files[0]);
    }

    if (isEdit) {
      await updateMutation.mutateAsync({ id: initialData.id, formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nama</label>
        <input {...register("name")} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="Nama Member" />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Jabatan</label>
        <input {...register("position")} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#1e3a5f]" placeholder="CEO / Developer" />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Foto</label>
        <div className="relative h-32 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
          {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
          <input 
            type="file" id="fileMember" className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => e.target.files?.[0] && setPreview(URL.createObjectURL(e.target.files[0]))}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="w-full py-4 bg-[#1e3a5f] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
      >
        {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : isEdit ? <RefreshCw size={16} /> : <Save size={16} />}
        {isEdit ? "Update Member" : "Tambah Member"}
      </button>
    </form>
  );
};