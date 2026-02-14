"use client";

import { useState } from "react";
import { TableContainer } from "@/src/components/ui/TableContainer";
import { Modal } from "@/src/components/ui/Modal";
import { AlertModal } from "@/src/components/ui/AlertModal";
import { Plus, Eye, Trash2, Package, PencilLine } from "lucide-react";
import { useProducts, useProductMutations } from "@/src/hooks/useProduct";
import { ProductForm } from "@/src/components/product/ProductForm";
import { DetailProduct } from "@/src/components/product/DetailProduct";

export default function ProductAdminPage() {
  const { data: products, isLoading } = useProducts();
  const { deleteMutation } = useProductMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "detail">("add");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
  setSelectedProduct(product); // Ini harus berisi object lengkap termasuk .id
  setModalType("edit");
  setIsModalOpen(true);
};

  const handleDetail = (product: any) => {
    setSelectedProduct(product);
    setModalType("detail");
    setIsModalOpen(true);
  };

  const handleOpenDelete = (product: any) => {
    setSelectedProduct(product);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await deleteMutation.mutateAsync(selectedProduct.id);
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <Package className="text-[#1e3a5f]" size={32} />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800">
            Manajemen Produk
          </h1>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#2d507d] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products && products.length > 0 ? (
              products.map((item: any) => (
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
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {item.category?.name || `ID: ${item.categoryId}`}
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
                    <Package size={48} />
                    <p className="font-semibold text-sm">
                      Belum ada produk
                    </p>
                    <p className="text-xs">
                      Klik tombol "Tambah Produk" untuk memulai
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
            ? "Tambah Produk Baru"
            : modalType === "edit"
            ? "Edit Produk"
            : "Detail Produk"
        }
      >
        {modalType === "detail" ? (
          <DetailProduct data={selectedProduct} />
        ) : (
          <ProductForm
            onSuccess={() => setIsModalOpen(false)}
            initialData={selectedProduct}
          />
        )}
      </Modal>

      {/* ALERT */}
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk?"
        description={`Produk "${selectedProduct?.title}" akan dihapus permanen dari database.`}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
