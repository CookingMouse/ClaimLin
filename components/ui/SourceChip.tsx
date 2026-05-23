import React from "react";

interface SourceChipProps {
  source: string;
  onClick?: () => void;
}

const SourceChip: React.FC<SourceChipProps> = ({ source, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-100 hover:bg-purple-100 transition-colors mt-1"
    >
      [{source}]
    </button>
  );
};

export default SourceChip;
