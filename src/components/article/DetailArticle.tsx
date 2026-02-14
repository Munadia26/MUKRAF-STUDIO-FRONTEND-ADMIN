import { Calendar, FileText } from "lucide-react";

export const DetailArticle = ({ data }: { data: any }) => (
  <div className="space-y-6 max-w-full"> {/* Tambahkan max-w-full */}
    {/* IMAGE SECTION */}
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <img 
        src={`http://localhost:3000/uploads/${data.image}`} 
        className="w-full h-full object-cover" 
        alt={data.title}
      />
    </div>

    {/* CONTENT SECTION */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 overflow-hidden"> {/* overflow-hidden di sini penting */}
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
        <h3 className="text-2xl font-bold text-gray-900 break-words">{data.title}</h3> {/* break-words untuk judul panjang */}
      </div>

      <div className="w-full">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2 mb-2">
          <FileText size={14} />
          Isi Artikel
        </label>
        
        {/* Render HTML dari Quill */}
        <div 
          className="text-sm text-gray-600 leading-relaxed mt-1 article-description"
          dangerouslySetInnerHTML={{ __html: data.description }} 
        />
      </div>
    </div>

    <style jsx global>{`
      /* Perbaikan Utama: Memaksa pembungkusan teks */
      .article-description {
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        hyphens: auto;
      }

      /* Paragraphs */
      .article-description p {
        margin-bottom: 1rem;
        line-height: 1.8;
        /* Mencegah teks meluap ke samping */
        max-width: 100%;
        white-space: normal;
      }

      /* Lists */
      .article-description ul, .article-description ol {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
        max-width: 100%;
      }
      
      .article-description li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
        overflow-wrap: break-word;
      }

      /* Links - Penting jika ada URL yang sangat panjang */
      .article-description a {
        color: #1e3a5f;
        text-decoration: underline;
        font-weight: 600;
        word-break: break-all; 
      }

      /* Images & Media */
      .article-description img {
        max-width: 100% !important;
        height: auto !important;
        border-radius: 0.5rem;
        margin: 1.5rem auto;
        display: block;
      }

      .article-description iframe {
        max-width: 100%;
        width: 100%;
        aspect-ratio: 16 / 9;
        height: auto;
        border-radius: 0.5rem;
      }

      /* Code Block - Biasanya ini penyebab scrolling horizontal */
      .article-description pre {
        background: #1e293b;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        font-family: 'Courier New', monospace;
        font-size: 0.875em;
        white-space: pre-wrap;       /* CSS3 - Membungkus teks kode */
        word-wrap: break-word;       /* Membungkus kata yang panjang */
        overflow-x: hidden;          /* Hilangkan scroll horizontal */
      }

      .article-description code {
        white-space: pre-wrap;
        word-break: break-all;
      }

      /* Headers */
      .article-description h1, .article-description h2, .article-description h3 {
        color: #1e3a5f;
        line-height: 1.3;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        word-wrap: break-word;
      }

      /* Indentation */
      .article-description .ql-indent-1 { padding-left: 1.5rem; }
      .article-description .ql-indent-2 { padding-left: 3rem; }
      
      /* Mobile Adjustment */
      @media (max-width: 640px) {
        .article-description .ql-indent-1,
        .article-description .ql-indent-2 {
           padding-left: 1rem; 
        }
      }
    `}</style>
  </div>
);