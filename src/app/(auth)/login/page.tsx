"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/src/store/useAuthStore";
import api from "@/src/services/api";
import { InputGroup } from "@/src/components/ui/InputGroup";
import { Button } from "@/src/components/ui/Button";
import Image from "next/image";

// Schema validasi menggunakan Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

 const onSubmit = async (data: LoginFormValues) => {
  setIsLoading(true);
  try {
    // 1. SINKRONISASI FIELD: Kirim 'name' karena di DB dan Backend pakai 'name'
    const response = await api.post("/auth/login", {
      name: data.username, 
      password: data.password
    });

    // 2. STRUKTUR DATA: Ambil dari response.data.data (Backend membungkusnya)
    const { user, accessToken, refreshToken } = response.data.data;

    // 3. HILANGKAN MERAH: Masukkan 3 argumen sesuai definisi di useAuthStore
    setAuth(user, accessToken, refreshToken); 
    
    toast.success("Login Berhasil!");
    router.push("/dashboard");

  } catch (error: any) {
    // 4. MUNCULKAN ERROR: Tangkap pesan "Username atau Password salah" dari AppError
    const errorMessage = error.response?.data?.message || "Username atau Password salah";
    toast.error(errorMessage);
    
    console.error("Login Error Detail:", error.response?.data);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              <Image
                src="/logo_Mukraf_Studio2.png"
                alt="Mukraf Studio"
                width={160}
                height={160}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Mukraf Studio
            </h1>
            <p className="text-sm text-gray-500">
              Admin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputGroup
              label="Username"
              icon={User}
              placeholder="Masukkan username"
              error={errors.username?.message}
              {...register("username")}
            />

            <InputGroup
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Masukkan password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
              >
                Masuk
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              © 2026 Mukraf Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}