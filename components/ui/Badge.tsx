import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "easy" | "danger" | "warning" | "success";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const baseStyles = "text-[10px] uppercase font-extrabold px-3 py-1 rounded-full";

  const variants = {
    primary: "bg-purple-50 text-purple-700",
    secondary: "bg-slate-100 text-slate-500",
    outline: "border border-purple-100 text-purple-600",
    easy: "bg-purple-800 text-white font-mono",
    danger: "bg-red-50 text-red-700",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    success: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
