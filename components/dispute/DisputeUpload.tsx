import React from "react";
import Button from "../ui/Button";

interface DisputeUploadProps {
  onUpload: (file: File) => void;
  lang: "EN" | "BM";
}

const DisputeUpload: React.FC<DisputeUploadProps> = ({ onUpload, lang }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="border border-purple-100 bg-purple-50/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="max-w-md">
        <h4 className="text-xs font-black text-slate-850 uppercase">
          {lang === "EN"
            ? "Upload Insurer's Settlement Letter"
            : "Muat Naik Surat Keputusan Insurans"}
        </h4>
        <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
          {lang === "EN"
            ? "If they rejected your flood claim, upload the PDF decision. We will automatically draft your legal objection letters."
            : "Jika mereka menolak tuntutan banjir anda, muat naik surat PDF keputusan tersebut untuk kami draf rayuan bantahan."}
        </p>
      </div>

      <div className="shrink-0">
        <label className="cursor-pointer">
          <Button variant="primary" className="pointer-events-none">
            {lang === "EN" ? "Upload PDF Letter" : "Muat Naik Surat PDF"}
          </Button>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default DisputeUpload;
