"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useProductMutations } from "@/src/hooks/useProduct";
import { useCategories } from "@/src/hooks/useCategory";
import { Image as ImageIcon, Save, Loader2, RefreshCw, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export const ProductForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) => {
  const { createMutation, updateMutation } = useProductMutations();
  const { data: categories } = useCategories();
  const isEdit = !!initialData;
  
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      link: "",
      categoryId: ""
    }
  });
  
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        link: initialData.link || "",
        categoryId: String(initialData.categoryId),
      });
      if (initialData.image) {
        setPreview(`http://localhost:3000/uploads/${initialData.image}`);
      }
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    console.log("📝 Data produk yang akan dikirim:", data);
    
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("link", data.link || "");
    formData.append("categoryId", data.categoryId);
    
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("image", fileInput.files[0]);
      console.log("🖼️ File gambar ditambahkan:", fileInput.files[0].name);
    }

    try {
      if (isEdit) {
        console.log("🔄 Mode: UPDATE produk ID", initialData.id);
        await updateMutation.mutateAsync({ 
          id: initialData.id, 
          formData: formData 
        });
        toast.success("Produk berhasil diperbarui!");
      } else {
        console.log("➕ Mode: CREATE produk baru");
        await createMutation.mutateAsync(formData);
        toast.success("Produk berhasil ditambahkan!");
      }
      onSuccess();
    } catch (error: any) {
      console.error("❌ Submit Error:", error);
      
      if (error?.response?.status === 403) {
        toast.error("Akses ditolak! Periksa izin Anda.");
      } else if (error?.response?.status === 401) {
        toast.error("Sesi Anda habis. Silakan login kembali.");
      } else {
        toast.error("Gagal menyimpan produk! Cek koneksi server.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Nama Produk</label>
          <input 
            {...register("title", { required: true })}
            className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border-none text-xs font-bold focus:ring-2 focus:ring-[#1e3a5f]"
            placeholder="NAMA PRODUK..."
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Kategori</label>
          <select 
            {...register("categoryId", { required: true })}
            className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border-none text-xs font-bold focus:ring-2 focus:ring-[#1e3a5f]"
          >
            <option value="">PILIH KATEGORI</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Link Eksternal</label>
          <div className="relative flex items-center">
            <LinkIcon size={16} className="absolute left-4 text-gray-400" />
            <input 
              {...register("link")}
              className="w-full p-4 pl-12 mt-1 rounded-2xl bg-gray-50 border-none text-xs font-bold focus:ring-2 focus:ring-[#1e3a5f]"
              placeholder="https://example.com..."
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Deskripsi</label>
          <textarea
            {...register("description")}
            rows={8}
            className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none resize-none"
            placeholder="Tuliskan deskripsi produk di sini..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Foto Produk</label>
          <div className="relative aspect-square w-full mt-1 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group hover:border-[#1e3a5f] transition-all">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-gray-300">
                <ImageIcon size={48} strokeWidth={1} />
                <span className="text-[10px] font-black mt-2">PILIH GAMBAR</span>
              </div>
            )}
            <input 
              id="fileInput"
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
          className="w-full py-4 rounded-2xl bg-[#1e3a5f] text-white font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : isEdit ? (
            <><RefreshCw size={20} /> UPDATE PRODUK</>
          ) : (
            <><Save size={20} /> SIMPAN PRODUK</>
          )}
        </button>
      </div>
    </form>
  );
};