import React from "react";
import { DocumentKey, ClaimDocument } from "@/types";
import FileUploadZone from "../ui/FileUploadZone";

interface DocumentUploadProps {
  uploadedFiles: Partial<Record<DocumentKey, ClaimDocument>>;
  onUpload: (key: DocumentKey, file: File) => void;
  onRemove: (key: DocumentKey) => void;
  lang: "EN" | "BM";
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  uploadedFiles,
  onUpload,
  onRemove,
  lang,
}) => {
  const docs: { key: DocumentKey; label: { EN: string; BM: string }; icon: React.ReactNode }[] = [
    {
      key: "policy",
      label: { EN: "Insurance Policy PDF", BM: "Dokumen Polisi (PDF)" },
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "photos",
      label: { EN: "Damage / Ruined Photos", BM: "Gambar Kemalangan / Kerosakan" },
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: "policeReport",
      label: { EN: "PDRM Police Report", BM: "Salinan Laporan Polis PDRM" },
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "bombaReport",
      label: { EN: "Bomba Forensics Document", BM: "Sijil Jabatan Bomba" },
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "receipts",
      label: { EN: "Pre-Loss Store Receipts", BM: "Resit Pembelian Lama" },
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {docs.map((doc) => (
        <FileUploadZone
          key={doc.key}
          label={lang === "EN" ? doc.label.EN : doc.label.BM}
          icon={doc.icon}
          fileName={uploadedFiles[doc.key]?.name}
          onUpload={(file) => onUpload(doc.key, file)}
          onRemove={() => onRemove(doc.key)}
          lang={lang}
        />
      ))}
    </div>
  );
};

export default DocumentUpload;
