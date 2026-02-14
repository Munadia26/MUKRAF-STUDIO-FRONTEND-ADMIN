import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/services/api"; // Gunakan instance api agar verifyToken bekerja
import { toast } from "sonner";

export const useArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data } = await api.get("/articles");
      return data.data;
    },
  });
};

export const useArticleMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => 
      api.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel berhasil diterbitkan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat artikel");
    }
  });

  const updateMutation = useMutation({
    // Harus menerima objek { id, formData } agar sesuai dengan PUT /articles/:id
    mutationFn: ({ id, formData }: { id: string | number; formData: FormData }) => 
      api.put(`/articles/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel berhasil diperbarui");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal update artikel");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => api.delete(`/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel berhasil dihapus");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};