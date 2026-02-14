import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
}

export const Button = ({
  children,
  isLoading,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:pointer-events-none overflow-hidden";
  
  const variants = {
    // Modern Gradient dengan efek Glow
    primary: "bg-[#1e3a5f] text-white hover:bg-[#2a4d7d] shadow-[0_10px_20px_-10px_rgba(30,58,95,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(30,58,95,0.5)]",
    
    // Cyan Glassmorphism
    secondary: "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500 hover:text-white border border-cyan-200/50 backdrop-blur-sm",
    
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200",
    
    outline: "border-2 border-slate-200 bg-transparent text-slate-700 hover:border-[#1e3a5f] hover:text-[#1e3a5f]",
    
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50",
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          <span>Memproses...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};