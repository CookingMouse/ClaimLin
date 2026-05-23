import React from "react";

interface PredictivePromptChipProps {
  text: string;
  onClick: (text: string) => void;
}

const PredictivePromptChip: React.FC<PredictivePromptChipProps> = ({
  text,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="px-3 py-1.5 rounded-xl bg-white border border-purple-100 text-purple-700 text-[11px] font-bold hover:bg-purple-50 transition-all shadow-sm hover:shadow-md active:scale-95"
    >
      {text}
    </button>
  );
};

export default PredictivePromptChip;
