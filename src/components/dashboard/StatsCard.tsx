import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  iconBg?: string;
  iconColor?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "bg-gradient-to-br from-[#1e3a5f] to-[#00d4ff]",
  iconBg = "bg-[#1e3a5f]/10",
  iconColor = "text-[#1e3a5f]"
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-4">
        <div className={`h-1 w-full rounded-full ${color}`}></div>
      </div>
    </div>
  );
};
