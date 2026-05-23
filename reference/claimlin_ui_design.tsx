import React, { useState } from 'react';

// Custom Elegant SVG Icons for Accessibility & High Contrast (Purple Highlighted)
const IconShield = () => (
  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconAlert = () => (
  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const IconFileText = () => (
  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconCamera = () => (
  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconChat = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const IconDownload = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const IconScale = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

export default function App() {
  // Global View Settings for Accessibility
  const [easyMode, setEasyMode] = useState(true); // Default to simple, high-contrast, larger text
  const [lang, setLang] = useState("EN"); // "EN" or "BM"

  // Claim Setup States
  const [selectedProperty, setSelectedProperty] = useState("Landed Home");
  const [currentStep, setCurrentStep] = useState(1); // 1: Welcome & Upload, 2: Decipher Policy, 3: Claim Calculator, 4: Dispute & Appeal

  // Document states
  const [uploadedFiles, setUploadedFiles] = useState({
    policy: null,
    photos: null,
    policeReport: null,
    bombaReport: null,
    receipts: null,
    insurerOffer: null
  });

  // AI Orchestration States
  const [analyzing, setAnalyzing] = useState(false);
  const [activeAgentsLog, setActiveAgentsLog] = useState([]);

  // Math Models & Sliders (Simplified)
  const [sumInsured, setSumInsured] = useState(350000);
  const [actualRebuildCost, setActualRebuildCost] = useState(500000);
  const [lossValue, setLossValue] = useState(150000);

  // Content Ledger (Simplified list of house belongings)
  const [ledgerItems, setLedgerItems] = useState([
    { id: 1, name: "Living Room Sofa Set", age: 3, originalVal: 15000, replaced: false },
    { id: 2, name: "Kitchen Refrigerator", age: 2, originalVal: 8000, replaced: false },
    { id: 3, name: "Television & Electronics", age: 4, originalVal: 6000, replaced: false }
  ]);

  // Policy Chat Grounded Responses
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am your personal claims helper. I have analyzed your Allianz smart policy document. Ask me any question simply, like 'Is flood covered?' or 'What is my policy excess?'", cite: "" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Dispute / Stage 2 Simulator States
  const [disputeTriggered, setDisputeTriggered] = useState(false);
  const [disputeResponseGenerated, setDisputeResponseGenerated] = useState("");
  const [fmosLetterGenerated, setFmosLetterGenerated] = useState("");
  const [showFmosModal, setShowFmosModal] = useState(false);
  const [showLettersModal, setShowLettersModal] = useState(false);

  // Translation Matrix
  const t = {
    EN: {
      welcome: "Let's secure your fair insurance payout together.",
      subtitle: "ClaimLin is a simple, independent helper that guides you step-by-step through home fire or flood claims in Malaysia. No complicated terms, no confusion.",
      uploadSection: "1. Upload Your Proof & Documents",
      uploadDesc: "Select the documents you currently have. We will help you sort, scan, and prepare them to be completely audit-proof.",
      runBtn: "Let's Analyze My Claim",
      analyzingText: "Our AI agents are verifying your documents...",
      nextStep: "Continue",
      backStep: "Go Back",
      policySummary: "2. Your Simple Policy Guide",
      warrantyAlert: "⚠️ Crucial Conditions You Must Follow",
      calculatorTitle: "3. Rebuilding & Payout Estimator",
      calculatorDesc: "In Malaysia, if you insure your house for less than it actually costs to rebuild today, the insurance company will penalize you. Let's calculate your safe coverage below.",
      disputeTitle: "4. Rejection & Lowball Appeals",
      disputeDesc: "Has your insurance company offered you an unfairly low payout or rejected your claim? We can help you generate official dispute appeals immediately.",
      claimStrength: "Your Claim Preparedness Progress",
      easyModeTitle: "Easy Mode (Large text & simple words)",
      easyModeBadge: "EASY",
      normalJargon: "Detailed Mode",
      missingDocs: "Documents Needed for a Stronger Claim",
      deadlineHeader: "Action Timeline Limits",
      insureRatioLabel: "Will your payout be cut?",
      yesCut: "Yes, because your covered limit is lower than modern construction costs.",
      noCut: "No! You have enough coverage to rebuild fully.",
      chatTitle: "Have any questions about your policy? Ask below simply:"
    },
    BM: {
      welcome: "Mari dapatkan pampasan insurans anda yang adil bersama-sama.",
      subtitle: "ClaimLin adalah pembantu bebas pintar yang membimbing anda langkah-demi-langkah menuntut insurans kebakaran atau banjir di Malaysia. Tiada terma rumit.",
      uploadSection: "1. Muat Naik Bukti & Dokumen Anda",
      uploadDesc: "Pilih dokumen yang anda ada sekarang. Kami akan bantu anda mengurus dan menyediakannya supaya selamat daripada penolakan syarikat insurans.",
      runBtn: "Mula Analisis Tuntutan",
      analyzingText: "Sistem pintar kami sedang memeriksa fail anda...",
      nextStep: "Seterusnya",
      backStep: "Kembali",
      policySummary: "2. Ringkasan Polisi Mudah Faham",
      warrantyAlert: "⚠️ Syarat Waranti Polisi Yang Wajib Dipatuhi",
      calculatorTitle: "3. Pengira Ganti Rugi & Nilai Bina Semula",
      calculatorDesc: "Di Malaysia, jika anda melindungi rumah anda kurang daripada kos binaan semula hari ini, tuntutan anda akan dikurangkan. Semak keselamatan anda di bawah.",
      disputeTitle: "4. Rayuan Jika Tuntutan Ditolak / Rendah",
      disputeDesc: "Adakah syarikat insurans menawarkan bayaran terlalu sedikit atau menolak tuntutan anda? Kami boleh membantu anda mendraf surat bantahan rasmi.",
      claimStrength: "Tahap Persediaan Tuntutan Anda",
      easyModeTitle: "Mod Mudah (Tulisan besar & bahasa ringkas)",
      easyModeBadge: "MUDAH",
      normalJargon: "Mod Terperinci",
      missingDocs: "Dokumen Diperlukan Untuk Menguatkan Tuntutan",
      deadlineHeader: "Had Masa Tindakan Undang-Undang",
      insureRatioLabel: "Adakah bayaran tuntutan anda akan dikurangkan?",
      yesCut: "Ya, kerana perlindungan anda lebih rendah berbanding kos pembinaan semula sebenar hari ini.",
      noCut: "Tidak! Jumlah perlindungan anda mencukupi untuk membina semula sepenuhnya.",
      chatTitle: "Ada sebarang soalan tentang polisi anda? Tanya di sini:"
    }
  }[lang];

  // Automated Mock pipeline
  const runAIPipeline = (customFiles = null) => {
    setAnalyzing(true);
    setActiveAgentsLog([]);
    const filesToUse = customFiles || uploadedFiles;

    const logs = [
      { agent: "Location Assessor", msg: "Matched photos against regional flash flood database. Safe coordination checked.", status: "success" },
      { agent: "Document Intelligence", msg: "PDRM Police Report parsed. Date verified as 12 April 2026. Non-arson verified.", status: "success" },
      { agent: "Policy Auditor", msg: "Identified 'Special Perils' extension is active under standard terms.", status: "success" }
    ];

    let delay = 0;
    logs.forEach((log, index) => {
      setTimeout(() => {
        setActiveAgentsLog(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setAnalyzing(false);
          const updated = { ...filesToUse };
          if (!updated.policy) updated.policy = { name: "Allianz_Householder_Policy.pdf" };
          if (!updated.photos) updated.photos = { name: "Ruined_Kitchen_Evidence.jpg" };
          if (!updated.policeReport) updated.policeReport = { name: "PDRM_Shah_Alam_Report.pdf" };
          if (!updated.bombaReport) updated.bombaReport = { name: "Bomba_Forensic_Clearance.pdf" };
          if (!updated.receipts) updated.receipts = { name: "Shopee_Furniture_Invoices.pdf" };
          
          setUploadedFiles(updated);
          setCurrentStep(2); 
        }
      }, delay + 800);
      delay += 800;
    });
  };

  // Math models simplified
  const coverageRatio = sumInsured / actualRebuildCost;
  const isUnderInsured = sumInsured < actualRebuildCost;
  const rawFinalPayout = isUnderInsured ? Math.round(lossValue * coverageRatio) : lossValue;
  const penaltyShortfall = lossValue - rawFinalPayout;

  const handleToggleReplaced = (id) => {
    setLedgerItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, replaced: !item.replaced };
      }
      return item;
    }));
  };

  // Chat engine
  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const q = chatInput.toLowerCase();
    let ans = "I've searched your policy. Standard terms apply. Please let me know if you would like me to draft a confirmation request.";
    let page = "";

    if (lang === "EN") {
      ans = "I checked your policy schedule. For high-value personal contents, claims are restricted to 5% of your total content limit unless specifically listed.";
      page = "Section II: Content Sublimits (Page 15)";
      if (q.includes("flood") || q.includes("banjir") || q.includes("water")) {
        ans = "Yes! Your Policy Schedule contains 'Endorsement 113B: Special Perils (Flood)'. You are fully covered for flood water damage up to your selected limit.";
        page = "Endorsement 113B (Page 47)";
      } else if (q.includes("bomba") || q.includes("fire") || q.includes("api") || q.includes("certificate")) {
        ans = "Your fire protection is valid. Please double check that your local BOMBA fire certificate was renewed and valid on the incident date.";
        page = "General Conditions Clause 14 (Page 18)";
      }
    } else {
      ans = "Berdasarkan rujukan polisi, had maksimum pampasan barangan adalah terhad kepada 5% daripada perlindungan kecuali dinyatakan sebaliknya.";
      page = "Seksyen II - Had Khas (Muka Surat 15)";
      if (q.includes("flood") || q.includes("banjir") || q.includes("air")) {
        ans = "Ya! Dokumen anda mengandungi kelulusan perlindungan 'Special Perils' (Banjir). Anda layak menuntut ganti rugi penuh kerosakan air banjir.";
        page = "Polisi Tambahan 113B (Muka Surat 47)";
      } else if (q.includes("bomba") || q.includes("api") || q.includes("terbakar")) {
        ans = "Tuntutan kebakaran anda adalah dilindungi. Sila pastikan Sijil Perakuan Bomba adalah sah pada tarikh kejadian kebakaran berlaku.";
        page = "Syarat Waranti Am (Muka Surat 18)";
      }
    }

    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: chatInput, cite: "" },
      { sender: "ai", text: ans, cite: page }
    ]);
    setChatInput("");
  };

  // Dispute engine simulator
  const handleDisputeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, insurerOffer: file }));
      setDisputeTriggered(true);

      const letterText = `DEMAND & CONTESTATION OF SETTLEMENT OFFER
Policy Number: AL-998812-FH | Premise Address: Shah Alam, Selangor

To Senior Claims Director,

We formally contest your settlement valuation dated May 10, 2026. Your applied depreciation of 40% on household furniture violates our Replacement Cost Value (RCV) policy rider. 

We have already replaced multiple damaged items and presented valid receipts of purchase. We demand the immediate release of the withheld recoverable depreciation amount of RM 9,500.

Sincerely,
Azman Bin Razak`;

      setDisputeResponseGenerated(letterText);

      const fmosText = `FORMAL DISPUTE ESCALATION TO THE FINANCIAL MARKETS OMBUDSMAN SERVICE (FMOS)
[Under Bank Negara Malaysia Consumer Protection Framework]

Complainant: Azman Bin Razak
Disputed Sum: RM 40,000 (Within FMOS RM 250,000 Limit)

FACTS OF CASE:
The insurer applied an arbitrary 40% depreciation deduction (underinsurance penalty) to the content claim files.

REMEDY REQUESTED:
Compel the insurer to honor the full Replacement Cost Value (RCV) clause as specified under Policy Schedule Section 4.`;

      setFmosLetterGenerated(fmosText);
    }
  };

  // Calculate Preparedness score
  const calculateProgress = () => {
    let base = 10;
    if (uploadedFiles.policy) base += 20;
    if (uploadedFiles.photos) base += 20;
    if (uploadedFiles.policeReport) base += 20;
    if (uploadedFiles.bombaReport) base += 15;
    if (uploadedFiles.receipts) base += 15;
    return base;
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans transition-all duration-300 ${easyMode ? 'text-xl leading-relaxed' : 'text-sm'}`}>
      
      {/* Premium Warm Amethyst & Lavender Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50 px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg shadow-purple-600/10 flex items-center justify-center">
              <IconShield />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">ClaimLin</span>
                <span className="bg-purple-50 text-purple-700 text-xs uppercase font-extrabold px-3 py-1 rounded-full">
                  Independent Advocate
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Empathetic Fire & Flood Claims Companion for Malaysia</p>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="flex items-center gap-3 flex-wrap">
            
            {/* Language Switcher */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200">
              <button 
                onClick={() => setLang("EN")} 
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${lang === "EN" ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLang("BM")} 
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${lang === "BM" ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Bahasa Melayu
              </button>
            </div>

            {/* Easy Mode Switch */}
            <button
              onClick={() => setEasyMode(!easyMode)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all ${
                easyMode 
                  ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-600/10' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-305'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${easyMode ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></span>
              <span>{t.easyModeTitle}</span>
              {easyMode && <span className="bg-purple-800 text-[10px] px-2 py-0.5 rounded-md text-white font-mono">{t.easyModeBadge}</span>}
            </button>

          </div>

        </div>
      </header>

      {/* Reassuring Hero Banner */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50/50 border-b border-purple-100 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-3">
          <h2 className="font-black text-slate-900 text-3xl md:text-4xl tracking-tight leading-tight">
            {t.welcome}
          </h2>
          <p className="text-slate-600 max-w-2xl leading-relaxed text-sm md:text-base">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: GUIDANCE AND DOC HEALTH */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Action Track */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-4">
            <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest">
              {lang === "EN" ? "YOUR ROAD TO RECOVERY" : "HALUAN PEMULIHAN ANDA"}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { step: 1, title: lang === "EN" ? "1. Setup & Upload Files" : "1. Tetapan & Muat Naik Fail" },
                { step: 2, title: lang === "EN" ? "2. Simple Policy Guide" : "2. Panduan Ringkas Polisi" },
                { step: 3, title: lang === "EN" ? "3. Estimate Your Payout" : "3. Pengiraan Ganti Rugi" },
                { step: 4, title: lang === "EN" ? "4. Appeal Rejections" : "4. Rayuan Penolakan" }
              ].map(s => (
                <button
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`p-4 rounded-2xl text-left font-black border transition-all ${
                    currentStep === s.step 
                      ? 'border-purple-500 bg-purple-50/50 text-purple-900 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-500'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Claim Strength Score */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-3">
            <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest">
              {t.claimStrength}
            </h4>
            
            <div className="flex items-center gap-4">
              <div className="relative w-18 h-18 rounded-full bg-purple-50 flex items-center justify-center font-mono font-black text-2xl text-purple-700 shrink-0 border-4 border-purple-200 shadow-inner">
                {calculateProgress()}%
              </div>
              <div>
                <p className="font-black text-slate-800 text-sm">
                  {calculateProgress() < 50 
                    ? (lang === "EN" ? "Adding Files Helps" : "Perlu Tambah Dokumen") 
                    : (lang === "EN" ? "Extremely Strong Case!" : "Persediaan Cemerlang!")}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {lang === "EN" 
                    ? "Providing legal reports secures your compensation faster." 
                    : "Menyediakan laporan polis rasmi mempercepat kelulusan."}
                </p>
              </div>
            </div>
          </div>

          {/* Missing Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
            <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest mb-4">
              {t.missingDocs}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { key: "policy", label: lang === "EN" ? "Allianz Policy PDF" : "Dokumen Polisi (PDF)" },
                { key: "photos", label: lang === "EN" ? "Clear Disaster Photos" : "Gambar Jelas Kerosakan" },
                { key: "policeReport", label: lang === "EN" ? "PDRM Police Report" : "Laporan Polis PDRM" },
                { key: "bombaReport", label: lang === "EN" ? "Bomba Forensics Log" : "Sijil Penilaian Bomba" },
                { key: "receipts", label: lang === "EN" ? "Original Shopee Receipts" : "Resit Belian Perabot" }
              ].map(item => (
                <div 
                  key={item.key}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    uploadedFiles[item.key] 
                      ? 'border-purple-200 bg-purple-50/40 text-purple-900' 
                      : 'border-slate-100 bg-slate-50/50 text-slate-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${uploadedFiles[item.key] ? 'bg-purple-600' : 'bg-slate-200'}`}>
                    {uploadedFiles[item.key] && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Guidelines */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
            <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest mb-4">
              {t.deadlineHeader}
            </h4>
            <div className="flex flex-col gap-4">
              {[
                { title: lang === "EN" ? "Report Loss to Insurer" : "Lapor Kemalangan", days: "7 Days", color: "text-red-600 bg-red-50 border-red-100" },
                { title: lang === "EN" ? "Submit Supporting Bills" : "Hantar Resit & Bukti", days: "30 Days", color: "text-amber-600 bg-amber-50 border-amber-100" },
                { title: lang === "EN" ? "File Official Appeal" : "Fail Rayuan Ombudsmen", days: "6 Months", color: "text-purple-600 bg-purple-50 border-purple-100" }
              ].map((dl, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="text-xs text-slate-700 font-bold">{dl.title}</span>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-xl font-bold border ${dl.color}`}>
                    {dl.days}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: WORKSPACE */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* STEP 1: COMPASSIONATE DOCUMENT UPLOAD */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-6">
              
              <div>
                <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full font-black uppercase">
                  {lang === "EN" ? "STEP 1: INITIAL COMPILATION" : "LANGKAH 1: PENYEDIAAN AWAL"}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  {t.uploadSection}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t.uploadDesc}
                </p>
              </div>

              {/* Robust upload grids with clear visual labels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "policy", label: lang === "EN" ? "Insurance Policy PDF" : "Dokumen Polisi (PDF)", icon: <IconFileText /> },
                  { key: "photos", label: lang === "EN" ? "Damage / Ruined Photos" : "Gambar Kemalangan / Kerosakan", icon: <IconCamera /> },
                  { key: "policeReport", label: lang === "EN" ? "PDRM Police Report" : "Salinan Laporan Polis PDRM", icon: <IconFileText /> },
                  { key: "bombaReport", label: lang === "EN" ? "Bomba Forensics Document" : "Sijil Jabatan Bomba", icon: <IconFileText /> },
                  { key: "receipts", label: lang === "EN" ? "Pre-Loss Store Receipts" : "Resit Pembelian Lama", icon: <IconFileText /> }
                ].map(item => (
                  <div
                    key={item.key}
                    className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all ${
                      uploadedFiles[item.key]
                        ? 'border-purple-500 bg-purple-50/25 text-purple-900'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="p-3 rounded-full bg-slate-100 mb-2.5">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black text-slate-800">{item.label}</span>
                    
                    <div className="mt-4 w-full">
                      {uploadedFiles[item.key] ? (
                        <div className="bg-white border border-purple-200 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-sm">
                          <span className="truncate max-w-[150px] font-mono text-purple-700 font-bold">
                            {uploadedFiles[item.key].name}
                          </span>
                          <button
                            onClick={() => setUploadedFiles(prev => ({ ...prev, [item.key]: null }))}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl font-bold transition-all"
                          >
                            {lang === "EN" ? "Remove" : "Padam"}
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl inline-block transition-all shadow-sm">
                          {lang === "EN" ? "Choose File" : "Pilih Fail"}
                          <input
                            type="file"
                            onChange={e => handleFileDrop(item.key, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}

                {/* Instant sandbox driver for easy checking */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
                  <h4 className="text-xs font-black text-purple-900">
                    {lang === "EN" ? "Don't have files on this device?" : "Tiada fail dalam peranti ini?"}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {lang === "EN" 
                      ? "Click below to automatically load valid testing documents to experience the system." 
                      : "Klik butang di bawah untuk memasukkan contoh dokumen ujian secara automatik."}
                  </p>
                  <button
                    onClick={() => {
                      const mockData = {
                        policy: { name: "Allianz_Householder_Policy.pdf" },
                        photos: { name: "Evidence_Dapur_Terbakar.jpg" },
                        policeReport: { name: "PDRM_Shah_Alam_Report.pdf" },
                        bombaReport: { name: "Laporan_Bomba_Deraf.pdf" },
                        receipts: { name: "Resit_Pembelian_Lazada.pdf" }
                      };
                      setUploadedFiles(mockData);
                      runAIPipeline(mockData);
                    }}
                    className="mt-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-purple-600/10 transition-all"
                  >
                    {lang === "EN" ? "Load Sample Claims Data" : "Muatkan Contoh Tuntutan"}
                  </button>
                </div>

              </div>

              {/* Action Trigger */}
              <div className="border-t border-slate-100 pt-6 flex flex-col items-center gap-4">
                <button
                  onClick={() => runAIPipeline()}
                  disabled={analyzing}
                  className={`w-full max-w-md py-4 rounded-2xl font-black text-sm tracking-wider transition-all shadow-md ${
                    analyzing 
                      ? 'bg-slate-200 text-slate-400' 
                      : 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-600/10'
                  }`}
                >
                  {analyzing ? t.analyzingText : t.runBtn}
                </button>

                {analyzing && (
                  <div className="w-full bg-slate-900 text-slate-300 p-4 rounded-2xl font-mono text-xs flex flex-col gap-2 border border-slate-800">
                    <div className="flex justify-between items-center text-purple-400 font-bold">
                      <span>{t.analyzingText}</span>
                      <span className="animate-pulse">Active pipeline...</span>
                    </div>
                    {activeAgentsLog.map((log, i) => (
                      <div key={i} className="border-b border-slate-850 pb-2 last:border-0 last:pb-0">
                        <span className="text-purple-300 font-bold block">{log.agent}:</span>
                        <span className="text-slate-400">{log.msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 2: SIMPLIFIED POLICY INTERPRETATION */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-6">
                <div>
                  <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
                    {lang === "EN" ? "STEP 2: POLICY READOUT" : "LANGKAH 2: LAPORAN POLISI"}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    {t.policySummary}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === "EN" 
                      ? "Here are the critical facts translated directly from the 72-page booklet." 
                      : "Ini adalah fakta penting yang diterjemah terus daripada buku polisi 72 muka surat."}
                  </p>
                </div>

                {/* Simplified Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      {lang === "EN" ? "Fire Protection" : "Kebakaran"}
                    </span>
                    <p className="text-xl font-black text-emerald-600">
                      {lang === "EN" ? "Fully Protected" : "Dilindungi Penuh"}
                    </p>
                    <p className="text-[11px] text-slate-500">Section I: Clause 2 (Page 14)</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      {lang === "EN" ? "Flood Protection" : "Perlindungan Banjir"}
                    </span>
                    <p className="text-xl font-black text-emerald-600">
                      {lang === "EN" ? "Active Extension" : "Pilihan Tambahan Aktif"}
                    </p>
                    <p className="text-[11px] text-slate-500">Endorsement 113B (Page 47)</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      {lang === "EN" ? "Self-Pay Deductible" : "Ekses (Bayar Sendiri)"}
                    </span>
                    <p className="text-xl font-black text-purple-600">RM 1,000</p>
                    <p className="text-[11px] text-slate-500">Summary Schedule (Page 3)</p>
                  </div>
                </div>

                {/* Senior Warning Banner */}
                <div className="bg-purple-50/50 border border-purple-100 text-purple-900 p-5 rounded-2xl flex gap-3">
                  <div className="text-purple-600 shrink-0 mt-1">
                    <IconAlert />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-black uppercase tracking-wider">{t.warrantyAlert}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                      1. <strong className="text-slate-900">{lang === "EN" ? "Premium 60-Day Protection Rule:" : "Waranti Bayaran 60 Hari:"}</strong> {lang === "EN" ? "Your premium payment must clear within 60 days of purchase. We verified your Allianz digital receipt. Your coverage is 100% valid." : "Pembayaran premium mestilah diselesaikan dalam tempoh 60 hari. Resit Allianz digital anda disahkan selamat."}
                    </p>
                    {selectedProperty === "Shoplot" || selectedProperty === "Industrial Factory" ? (
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        2. <strong className="text-slate-900">{lang === "EN" ? "Valid BOMBA Certificate:" : "Sijil Sah Jabatan Bomba:"}</strong> {lang === "EN" ? "As a commercial asset, you must have a valid annual BOMBA inspection card active on the fire incident date to avoid refusal." : "Sila pastikan Sijil Perakuan Bomba adalah sah pada tarikh kejadian untuk mengelak tuntutan terbatal."}
                      </p>
                    ) : null}
                  </div>
                </div>

              </div>

              {/* Hidden damage prompting */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-4">
                <div>
                  <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
                    {lang === "EN" ? "HIDDEN DAMAGES DETECTED" : "KAPASITI KEROSAKAN TERSEMBUNYI"}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {lang === "EN" ? "Uncover Hidden Repair Claims" : "Jangan Terlepas Tuntutan Tersembunyi"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === "EN" 
                      ? "Standard loss adjusters might miss these structural hazards. Have your contractor add them to the quotation:" 
                      : "Syarikat insurans mungkin terlepas pandang perkara ini. Sila minta kontraktor masukkan kos ini:"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex gap-2.5">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5 shrink-0"></span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">
                        {lang === "EN" ? "Wall Wire Overheating" : "Kabel Elektrik Dalam Dinding"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {lang === "EN" ? "Fires melt protective pipe insulation inside plaster. Require an official heat degradation wiring test." : "Bahang haba merosakkan penebat kabel dalam dinding. Kontraktor perlu membuat ujian ketahanan litar."}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex gap-2.5">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5 shrink-0"></span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">
                        {lang === "EN" ? "Corrosive Soot in Ceiling Vents" : "Jelaga Berasid dalam Siling"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {lang === "EN" ? "Acids from soot corrode metallic frames long-term. Demand ceiling space cleaning." : "Asap kebakaran meninggalkan kesan habuk berasid dalam salur udara. Pastikan ada kos pembersihan udara."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
                  >
                    {t.nextStep} →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: HIGH VALUE ESTIMATOR WITH GIGANTIC CHATBOX */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Rebuilding Estimator Card */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-5">
                <div>
                  <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
                    {lang === "EN" ? "STEP 3: VALUE ESTIMATOR" : "LANGKAH 3: PENGIRAAN NILAI"}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    {t.calculatorTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.calculatorDesc}
                  </p>
                </div>

                {/* Highly readable purple-themed sliders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-150">
                  
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-bold">{lang === "EN" ? "What Your Policy Covers" : "Had Perlindungan Polisi"}</span>
                      <span className="text-purple-700 font-bold">RM {sumInsured.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range"
                      min={100000}
                      max={1000000}
                      step={50000}
                      value={sumInsured}
                      onChange={e => setSumInsured(Number(e.target.value))}
                      className="accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    />
                    <p className="text-[10px] text-slate-500">
                      {lang === "EN" ? "Policy maximum cap limit." : "Maksimum had perlindungan insurans."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-bold">{lang === "EN" ? "Actual Rebuild Price" : "Kos Bina Semula Hari Ini"}</span>
                      <span className="text-red-600 font-bold">RM {actualRebuildCost.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range"
                      min={100000}
                      max={1000000}
                      step={50000}
                      value={actualRebuildCost}
                      onChange={e => setActualRebuildCost(Number(e.target.value))}
                      className="accent-red-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    />
                    <p className="text-[10px] text-slate-500">
                      {lang === "EN" ? "Standard reconstruction costs." : "Kos bahan binaan & buruh hari ini."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-bold">{lang === "EN" ? "Calculated Loss" : "Nilai Kerosakan"}</span>
                      <span className="text-slate-800 font-bold">RM {lossValue.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range"
                      min={10000}
                      max={300000}
                      step={10000}
                      value={lossValue}
                      onChange={e => setLossValue(Number(e.target.value))}
                      className="accent-slate-700 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                    />
                    <p className="text-[10px] text-slate-500">
                      {lang === "EN" ? "Estimate of direct physical loss." : "Anggaran bil pembaikan fizikal."}
                    </p>
                  </div>

                </div>

                {/* Calculation breakdown */}
                <div className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 ${isUnderInsured ? 'bg-red-50 border-red-200' : 'bg-purple-50/40 border-purple-200'}`}>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800">{t.insureRatioLabel}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1 max-w-lg font-medium">
                      {isUnderInsured ? t.yesCut : t.noCut}
                    </p>
                  </div>

                  <div className="text-center md:border-l border-slate-200 md:pl-6 shrink-0">
                    <span className="text-[10px] text-slate-500 font-black uppercase block">
                      {lang === "EN" ? "Estimated Cash Payout" : "Bayaran Tunai Anda"}
                    </span>
                    <span className={`text-3xl font-black ${isUnderInsured ? 'text-red-600' : 'text-purple-700'}`}>
                      RM {rawFinalPayout.toLocaleString()}
                    </span>
                    {isUnderInsured && (
                      <p className="text-[10px] text-red-600 font-bold mt-1">
                        {lang === "EN" ? `Underinsurance Deduction: RM ${penaltyShortfall.toLocaleString()}` : `Potongan Penalti: RM ${penaltyShortfall.toLocaleString()}`}
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* RCV Ledger simply explained */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === "EN" ? "Recover Withheld Cash (Depreciation Ledger)" : "Tuntut Semula Susut Nilai Perabot"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === "EN" 
                      ? "Insurers payout a lower 'Actual Cash Value' (ACV) first. Once you actually buy replacements, check them below to reclaim the withheld depreciation." 
                      : "Syarikat insurans memotong nilai perabot lama terlebih dahulu. Apabila anda membeli perabot baru, sila tanda di bawah untuk menuntut baki wang asal."}
                  </p>
                </div>

                <div className="border border-purple-100 rounded-2xl overflow-hidden bg-slate-50/50">
                  <div className="divide-y divide-purple-100">
                    {ledgerItems.map(item => (
                      <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {lang === "EN" ? `Original Purchase Price: RM ${item.originalVal.toLocaleString()}` : `Harga Pembelian Asal: RM ${item.originalVal.toLocaleString()}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {item.replaced ? (
                            <div className="flex items-center gap-1.5">
                              <span className="bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-xl text-[10px] font-black uppercase">
                                {lang === "EN" ? "Replaced & Receipt Verified" : "Selesai Diganti & Resit Ada"}
                              </span>
                              <button 
                                onClick={() => handleToggleReplaced(item.id)}
                                className="text-[10px] text-red-500 font-bold hover:underline pl-1"
                              >
                                {lang === "EN" ? "Undo" : "Batal"}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleReplaced(item.id)}
                              className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-600/10"
                            >
                              {lang === "EN" ? "Yes, I have bought the replacement" : "Ya, Saya sudah beli yang baru"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export & Claim Package Trigger */}
                <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-850 uppercase">
                      {lang === "EN" ? "Export Your Compliant Claim Letter" : "Draf Surat Rasmi Pembelaan Tuntutan"}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {lang === "EN" 
                        ? "ClaimLin compiles your proof, GPS metadata logs, and structural damage requests into a single PDF submission." 
                        : "ClaimLin menyusun bukti resit, metadata GPS, dan tuntutan kerosakan dinding dalam satu fail surat rasmi."}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLettersModal(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/10 shrink-0"
                  >
                    <IconDownload />
                    <span>{lang === "EN" ? "Get Claim Letter" : "Buka Surat Tuntutan"}</span>
                  </button>
                </div>
              </div>

              {/* RE-DESIGNED GIGANTIC CHATBOX SECTION */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-4">
                <div className="border-b border-purple-100 pb-3">
                  <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
                    FEATURE 8: SECURE POLICY CHAT COMPANION
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2 flex items-center gap-2">
                    <IconChat />
                    <span>{t.chatTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    This chat companion is safely locked into the clauses of your uploaded Allianz SmartHome contract. Ask anything in simple English or Bahasa Melayu.
                  </p>
                </div>

                {/* Highly readable, comfortable chat screen with page citations */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-purple-100 h-80 overflow-y-auto flex flex-col gap-4 shadow-inner">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`max-w-[85%] flex flex-col gap-1.5 ${msg.sender === "user" ? "self-end items-end" : "self-start"}`}
                    >
                      <span className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user" ? "bg-purple-600 text-white font-bold rounded-tr-none shadow-md shadow-purple-600/10" : "bg-white text-slate-800 rounded-tl-none border border-purple-100 shadow-sm"}`}>
                        {msg.text}
                      </span>
                      {msg.cite && (
                        <span className="text-[10px] text-purple-600 font-extrabold tracking-wide uppercase flex items-center gap-1">
                          <span>📍</span> {msg.cite}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* One-click fast prompt triggers */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    lang === "EN" ? "Is flood covered?" : "Adakah banjir dilindungi?",
                    lang === "EN" ? "How much is my excess?" : "Berapakah nilai ekses?",
                    lang === "EN" ? "Is there a Bomba warranty?" : "Sila semak waranti Bomba"
                  ].map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setChatInput(q)}
                      className="bg-white hover:bg-purple-50 border border-purple-100 hover:border-purple-300 text-purple-700 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Spacious chat form */}
                <form onSubmit={handleChatSend} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={lang === "EN" ? "Type your question simply here..." : "Tulis soalan anda di sini secara mudah..."}
                    className="flex-1 bg-slate-50 border border-purple-100 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                  />
                  <button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-600/10"
                  >
                    {lang === "EN" ? "Ask AI" : "Tanya AI"}
                  </button>
                </form>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                >
                  ← {t.backStep}
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
                >
                  {t.nextStep} →
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: APPEAL LOOP & OMBUDSMAN SERVICES */}
          {currentStep === 4 && (
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-6 animate-fadeIn">
              
              <div>
                <span className="bg-red-50 text-red-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
                  {lang === "EN" ? "STEP 4: APPEAL PORTAL" : "LANGKAH 4: BAHAGIAN RAYUAN"}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  {t.disputeTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t.disputeDesc}
                </p>
              </div>

              {/* Upload Dispute / Rejection file */}
              <div className="border border-purple-100 bg-purple-50/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="max-w-md">
                  <h4 className="text-xs font-black text-slate-850 uppercase">
                    {lang === "EN" ? "Upload Insurer's Settlement Letter" : "Muat Naik Surat Keputusan Insurans"}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    {lang === "EN" 
                      ? "If they rejected your flood claim, upload the PDF decision. We will automatically draft your legal objection letters." 
                      : "Jika mereka menolak tuntutan banjir anda, muat naik surat PDF keputusan tersebut untuk kami draf rayuan bantahan."}
                  </p>
                </div>

                <div className="shrink-0">
                  <label className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs py-3 px-5 rounded-xl cursor-pointer inline-block transition-all shadow-lg shadow-purple-600/10">
                    {lang === "EN" ? "Upload PDF Letter" : "Muat Naik Surat PDF"}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleDisputeUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Show Appeal options */}
              {disputeTriggered ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Formal Contestation */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-purple-100 flex flex-col justify-between gap-4 shadow-sm">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-850">
                        {lang === "EN" ? "Your Counter-Argument Letter" : "Draf Surat Rayuan Bantahan Anda"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {lang === "EN" ? "This legally rejects wear-and-tear deductions on replaced furniture." : "Surat bantahan rasmi menolak pemotongan nilai susut perabot."}
                      </p>
                      <pre className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-[9px] text-slate-600 whitespace-pre-wrap max-h-44 overflow-y-auto mt-2 leading-relaxed shadow-inner">
                        {disputeResponseGenerated}
                      </pre>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(disputeResponseGenerated);
                        alert(lang === "EN" ? "Letter text copied successfully!" : "Teks surat berjaya disalin!");
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/10"
                    >
                      {lang === "EN" ? "Copy Letter Text" : "Salin Teks Surat"}
                    </button>
                  </div>

                  {/* Bank Negara complaint */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-purple-100 flex flex-col justify-between gap-4 shadow-sm">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-850">
                        {lang === "EN" ? "OFS / FMOS Free Complaint Package" : "Surat Aduan Percuma Bank Negara (FMOS)"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {lang === "EN" ? "Ready for submission to the Bank Negara independent tribunal." : "Draf aduan lengkap untuk dihantar ke tribunal bebas Bank Negara."}
                      </p>
                      <pre className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-[9px] text-slate-600 whitespace-pre-wrap max-h-44 overflow-y-auto mt-2 leading-relaxed shadow-inner">
                        {fmosLetterGenerated}
                      </pre>
                    </div>

                    <button
                      onClick={() => setShowFmosModal(true)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10"
                    >
                      {lang === "EN" ? "Submit Dispute Package" : "Hantar Aduan Ombudsman"}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center text-slate-400">
                  <p className="text-sm font-black text-slate-700">No active appeal letters yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lang === "EN" 
                      ? "If you want to try the Stage 2 appeal process, click the button below to simulate receiving a lowball offer." 
                      : "Jika anda ingin melihat simulasi bantahan rayuan, sila klik butang di bawah."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const dummyOffer = { name: "Surat_Tawaran_Kecil_Insurans.pdf" };
                      handleDisputeUpload({ target: { files: [dummyOffer] } });
                    }}
                    className="mt-4 bg-purple-100 hover:bg-purple-200 text-purple-700 font-black text-xs py-2 px-5 rounded-xl transition-all"
                  >
                    {lang === "EN" ? "Simulate Insurer Dispute" : "Mulakan Simulasi Rayuan"}
                  </button>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-slate-500 hover:text-slate-700 font-bold"
                >
                  ← {t.backStep}
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* FMOS Modal */}
      {showFmosModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp text-slate-900">
            <div className="p-4 bg-amber-500 text-slate-950 font-black flex justify-between items-center text-sm">
              <span className="flex items-center gap-1.5">
                <IconScale />
                <span>FMOS (Ombudsmen Dispute Appeal Platform)</span>
              </span>
              <button onClick={() => setShowFmosModal(false)} className="bg-amber-600 text-white text-xs font-mono px-2 py-0.5 rounded">
                Close
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                The Financial Markets Ombudsman Service (FMOS) is an independent body set up under Bank Negara Malaysia guidelines to resolve commercial & consumer claims up to RM250,000 completely free of charge.
              </p>
              <pre className="bg-slate-50 p-4 rounded-xl font-mono text-[9px] text-slate-600 max-h-48 overflow-y-auto border border-slate-150">
                {fmosLetterGenerated}
              </pre>
              <button
                onClick={() => {
                  alert("ClaimLin Secure Core: Appeal package submitted successfully to Bank Negara Malaysia FMOS sandbox.");
                  setShowFmosModal(false);
                }}
                className="bg-purple-600 hover:bg-purple-550 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Send Appeal to Ombudsmen Services
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Letters Modal */}
      {showLettersModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900">
            <div className="p-4 bg-purple-600 text-white font-black flex justify-between items-center text-sm">
              <span className="flex items-center gap-1.5">
                <IconFileText />
                <span>Claim Letter Submission Schedule</span>
              </span>
              <button onClick={() => setShowLettersModal(false)} className="bg-purple-700 text-white text-xs font-mono px-2 py-0.5 rounded">
                Close
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Here is the verified claim presentation letter generated client-side by ClaimLin. It includes calculations for underinsurance, replacement indices, and verified spatial logs.
              </p>
              <pre className="bg-slate-50 p-4 rounded-xl font-mono text-[9px] text-slate-600 max-h-48 overflow-y-auto border border-slate-150">
                {`CLAIM SUBMISSION PORTFOLIO (MALAYSIAN TARIFF CODE)
Claim ID: CL-2026-9001 | Asset: ${selectedProperty}

PROPERTY VALUE AUDIT:
- Sum Insured: RM ${sumInsured.toLocaleString()}
- Rebuild Price Valuation: RM ${actualRebuildCost.toLocaleString()}
${isUnderInsured ? `- Underinsurance Ratio: ${Math.round(coverageRatio * 100)}% applied under Average Clause.` : `- Sum Insured is fully adequate. Standard ACV calculations apply.`}

TOTAL COMPLIANT RECONSTRUCTION SETTLEMENT DEMANDED: RM ${averageClausePayout.toLocaleString()}

VERIFIED SUPPORTING LOGS:
- PDRM Traffic Police report cleared.
- GPS Watermark metadata matching Shah Alam area.
- Heat degradation wiring tests officially requested.

Generated Client-Side via ClaimLin Auto-Advocate.`}
              </pre>
              <button
                onClick={() => {
                  alert("Claim Letter PDF compiled and downloaded successfully (Simulated).");
                  setShowLettersModal(false);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                Download PDF Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="border-t border-purple-100 bg-white py-10 px-4 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ClaimLin - Independent Claims Advocacy Platform for Malaysian Strata & Landed Properties.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span>Bank Negara Malaysia Guidelines</span>
            <span>PIAM Compliant</span>
            <span>OFS / FMOS Enabled</span>
          </div>
        </div>
      </footer>
    </div>
  );
}