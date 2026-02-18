import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  // Mengambil URL API dari environment variable
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  // JANGAN mengunci Content-Type di sini agar FormData bisa bekerja otomatis
});

// 1. INTERCEPTOR REQUEST: Menempelkan token ke setiap permintaan
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Jika data yang dikirim adalah FormData (seperti saat upload foto member),
  // kita hapus Content-Type agar browser otomatis mengaturnya ke 'multipart/form-data'
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    // Untuk request biasa (JSON), kita bisa set ke application/json
    config.headers["Content-Type"] = "application/json";
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. INTERCEPTOR RESPONSE: Penanganan otomatis jika token expired (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Jika error 401 (Unauthorized) dan belum pernah mencoba refresh (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const rfToken = Cookies.get("refreshToken");

        // Jika tidak ada refresh token di cookies, langsung lempar ke login
        if (!rfToken) {
          throw new Error("No refresh token available");
        }

        // Meminta access token baru ke backend
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`, 
          { refreshToken: rfToken }
        );

        // Ambil token baru dari response
        const { accessToken } = res.data.data; 
        
        // Simpan token baru ke cookies
        Cookies.set("accessToken", accessToken);

        // Update header untuk request yang tadi gagal
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Jalankan ulang request yang gagal tadi dengan token baru
        return api(originalRequest);
      } catch (refreshError) {
        // Jika proses refresh gagal (token di DB sudah dihapus/invalid), paksa logout
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        
        // Redirect ke halaman login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;