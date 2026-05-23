import React from "react";

interface InsurerVsRealityPanelProps {
  payout: number;
  lossValue: number;
  lang: "EN" | "BM";
}

const InsurerVsRealityPanel: React.FC<InsurerVsRealityPanelProps> = ({
  payout,
  lossValue,
  lang,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-slate-500">
          {lang === "EN" ? "Insurer's Initial Offer" : "Tawaran Awal Insurans"}
        </span>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black text-slate-400 line-through">
            RM {lossValue.toLocaleString()}
          </span>
          <span className="text-3xl font-black text-red-600">
            RM {payout.toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 italic">
          {lang === "EN"
            ? "* Includes underinsurance penalty & depreciation."
            : "* Termasuk penalti kurang insurans & susut nilai."}
        </p>
      </div>

      <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200 flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-purple-600">
          {lang === "EN" ? "Actual Reconstruction Reality" : "Realiti Kos Pembinaan Semula"}
        </span>
        <span className="text-3xl font-black text-purple-700">
          RM {lossValue.toLocaleString()}
        </span>
        <p className="text-[10px] text-purple-500 font-bold">
          {lang === "EN"
            ? "Full contractor quotation verified."
            : "Sebut harga kontraktor penuh disahkan."}
        </p>
      </div>
    </div>
  );
};

export default InsurerVsRealityPanel;
