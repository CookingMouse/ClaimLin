import React from "react";
import Button from "../ui/Button";

interface LetterPreviewProps {
  title: string;
  content: string;
  onCopy: () => void;
  lang: "EN" | "BM";
}

const LetterPreview: React.FC<LetterPreviewProps> = ({
  title,
  content,
  onCopy,
  lang,
}) => {
  return (
    <div className="p-5 bg-slate-50 rounded-2xl border border-purple-100 flex flex-col justify-between gap-4 shadow-sm">
      <div>
        <h4 className="text-xs font-black uppercase text-slate-850">{title}</h4>
        <pre className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-[9px] text-slate-600 whitespace-pre-wrap max-h-44 overflow-y-auto mt-2 leading-relaxed shadow-inner">
          {content}
        </pre>
      </div>

      <Button variant="primary" size="sm" onClick={onCopy}>
        {lang === "EN" ? "Copy Letter Text" : "Salin Teks Surat"}
      </Button>
    </div>
  );
};

export default LetterPreview;
