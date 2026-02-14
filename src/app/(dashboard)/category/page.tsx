// src/app/admin/categories/page.tsx
"use client";
import { useState } from "react";
import { Modal } from "@/src/components/ui/Modal";
import { AlertModal } from "@/src/components/ui/AlertModal";
import { Plus, Trash2, PencilLine, Tags } from "lucide-react";
import { useCategories, useCategoryMutations } from "@/src/hooks/useCategory";
import { CategoryForm } from "@/src/components/category/CategoryForm";

export default function CategoryAdminPage() {
  const { data: categories, isLoading } = useCategories();
  const { deleteMutation } = useCategoryMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedCategory(null);
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleOpenDelete = (category: any) => {
    setSelectedCategory(category);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      await deleteMutation.mutateAsync(selectedCategory.id);
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <Tags className="text-[#1e3a5f]" size={32} />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800">
            Manajemen Kategori
          </h1>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#2d507d] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus size={20} />
          Tambah Kategori
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Jumlah Produk
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories && categories.length > 0 ? (
              categories.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {item.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                      {item._count?.products || 0} Produk
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
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
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <Tags size={48} />
                    <p className="font-semibold text-sm">
                      Belum ada kategori
                    </p>
                    <p className="text-xs">
                      Klik tombol "Tambah Kategori" untuk memulai
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
        title={modalType === "add" ? "Tambah Kategori Baru" : "Edit Kategori"}
      >
        <CategoryForm 
          initialData={selectedCategory} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </Modal>

      {/* ALERT */}
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kategori?"
        description={`Kategori "${selectedCategory?.name}" akan dihapus permanen. Pastikan tidak ada produk di dalam kategori ini.`}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
}