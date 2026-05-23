import React from "react";

interface ValuationCalculatorProps {
  sumInsured: number;
  setSumInsured: (val: number) => void;
  actualRebuildCost: number;
  setActualRebuildCost: (val: number) => void;
  lossValue: number;
  setLossValue: (val: number) => void;
  payout: number;
  shortfall: number;
  isUnderInsured: boolean;
  lang: "EN" | "BM";
}

const ValuationCalculator: React.FC<ValuationCalculatorProps> = ({
  sumInsured,
  setSumInsured,
  actualRebuildCost,
  setActualRebuildCost,
  lossValue,
  setLossValue,
  payout,
  shortfall,
  isUnderInsured,
  lang,
}) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-5">
      <div>
        <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
          {lang === "EN" ? "STEP 3: VALUE ESTIMATOR" : "LANGKAH 3: PENGIRAAN NILAI"}
        </span>
        <h3 className="text-2xl font-black text-slate-900 mt-2">
          {lang === "EN" ? "3. Rebuilding & Payout Estimator" : "3. Pengira Ganti Rugi & Nilai Bina Semula"}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {lang === "EN"
            ? "In Malaysia, if you insure your house for less than it actually costs to rebuild today, the insurance company will penalize you. Let's calculate your safe coverage below."
            : "Di Malaysia, jika anda melindungi rumah anda kurang daripada kos binaan semula hari ini, tuntutan anda akan dikurangkan. Semak keselamatan anda di bawah."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-150">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-bold">
              {lang === "EN" ? "What Your Policy Covers" : "Had Perlindungan Polisi"}
            </span>
            <span className="text-purple-700 font-bold">RM {sumInsured.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={1000000}
            step={10000}
            value={sumInsured}
            onChange={(e) => setSumInsured(Number(e.target.value))}
            className="accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-bold">
              {lang === "EN" ? "Actual Rebuild Price" : "Kos Bina Semula Hari Ini"}
            </span>
            <span className="text-red-600 font-bold">RM {actualRebuildCost.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={1000000}
            step={10000}
            value={actualRebuildCost}
            onChange={(e) => setActualRebuildCost(Number(e.target.value))}
            className="accent-red-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-bold">
              {lang === "EN" ? "Calculated Loss" : "Nilai Kerosakan"}
            </span>
            <span className="text-slate-800 font-bold">RM {lossValue.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={5000}
            value={lossValue}
            onChange={(e) => setLossValue(Number(e.target.value))}
            className="accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
        </div>
      </div>

      <div
        className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 ${
          isUnderInsured
            ? "bg-red-50 border-red-200"
            : "bg-purple-50/40 border-purple-200"
        }`}
      >
        <div>
          <h4 className="text-xs font-black uppercase text-slate-800">
            {lang === "EN" ? "Will your payout be cut?" : "Adakah bayaran tuntutan anda akan dikurangkan?"}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed mt-1 max-w-lg font-medium">
            {isUnderInsured
              ? lang === "EN"
                ? "Yes, because your covered limit is lower than modern construction costs."
                : "Ya, kerana perlindungan anda lebih rendah berbanding kos pembinaan semula sebenar hari ini."
              : lang === "EN"
              ? "No! You have enough coverage to rebuild fully."
              : "Tidak! Jumlah perlindungan anda mencukupi untuk membina semula sepenuhnya."}
          </p>
        </div>

        <div className="text-center md:border-l border-slate-200 md:pl-6 shrink-0">
          <span className="text-[10px] text-slate-500 font-black uppercase block">
            {lang === "EN" ? "Estimated Cash Payout" : "Bayaran Tunai Anda"}
          </span>
          <span
            className={`text-3xl font-black ${
              isUnderInsured ? "text-red-600" : "text-purple-700"
            }`}
          >
            RM {payout.toLocaleString()}
          </span>
          {isUnderInsured && (
            <p className="text-[10px] text-red-600 font-bold mt-1">
              {lang === "EN"
                ? `Underinsurance Deduction: RM ${shortfall.toLocaleString()}`
                : `Potongan Penalti: RM ${shortfall.toLocaleString()}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValuationCalculator;
