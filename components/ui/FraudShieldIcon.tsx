import React from "react";

interface FraudShieldIconProps {
  active: boolean;
}

const FraudShieldIcon: React.FC<FraudShieldIconProps> = ({ active }) => {
  return (
    <div
      className={`transition-all duration-500 ${
        active ? "text-emerald-500 scale-110 drop-shadow-md" : "text-slate-200"
      }`}
    >
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v5.62c0 4.47-3.08 8.61-7 9.81-3.92-1.2-7-5.34-7-9.81V8.07l7-3.89z" />
        <path
          d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
          className={active ? "animate-pulse" : ""}
        />
      </svg>
    </div>
  );
};

export default FraudShieldIcon;
