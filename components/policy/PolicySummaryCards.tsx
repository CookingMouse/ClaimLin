import React from "react";
import Card from "../ui/Card";
import { PolicyAnalysis } from "@/types";

interface PolicySummaryCardsProps {
  analysis: PolicyAnalysis;
  lang: "EN" | "BM";
}

const PolicySummaryCards: React.FC<PolicySummaryCardsProps> = ({
  analysis,
  lang,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {analysis.coverageItems.map((item, idx) => (
        <Card
          key={idx}
          className="bg-slate-50 p-5 flex flex-col gap-1.5 shadow-sm border-slate-100"
        >
          <span className="text-[10px] font-bold uppercase text-slate-500">
            {item.label}
          </span>
          <p
            className={`text-xl font-black ${
              item.status === "covered" ? "text-emerald-600" : "text-purple-600"
            }`}
          >
            {item.detail}
          </p>
          <p className="text-[11px] text-slate-500">{item.clause}</p>
        </Card>
      ))}
    </div>
  );
};

export default PolicySummaryCards;
