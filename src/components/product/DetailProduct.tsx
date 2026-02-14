import { Link as LinkIcon, Tag } from "lucide-react";

export const DetailProduct = ({ data }: { data: any }) => (
  <div className="space-y-6">
    {/* IMAGE SECTION */}
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <img 
        src={`http://localhost:3000/uploads/${data.image}`} 
        className="w-full h-full object-cover" 
        alt={data.title}
      />
    </div>

    {/* CONTENT SECTION */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div>
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Tag size={16} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Kategori #{data.categoryId}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{data.title}</h3>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Deskripsi
        </label>
        {/* PERBAIKAN DI SINI: Menggunakan dangerouslySetInnerHTML */}
        <div 
          className="text-sm text-gray-600 leading-relaxed mt-1 detail-description"
          dangerouslySetInnerHTML={{ __html: data.description }} 
        />
      </div>

      {data.link && (
        <div className="pt-2">
          <a 
            href={data.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1e3a5f] rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <LinkIcon size={14} />
            LIHAT LINK PRODUK
          </a>
        </div>
      )}
    </div>

    {/* Optional: Tambahkan sedikit CSS untuk merapikan list/bold di dalam deskripsi */}
    <style jsx global>{`
      .detail-description ul {
        list-style-type: disc;
        margin-left: 1.5rem;
      }
      .detail-description ol {
        list-style-type: decimal;
        margin-left: 1.5rem;
      }
    `}</style>
  </div>
);