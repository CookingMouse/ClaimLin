import React from "react";

interface PayoutBarChartProps {
  offer: number;
  deserve: number;
  lang: "EN" | "BM";
}

const PayoutBarChart: React.FC<PayoutBarChartProps> = ({
  offer,
  deserve,
  lang,
}) => {
  const max = Math.max(offer, deserve);
  const offerWidth = (offer / max) * 100;
  const deserveWidth = (deserve / max) * 100;
  const gap = deserve - offer;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl border border-purple-100 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] font-black uppercase text-slate-400">
            {lang === "EN" ? "What they offer" : "Tawaran mereka"}
          </span>
          <span className="text-sm font-black text-slate-600">
            RM {offer.toLocaleString()}
          </span>
        </div>
        <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
          <div
            className="h-full bg-slate-300 transition-all duration-1000 ease-out"
            style={{ width: `${offerWidth}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] font-black uppercase text-purple-600">
            {lang === "EN" ? "What you deserve" : "Hak anda"}
          </span>
          <span className="text-sm font-black text-purple-700">
            RM {deserve.toLocaleString()}
          </span>
        </div>
        <div className="h-4 w-full bg-purple-50 rounded-full overflow-hidden border border-purple-100 shadow-inner">
          <div
            className="h-full bg-purple-600 transition-all duration-1000 ease-out"
            style={{ width: `${deserveWidth}%` }}
          />
        </div>
      </div>

      {gap > 0 && (
        <div className="text-center pt-2">
          <p className="text-[10px] font-black uppercase text-red-500 animate-pulse">
            {lang === "EN" ? "Lowball Gap" : "Jurang Pampasan"}: RM {gap.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default PayoutBarChart;
