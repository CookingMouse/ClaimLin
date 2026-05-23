import React from "react";
import Button from "./Button";

interface FileUploadZoneProps {
  label: string;
  icon: React.ReactNode;
  fileName?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  lang: "EN" | "BM";
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  icon,
  fileName,
  onUpload,
  onRemove,
  lang,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all ${
        fileName
          ? "border-purple-500 bg-purple-50/25 text-purple-900"
          : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
      }`}
    >
      <div className="p-3 rounded-full bg-slate-100 mb-2.5">{icon}</div>
      <span className="text-xs font-black text-slate-800">{label}</span>

      <div className="mt-4 w-full">
        {fileName ? (
          <div className="bg-white border border-purple-200 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-sm">
            <span className="truncate max-w-[150px] font-mono text-purple-700 font-bold">
              {fileName}
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={onRemove}
            >
              {lang === "EN" ? "Remove" : "Padam"}
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl inline-block transition-all shadow-sm">
            {lang === "EN" ? "Choose File" : "Pilih Fail"}
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;
