import React from "react";

interface ClaimStrengthGaugeProps {
  score: number;
  lang: "EN" | "BM";
}

const ClaimStrengthGauge: React.FC<ClaimStrengthGaugeProps> = ({
  score,
  lang,
}) => {
  const getScoreColor = (s: number) => {
    if (s < 40) return "text-red-500 border-red-200 bg-red-50";
    if (s < 70) return "text-amber-500 border-amber-200 bg-amber-50";
    return "text-purple-700 border-purple-200 bg-purple-50";
  };

  const getScoreMessage = (s: number) => {
    if (lang === "EN") {
      if (s < 50) return "Adding Files Helps";
      return "Extremely Strong Case!";
    } else {
      if (s < 50) return "Perlu Tambah Dokumen";
      return "Persediaan Cemerlang!";
    }
  };

  const getScoreDesc = () => {
    if (lang === "EN") {
      return "Providing legal reports secures your compensation faster.";
    } else {
      return "Menyediakan laporan polis rasmi mempercepat kelulusan.";
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-3">
      <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest">
        {lang === "EN" ? "Your Claim Preparedness Progress" : "Tahap Persediaan Tuntutan Anda"}
      </h4>

      <div className="flex items-center gap-4">
        <div
          className={`relative w-20 h-20 rounded-full flex items-center justify-center font-mono font-black text-2xl shrink-0 border-4 shadow-inner transition-all duration-500 ${getScoreColor(
            score
          )}`}
        >
          {score}%
        </div>
        <div>
          <p className="font-black text-slate-800 text-sm">
            {getScoreMessage(score)}
          </p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {getScoreDesc()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimStrengthGauge;
