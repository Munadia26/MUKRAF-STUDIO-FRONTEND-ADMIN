// src/app/admin/members/page.tsx
"use client";
import { useState } from "react";
import { Modal } from "@/src/components/ui/Modal";
import { AlertModal } from "@/src/components/ui/AlertModal";
import { Plus, Users, Trash2, PencilLine, Eye } from "lucide-react";
import { useMembers, useMemberMutations } from "@/src/hooks/useMember";
import { MemberForm } from "@/src/components/member/MemberForm";

export default function MemberAdminPage() {
  const { data: members, isLoading } = useMembers();
  const { deleteMutation } = useMemberMutations();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedMember(null);
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedMember) {
      await deleteMutation.mutateAsync(selectedMember.id);
      setIsAlertOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Users className="text-[#1e3a5f]" size={32} />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800">Manajemen Tim</h1>
        </div>
        <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
          <Plus size={20} /> Tambah Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Member</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Jabatan</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members?.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <img src={`http://localhost:3000/uploads/${item.image}`} className="h-12 w-12 rounded-full object-cover border" alt={item.name} />
                  <span className="font-bold text-sm text-gray-900 uppercase">{item.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium uppercase">{item.position}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><PencilLine size={18} /></button>
                    <button onClick={() => { setSelectedMember(item); setIsAlertOpen(true); }} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === "add" ? "Tambah Member Baru" : "Edit Profil Member"}>
        <MemberForm onSuccess={() => setIsModalOpen(false)} initialData={selectedMember} />
      </Modal>

      <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} onConfirm={handleConfirmDelete} title="Hapus Member?" description={`Data "${selectedMember?.name}" akan dihapus permanen.`} isLoading={deleteMutation.isPending} variant="danger" />
    </div>
  );
}