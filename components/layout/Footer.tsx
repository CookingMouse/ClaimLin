import React from "react";

interface FooterProps {
  lang: "EN" | "BM";
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="border-t border-purple-100 bg-white py-10 px-4 mt-16 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>
          {lang === "EN"
            ? "© 2026 ClaimLin - Independent Claims Advocacy Platform for Malaysian Strata & Landed Properties."
            : "© 2026 ClaimLin - Platform Advokasi Tuntutan Bebas untuk Hartanah Strata & Landed Malaysia."}
        </p>
        <div className="flex gap-4 text-xs text-slate-400">
          <span>
            {lang === "EN"
              ? "Bank Negara Malaysia Guidelines"
              : "Garis Panduan Bank Negara"}
          </span>
          <span>PIAM Compliant</span>
          <span>OFS / FMOS Enabled</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
