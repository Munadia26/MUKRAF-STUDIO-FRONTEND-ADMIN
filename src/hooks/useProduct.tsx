import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/services/api"; 
import { toast } from "sonner";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data.data;
    },
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => 
      api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambah produk");
    }
  });

  const updateMutation = useMutation({
    // Fungsi ini menerima objek { id, formData }
    mutationFn: async ({ id, formData }: { id: string | number; formData: FormData }) => {
      // Mengirim ke PUT /api/v1/products/:id
      const response = await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil diperbarui!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui produk");
      console.error("Update Error:", error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dihapus");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};