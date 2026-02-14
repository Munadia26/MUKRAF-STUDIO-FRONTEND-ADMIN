"use client";
import { useState } from "react";
import { Modal } from "@/src/components/ui/Modal";
import { AlertModal } from "@/src/components/ui/AlertModal";
import { Plus, Eye, Trash2, PencilLine, FileText } from "lucide-react";
import { useArticles, useArticleMutations } from "@/src/hooks/useArticle";
import { ArticleForm } from "@/src/components/article/ArticleForm";
import { DetailArticle } from "@/src/components/article/DetailArticle";

export default function ArticleAdminPage() {
  const { data: articles, isLoading } = useArticles();
  const { deleteMutation } = useArticleMutations();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "detail">("add");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedArticle(null);
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleDetail = (article: any) => {
    setSelectedArticle(article);
    setModalType("detail");
    setIsModalOpen(true);
  };

  const handleOpenDelete = (article: any) => {
    setSelectedArticle(article);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
  if (!selectedArticle?.id) return; // Keamanan jika ID tidak ada

  try {
    await deleteMutation.mutateAsync(selectedArticle.id);
    setIsAlertOpen(false); // Tutup modal setelah sukses
    setSelectedArticle(null); // Bersihkan state
  } catch (error) {
    console.error("Gagal menghapus:", error);
    alert("Gagal menghapus artikel. Cek koneksi server.");
  }
};

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <FileText className="text-[#1e3a5f]" size={32} />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800">
            Manajemen Artikel
          </h1>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#2d507d] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus size={20} />
          Tambah Artikel
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Artikel
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles && articles.length > 0 ? (
              articles.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={`http://localhost:3000/uploads/${item.image}`}
                        className="h-14 w-14 rounded-lg object-cover shadow-sm border border-gray-200"
                        alt={item.title}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleDetail(item)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        title="Edit"
                      >
                        <PencilLine size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(item)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <FileText size={48} />
                    <p className="font-semibold text-sm">
                      Belum ada artikel
                    </p>
                    <p className="text-xs">
                      Klik tombol "Buat Artikel" untuk memulai
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === "add"
            ? "Tambah Artikel Baru"
            : modalType === "edit"
            ? "Edit Artikel"
            : "Detail Artikel"
        }
      >
        {modalType === "detail" ? (
          <DetailArticle data={selectedArticle} />
        ) : (
          <ArticleForm
            initialData={selectedArticle}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      {/* ALERT */}
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Artikel?"
        description={`Artikel "${selectedArticle?.title}" akan dihapus permanen dari database.`}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
}