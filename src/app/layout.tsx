import { Toaster } from 'sonner';
import "./globals.css";
import QueryProvider from "@/src/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {/* Provider membungkus seluruh aplikasi */}
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" /> {/* Tambahkan ini */}
        </QueryProvider>
      </body>
    </html>
  );
}