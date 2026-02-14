import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/services/api"; 
import { toast } from "sonner";

export const useMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data } = await api.get("/member");
      return data.data;
    },
  });
};

export const useMemberMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => api.post("/member", formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member berhasil ditambahkan");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Gagal tambah member")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      api.put(`/member/${id}`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Data member diperbarui");
    },
    onError: (error: any) => toast.error("Gagal update member")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/member/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member dihapus");
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};