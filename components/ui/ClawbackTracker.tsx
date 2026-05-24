import React from "react";

interface ClawbackTrackerProps {
  withheldAmount: number;
  onUploadReceipt: (file: File) => void;
  lang: "EN" | "BM";
}

const ClawbackTracker: React.FC<ClawbackTrackerProps> = ({
  withheldAmount,
  onUploadReceipt,
  lang,
}) => {
  return (
    <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl border border-purple-100 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 bg-purple-50 rounded-full text-purple-600 shadow-inner">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-purple-700">
            RM {withheldAmount.toLocaleString()} {lang === "EN" ? "withheld (RCV)" : "ditahan (RCV)"}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
            {lang === "EN"
              ? "Reclaim this by uploading receipts"
              : "Tuntut semula dengan memuat naik resit"}
          </p>
        </div>
      </div>

      <div className="border-t border-purple-50 pt-4">
        <label className="cursor-pointer">
          <div className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50 flex items-center justify-center gap-2 transition-all">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs font-black text-slate-500">
              {lang === "EN" ? "Upload New Receipt" : "Muat Naik Resit Baru"}
            </span>
          </div>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadReceipt(file);
            }}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ClawbackTracker;
