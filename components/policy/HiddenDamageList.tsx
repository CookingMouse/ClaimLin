import React from "react";
import { HiddenDamageItem } from "@/types";

interface HiddenDamageListProps {
  items: HiddenDamageItem[];
  lang: "EN" | "BM";
}

const HiddenDamageList: React.FC<HiddenDamageListProps> = ({ items, lang }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex gap-2.5"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
              item.severity === "high"
                ? "bg-red-500"
                : item.severity === "medium"
                ? "bg-amber-500"
                : "bg-blue-500"
            }`}
          ></span>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-800">
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HiddenDamageList;
