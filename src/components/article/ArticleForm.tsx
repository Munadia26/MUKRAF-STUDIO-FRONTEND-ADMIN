"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useArticleMutations } from "@/src/hooks/useArticle";
import { Image as ImageIcon, Save, Loader2, RefreshCw, Type } from "lucide-react";

// 1. Import CSS khusus react-quill-new
import "react-quill-new/dist/quill.snow.css";

// 2. Load Quill secara dinamis dengan loading state agar tidak layout shift
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-40 w-full bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
});

export const ArticleForm = ({ onSuccess, initialData }: { onSuccess: () => void, initialData?: any }) => {
  const { createMutation, updateMutation } = useArticleMutations();
  const isEdit = !!initialData;
  
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: initialData || { title: "", description: "" }
  });

  const [preview, setPreview] = useState<string | null>(
    initialData?.image ? `http://localhost:3000/uploads/${initialData.image}` : null
  );

  // Ambil value deskripsi untuk disinkronkan ke Quill
  const descriptionValue = watch("description");

  // 3. Sinkronisasi data saat mode EDIT aktif
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
      });
      setPreview(`http://localhost:3000/uploads/${initialData.image}`);
    } else {
      reset({ title: "", description: "" });
      setPreview(null);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    
    // Kirim file gambar jika ada perubahan/penambahan
    if (data.image && data.image[0] instanceof File) {
      formData.append("image", data.image[0]);
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: initialData.id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Gagal menyimpan artikel:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* INPUT JUDUL */}
      <div className="group">
        <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-[0.2em] flex items-center gap-2">
          <Type size={12} className="text-[#1e3a5f]" /> Judul Artikel
        </label>
        <input 
          {...register("title", { required: true })} 
          placeholder="Masukkan judul yang menarik..."
          className="w-full p-4 mt-2 rounded-2xl bg-gray-50 border-none text-xs font-bold uppercase focus:ring-2 focus:ring-[#1e3a5f] transition-all" 
        />
      </div>

      {/* RICH TEXT EDITOR (QUILL) */}
      <div className="group">
  <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-[0.2em]">Isi Konten & Media</label>
  <div className="mt-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <ReactQuill 
      theme="snow"
      value={descriptionValue}
      onChange={(content) => setValue("description", content)}
      className="article-editor"
      modules={{
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          // 'list' digunakan untuk ordered dan bullet
          [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'align': [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean']
        ],
        clipboard: {
          matchVisual: false
        }
      }}
      // PERBAIKAN DI SINI:
      formats={[
        'header', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'list', 'indent', // Cukup gunakan 'list', hapus 'bullet'
        'align',
        'link', 'image', 'video',
        'blockquote', 'code-block'
        // Hapus 'width', 'height', dan 'style' karena tidak terdaftar secara default
      ]}
    />
  </div>
</div>

      {/* UPLOAD BANNER UTAMA */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-[0.2em]">Thumbnail Artikel</label>
        <div className="relative h-44 w-full rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden transition-all hover:border-[#1e3a5f]/30">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center text-gray-400">
              <ImageIcon className="mx-auto mb-2 opacity-20" size={32} />
              <p className="text-[9px] font-black uppercase tracking-widest">Pilih Gambar Sampul</p>
            </div>
          )}
          <input 
            type="file" 
            {...register("image", { 
              onChange: (e) => {
                const file = e.target.files[0];
                if (file) setPreview(URL.createObjectURL(file));
              }
            })} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>
      </div>

      {/* BUTTON SUBMIT */}
      <button 
        type="submit" 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="w-full py-5 rounded-[2rem] bg-[#1e3a5f] text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#2d507d] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
      >
        {createMutation.isPending || updateMutation.isPending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : isEdit ? <RefreshCw size={18} /> : <Save size={18} />}
        {isEdit ? "Simpan Perubahan" : "Publikasikan Sekarang"}
      </button>

      {/* CSS Override untuk menyesuaikan tema Navy */}
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none !important;
          background: #f8fafc;
          padding: 12px !important;
        }
        .ql-container.ql-snow {
          border: none !important;
          min-height: 200px;
          font-family: inherit;
        }
        .ql-editor {
          font-size: 13px;
          color: #334155;
          line-height: 1.6;
        }
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #cbd5e1;
          font-weight: 600;
        }
      `}</style>
    </form>
  );
};