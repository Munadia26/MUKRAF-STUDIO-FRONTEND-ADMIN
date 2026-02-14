import { NextResponse } from "next/server";
// PERBAIKAN: Harus diimpor dari "next/server"
import type { NextRequest } from "next/server"; 

export function middleware(request: NextRequest) {
  // Ambil token dari cookies
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Daftar path yang diproteksi (Hanya untuk Admin)
  const protectedPaths = [
    "/dashboard", 
    "/profile", 
    "/category", 
    "/product", 
    "/articles", 
    "/member"
  ];
  
  const isProtectedPage = protectedPaths.some((path) => pathname.startsWith(path));
  const isLoginPage = pathname === "/login";

  // 1. Jika akses halaman admin tanpa login, lempar ke /login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Jika sudah login tapi mencoba buka /login, lempar ke /dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config matcher untuk menentukan rute mana yang diawasi middleware
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/profile/:path*", 
    "/category/:path*", 
    "/product/:path*", 
    "/articles/:path*", 
    "/member/:path*", 
    "/login"
  ],
};