import { Calendar, FileText } from "lucide-react";

export const DetailArticle = ({ data }: { data: any }) => (
  <div className="space-y-6 max-w-full">
    {/* IMAGE SECTION */}
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <img 
        src={`http://localhost:3000/uploads/${data.image}`} 
        className="w-full h-full object-cover" 
        alt={data.title}
      />
    </div>

    {/* CONTENT SECTION */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 overflow-hidden">
      <div>
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Calendar size={16} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            {new Date(data.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 break-words">{data.title}</h3>
      </div>

      <div className="w-full">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2 mb-2">
          <FileText size={14} />
          Isi Artikel
        </label>
        <p
          className="text-sm text-gray-600 leading-relaxed mt-1 whitespace-pre-wrap w-full"
          style={{ textAlign: "justify", overflowWrap: "normal", wordBreak: "normal" }}
        >
          {data.description}
        </p>
      </div>
    </div>
  </div>
);