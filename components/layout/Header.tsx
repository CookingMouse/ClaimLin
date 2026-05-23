import React from "react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

interface HeaderProps {
  lang: "EN" | "BM";
  setLang: (lang: "EN" | "BM") => void;
  easyMode: boolean;
  setEasyMode: (easyMode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  easyMode,
  setEasyMode,
}) => {
  return (
    <header className="bg-white border-b border-purple-100 sticky top-0 z-50 px-4 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg shadow-purple-600/10 flex items-center justify-center">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ClaimLin
              </span>
              <Badge variant="primary">Independent Advocate</Badge>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {lang === "EN"
                ? "Empathetic Fire & Flood Claims Companion for Malaysia"
                : "Pembantu Tuntutan Kebakaran & Banjir Malaysia"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setLang("EN")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === "EN"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("BM")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === "BM"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bahasa Melayu
            </button>
          </div>

          <Button
            variant={easyMode ? "primary" : "secondary"}
            onClick={() => setEasyMode(!easyMode)}
            className="flex items-center gap-2"
          >
            <span
              className={`w-3 h-3 rounded-full ${
                easyMode ? "bg-white animate-pulse" : "bg-slate-300"
              }`}
            ></span>
            <span>
              {lang === "EN"
                ? "Easy Mode (Large text & simple words)"
                : "Mod Mudah (Tulisan besar & bahasa ringkas)"}
            </span>
            {easyMode && <Badge variant="easy">EASY</Badge>}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
