import React from "react";

interface ProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  className = "",
}) => {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-purple-600 uppercase tracking-widest">
            {label}
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            {progress}%
          </span>
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 shadow-inner">
        <div
          className="bg-purple-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
