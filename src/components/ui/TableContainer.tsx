interface TableProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const TableContainer = ({ title, description, action, children }: TableProps) => {
  return (
    <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_10px_40px_rgba(30,58,95,0.05)] overflow-hidden">
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 p-8">
        {/* AKSEN NAVY BAR */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#1e3a5f] rounded-r-full" />

        <div className="pl-2">
          <h3 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter leading-none">{title}</h3>
          {description && (
            <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{description}</p>
          )}
        </div>
        {action && <div className="flex shrink-0 items-center">{action}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};