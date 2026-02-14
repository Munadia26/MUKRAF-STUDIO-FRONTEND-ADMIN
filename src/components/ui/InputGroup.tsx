import React, { InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
  ({ label, icon: Icon, error, type = "text", className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} strokeWidth={2} />
          </div>

          <input
            ref={ref}
            type={type}
            className={`
              w-full h-12 pl-12 pr-4 bg-white border border-gray-200
              rounded-xl text-sm text-gray-900 outline-none 
              transition-all placeholder:text-gray-400
              focus:border-gray-900 focus:ring-2 focus:ring-gray-100
              ${error ? "border-red-300 focus:border-red-500 focus:ring-red-50" : ""}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputGroup.displayName = "InputGroup";
