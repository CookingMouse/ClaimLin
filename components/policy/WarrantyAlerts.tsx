import React from "react";
import { WarrantyRisk } from "@/types";

interface WarrantyAlertsProps {
  risks: WarrantyRisk[];
  lang: "EN" | "BM";
}

const WarrantyAlerts: React.FC<WarrantyAlertsProps> = ({ risks, lang }) => {
  return (
    <div className="bg-purple-50/50 border border-purple-100 text-purple-900 p-5 rounded-2xl flex gap-3">
      <div className="text-purple-600 shrink-0 mt-1">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-black uppercase tracking-wider">
          {lang === "EN"
            ? "⚠️ Crucial Conditions You Must Follow"
            : "⚠️ Syarat Waranti Polisi Yang Wajib Dipatuhi"}
        </h4>
        <div className="flex flex-col gap-2 mt-1">
          {risks.map((risk, idx) => (
            <p key={risk.id} className="text-xs text-slate-700 leading-relaxed">
              {idx + 1}.{" "}
              <strong className="text-slate-900">{risk.title}:</strong>{" "}
              {risk.description}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WarrantyAlerts;
