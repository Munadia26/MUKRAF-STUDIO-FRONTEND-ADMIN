import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. BAGIAN PENTING: Menempelkan accessToken ke setiap request
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Penanganan otomatis jika token expired (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Cek jika status 401 dan bukan sedang mencoba retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rfToken = Cookies.get("refreshToken");

        // SINKRONISASI: Mengirim 'refreshToken' (sesuai req.body di backend)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`, {
          refreshToken: rfToken, 
        });

        // Ambil accessToken baru dari response backend
        const { accessToken } = res.data.data; 
        Cookies.set("accessToken", accessToken);

        // Update header untuk request yang gagal tadi
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Jalankan ulang request yang tadi sempat gagal
        return api(originalRequest);
      } catch (refreshError) {
        // Jika refresh token juga gagal/habis di DB, paksa logout
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;