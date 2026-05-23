import React from "react";
import { DocumentKey, ClaimDocument } from "@/types";

interface MissingDocChecklistProps {
  uploadedFiles: Partial<Record<DocumentKey, ClaimDocument>>;
  lang: "EN" | "BM";
}

const MissingDocChecklist: React.FC<MissingDocChecklistProps> = ({
  uploadedFiles,
  lang,
}) => {
  const items: { key: DocumentKey; label: { EN: string; BM: string } }[] = [
    {
      key: "policy",
      label: { EN: "Allianz Policy PDF", BM: "Dokumen Polisi (PDF)" },
    },
    {
      key: "photos",
      label: { EN: "Clear Disaster Photos", BM: "Gambar Jelas Kerosakan" },
    },
    {
      key: "policeReport",
      label: { EN: "PDRM Police Report", BM: "Laporan Polis PDRM" },
    },
    {
      key: "bombaReport",
      label: { EN: "Bomba Forensics Log", BM: "Sijil Penilaian Bomba" },
    },
    {
      key: "receipts",
      label: { EN: "Original Shopee Receipts", BM: "Resit Belian Perabot" },
    },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
      <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest mb-4">
        {lang === "EN"
          ? "Documents Needed for a Stronger Claim"
          : "Dokumen Diperlukan Untuk Menguatkan Tuntutan"}
      </h4>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isUploaded = !!uploadedFiles[item.key];
          return (
            <div
              key={item.key}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                isUploaded
                  ? "border-purple-200 bg-purple-50/40 text-purple-900"
                  : "border-slate-100 bg-slate-50/50 text-slate-400"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                  isUploaded ? "bg-purple-600" : "bg-slate-200"
                }`}
              >
                {isUploaded && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {lang === "EN" ? item.label.EN : item.label.BM}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissingDocChecklist;
