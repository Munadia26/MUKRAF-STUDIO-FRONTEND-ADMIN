import { Sidebar } from "@/src/components/layout/sidebar";
import { Navbar } from "@/src/components/layout/navbar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* SIDEBAR - Lebar 64 (16rem) sesuai Sidebar.tsx */}
      <Sidebar />

      {/* AREA KONTEN UTAMA */}
      <div className="flex flex-1 flex-col ml-64">
        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <main className="p-10 transition-all duration-500">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}