import React from "react";
import { PropertyType } from "@/types";
import Card from "../ui/Card";

interface PropertyTypeSelectorProps {
  selected: PropertyType;
  onSelect: (type: PropertyType) => void;
  lang: "EN" | "BM";
}

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({
  selected,
  onSelect,
  lang,
}) => {
  const types: { value: PropertyType; label: { EN: string; BM: string } }[] = [
    {
      value: "Landed Home",
      label: { EN: "Landed Home", BM: "Rumah Teres / Banglo" },
    },
    {
      value: "High-Rise Unit",
      label: { EN: "High-Rise Unit", BM: "Apartment / Kondominium" },
    },
    {
      value: "Shoplot",
      label: { EN: "Shoplot", BM: "Kedai / Pejabat" },
    },
    {
      value: "Industrial Factory",
      label: { EN: "Industrial Factory", BM: "Kilang Perindustrian" },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onSelect(type.value)}
          className={`text-left transition-all ${
            selected === type.value ? "scale-[1.02]" : ""
          }`}
        >
          <Card
            className={`h-full flex flex-col items-center justify-center text-center p-4 border-2 transition-all ${
              selected === type.value
                ? "border-purple-500 bg-purple-50/50"
                : "border-purple-100 hover:border-purple-200"
            }`}
          >
            <span
              className={`text-sm font-black ${
                selected === type.value ? "text-purple-900" : "text-slate-600"
              }`}
            >
              {lang === "EN" ? type.label.EN : type.label.BM}
            </span>
          </Card>
        </button>
      ))}
    </div>
  );
};

export default PropertyTypeSelector;
