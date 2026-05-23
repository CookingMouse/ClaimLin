import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-black transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-purple-600 text-white hover:bg-purple-500 shadow-purple-600/10 focus:ring-purple-500",
    secondary:
      "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 focus:ring-slate-400",
    ghost:
      "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100 shadow-none focus:ring-slate-400",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 shadow-none focus:ring-red-500",
    warning:
      "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/10 focus:ring-amber-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-xs",
    lg: "px-6 py-4 text-sm tracking-wider",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
