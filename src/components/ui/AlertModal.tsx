"use client";
import { Modal } from "./Modal";
import { AlertTriangle, Loader2, Info, AlertCircle } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
  variant = "danger",
}: AlertModalProps) => {
  
  const IconMap = {
    danger: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = IconMap[variant];

  const iconStyles = {
    danger: "bg-red-100 text-red-600",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-blue-100 text-blue-600",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center text-center py-6 px-4">
        {/* ICON */}
        <div className={`mb-6 rounded-full p-5 ${iconStyles[variant]}`}>
          <Icon className="h-12 w-12" strokeWidth={2} />
        </div>

        {/* TEXT */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md">
          {description}
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 ${buttonStyles[variant]}`}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Memproses..." : "Ya, Lanjutkan"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
