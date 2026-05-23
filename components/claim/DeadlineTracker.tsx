import React from "react";

interface DeadlineTrackerProps {
  lang: "EN" | "BM";
}

const DeadlineTracker: React.FC<DeadlineTrackerProps> = ({ lang }) => {
  const deadlines = [
    {
      title: { EN: "Report Loss to Insurer", BM: "Lapor Kemalangan" },
      days: "7 Days",
      color: "text-red-600 bg-red-50 border-red-100",
    },
    {
      title: { EN: "Submit Supporting Bills", BM: "Hantar Resit & Bukti" },
      days: "30 Days",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: { EN: "File Official Appeal", BM: "Fail Rayuan Ombudsmen" },
      days: "6 Months",
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
      <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest mb-4">
        {lang === "EN" ? "Action Timeline Limits" : "Had Masa Tindakan Undang-Undang"}
      </h4>
      <div className="flex flex-col gap-4">
        {deadlines.map((dl, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0"
          >
            <span className="text-xs text-slate-700 font-bold">
              {lang === "EN" ? dl.title.EN : dl.title.BM}
            </span>
            <span
              className={`text-[11px] font-mono px-2.5 py-1 rounded-xl font-bold border ${dl.color}`}
            >
              {dl.days}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineTracker;
