"use client";

import React, { useState, useMemo } from "react";
import {
  PropertyType,
  DocumentKey,
  ClaimDocument,
  LogEntry,
  ChatMessage,
} from "@/types";
import { calculateClaimStrength } from "@/lib/claim-strength";
import { calculateValuation } from "@/lib/average-clause";
import {
  getMockPolicyAnalysis,
  getMockHiddenDamages,
  MOCK_CHAT_RESPONSES,
} from "@/lib/mock-analysis";
import { DEMO_CLAIM } from "@/lib/mock-data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PropertyTypeSelector from "@/components/claim/PropertyTypeSelector";
import DocumentUpload from "@/components/claim/DocumentUpload";
import ClaimStrengthGauge from "@/components/claim/ClaimStrengthGauge";
import MissingDocChecklist from "@/components/claim/MissingDocChecklist";
import DeadlineTracker from "@/components/claim/DeadlineTracker";
import AgentProgressLog from "@/components/claim/AgentProgressLog";
import PolicySummaryCards from "@/components/policy/PolicySummaryCards";
import WarrantyAlerts from "@/components/policy/WarrantyAlerts";
import HiddenDamageList from "@/components/policy/HiddenDamageList";
import ValuationCalculator from "@/components/valuation/ValuationCalculator";
import InsurerVsRealityPanel from "@/components/valuation/InsurerVsRealityPanel";
import DisputeUpload from "@/components/dispute/DisputeUpload";
import LetterPreview from "@/components/dispute/LetterPreview";

export default function ClaimLinApp() {
  const [lang, setLang] = useState<"EN" | "BM">("EN");
  const [easyMode, setEasyMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyType>("Landed Home");
  const [uploadedFiles, setUploadedFiles] = useState<
    Partial<Record<DocumentKey, ClaimDocument>>
  >({});
  const [analyzing, setAnalyzing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Valuation States
  const [sumInsured, setSumInsured] = useState(350000);
  const [actualRebuildCost, setActualRebuildCost] = useState(500000);
  const [lossValue, setLossValue] = useState(150000);

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am your personal claims helper. I have analyzed your Allianz smart policy document. Ask me any question simply, like 'Is flood covered?' or 'What is my policy excess?'",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Dispute States
  const [disputeTriggered, setDisputeTriggered] = useState(false);

  const t = {
    EN: {
      welcome: "Let's secure your fair insurance payout together.",
      subtitle:
        "ClaimLin is a simple, independent helper that guides you step-by-step through home fire or flood claims in Malaysia. No complicated terms, no confusion.",
      next: "Continue",
      back: "Go Back",
      analyze: "Let's Analyze My Claim",
      analyzing: "Our AI agents are verifying your documents...",
      chatTitle: "Have any questions about your policy? Ask below simply:",
    },
    BM: {
      welcome: "Mari dapatkan pampasan insurans anda yang adil bersama-sama.",
      subtitle:
        "ClaimLin adalah pembantu bebas pintar yang membimbing anda langkah-demi-langkah menuntut insurans kebakaran atau banjir di Malaysia. Tiada terma rumit.",
      next: "Seterusnya",
      back: "Kembali",
      analyze: "Mula Analisis Tuntutan",
      analyzing: "Sistem pintar kami sedang memeriksa fail anda...",
      chatTitle: "Ada sebarang soalan tentang polisi anda? Tanya di sini:",
    },
  }[lang];

  const handleUpload = (key: DocumentKey, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [key]: { key, name: file.name, file },
    }));
  };

  const handleRemove = (key: DocumentKey) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleLoadDemo = () => {
    setUploadedFiles(DEMO_CLAIM);
    runAIPipeline();
  };

  const runAIPipeline = () => {
    setAnalyzing(true);
    setLogs([]);

    const mockLogs: LogEntry[] = [
      {
        agent: "Location Assessor",
        msg: "Matched photos against regional flash flood database. Safe coordination checked.",
        status: "success",
      },
      {
        agent: "Document Intelligence",
        msg: "PDRM Police Report parsed. Date verified as 12 April 2026. Non-arson verified.",
        status: "success",
      },
      {
        agent: "Policy Auditor",
        msg: "Identified 'Special Perils' extension is active under standard terms.",
        status: "success",
      },
    ];

    mockLogs.forEach((log, i) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
        if (i === mockLogs.length - 1) {
          setTimeout(() => {
            setAnalyzing(false);
            setCurrentStep(2);
          }, 800);
        }
      }, (i + 1) * 800);
    });
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.toLowerCase();
    const matchedResponse = MOCK_CHAT_RESPONSES.find((r) =>
      r.keywords.some((kw) => query.includes(kw))
    );

    const responseText = matchedResponse
      ? matchedResponse.answer
      : "I've searched your policy. Standard terms apply. Please let me know if you would like me to draft a confirmation request.";
    const responseCite = matchedResponse ? matchedResponse.citation : "";

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: chatInput },
      { sender: "ai", text: responseText, citation: responseCite },
    ]);
    setChatInput("");
  };

  const claimStrength = useMemo(
    () => calculateClaimStrength(uploadedFiles),
    [uploadedFiles]
  );

  const valuation = useMemo(
    () => calculateValuation(sumInsured, actualRebuildCost, lossValue),
    [sumInsured, actualRebuildCost, lossValue]
  );

  const policyAnalysis = useMemo(() => getMockPolicyAnalysis(), []);
  const hiddenDamages = useMemo(() => getMockHiddenDamages(), []);

  const disputeLetter = `DEMAND & CONTESTATION OF SETTLEMENT OFFER
Policy Number: AL-998812-FH | Premise Address: Shah Alam, Selangor

To Senior Claims Director,

We formally contest your settlement valuation dated May 10, 2026. Your applied depreciation of 40% on household furniture violates our Replacement Cost Value (RCV) policy rider. 

Sincerely,
Azman Bin Razak`;

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 font-sans transition-all duration-300 ${
        easyMode ? "text-xl leading-relaxed" : "text-sm"
      }`}
    >
      <Header
        lang={lang}
        setLang={setLang}
        easyMode={easyMode}
        setEasyMode={setEasyMode}
      />

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

      <main className="max-w-6xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <h4 className="text-xs uppercase font-black text-purple-600 tracking-widest">
              {lang === "EN" ? "YOUR ROAD TO RECOVERY" : "HALUAN PEMULIHAN ANDA"}
            </h4>
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`p-4 rounded-2xl text-left font-black border transition-all ${
                    currentStep === step
                      ? "border-purple-500 bg-purple-50/50 text-purple-900 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-500"
                  }`}
                >
                  {step}.{" "}
                  {
                    [
                      lang === "EN" ? "Setup & Upload" : "Tetapan & Muat Naik",
                      lang === "EN" ? "Policy Guide" : "Panduan Polisi",
                      lang === "EN" ? "Estimate Payout" : "Anggaran Ganti Rugi",
                      lang === "EN" ? "Appeal Portal" : "Portal Rayuan",
                    ][step - 1]
                  }
                </button>
              ))}
            </div>
          </Card>

          <ClaimStrengthGauge score={claimStrength.score} lang={lang} />
          <MissingDocChecklist uploadedFiles={uploadedFiles} lang={lang} />
          <DeadlineTracker lang={lang} />
        </div>

        {/* Content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {currentStep === 1 && (
            <Card className="flex flex-col gap-6">
              <div>
                <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full font-black uppercase">
                  {lang === "EN"
                    ? "STEP 1: INITIAL COMPILATION"
                    : "LANGKAH 1: PENYEDIAAN AWAL"}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  {lang === "EN"
                    ? "1. Upload Your Proof & Documents"
                    : "1. Muat Naik Bukti & Dokumen Anda"}
                </h3>
              </div>

              <PropertyTypeSelector
                selected={selectedProperty}
                onSelect={setSelectedProperty}
                lang={lang}
              />

              <DocumentUpload
                uploadedFiles={uploadedFiles}
                onUpload={handleUpload}
                onRemove={handleRemove}
                lang={lang}
              />

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
                <h4 className="text-xs font-black text-purple-900">
                  {lang === "EN"
                    ? "Don't have files on this device?"
                    : "Tiada fail dalam peranti ini?"}
                </h4>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={handleLoadDemo}
                >
                  {lang === "EN"
                    ? "Load Sample Claims Data"
                    : "Muatkan Contoh Tuntutan"}
                </Button>
              </div>

              <div className="border-t border-slate-100 pt-6 flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  className="w-full max-w-md"
                  onClick={runAIPipeline}
                  disabled={analyzing}
                >
                  {analyzing ? t.analyzing : t.analyze}
                </Button>

                <AgentProgressLog
                  logs={logs}
                  analyzing={analyzing}
                  lang={lang}
                />
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <Card className="flex flex-col gap-6">
                <div>
                  <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
                    {lang === "EN" ? "STEP 2: POLICY READOUT" : "LANGKAH 2: LAPORAN POLISI"}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    {lang === "EN"
                      ? "2. Your Simple Policy Guide"
                      : "2. Ringkasan Polisi Mudah Faham"}
                  </h3>
                </div>

                <PolicySummaryCards analysis={policyAnalysis} lang={lang} />
                <WarrantyAlerts risks={policyAnalysis.warrantyRisks} lang={lang} />
              </Card>

              <Card className="flex flex-col gap-4">
                <h3 className="text-xl font-black text-slate-900">
                  {lang === "EN"
                    ? "Uncover Hidden Repair Claims"
                    : "Jangan Terlepas Tuntutan Tersembunyi"}
                </h3>
                <HiddenDamageList items={hiddenDamages} lang={lang} />
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setCurrentStep(3)}>
                    {t.next} →
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-6">
              <ValuationCalculator
                {...valuation}
                payout={valuation.acvPayout}
                shortfall={valuation.underinsuranceShortfall}
                sumInsured={sumInsured}
                setSumInsured={setSumInsured}
                actualRebuildCost={actualRebuildCost}
                setActualRebuildCost={setActualRebuildCost}
                lossValue={lossValue}
                setLossValue={setLossValue}
                lang={lang}
              />

              <Card className="flex flex-col gap-4">
                <h3 className="text-lg font-black text-slate-900">
                  {lang === "EN"
                    ? "Insurer vs Reality Comparison"
                    : "Perbandingan Insurans vs Realiti"}
                </h3>
                <InsurerVsRealityPanel
                  payout={valuation.acvPayout}
                  lossValue={lossValue}
                  lang={lang}
                />

                <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col gap-4">
                  <div className="border-b border-purple-100 pb-3">
                    <h3 className="text-xl font-black text-slate-900 mt-2 flex items-center gap-2">
                      <span>{t.chatTitle}</span>
                    </h3>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-purple-100 h-80 overflow-y-auto flex flex-col gap-4 shadow-inner">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`max-w-[85%] flex flex-col gap-1.5 ${
                          msg.sender === "user" ? "self-end items-end" : "self-start"
                        }`}
                      >
                        <span
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-purple-600 text-white font-bold rounded-tr-none shadow-md shadow-purple-600/10"
                              : "bg-white text-slate-800 rounded-tl-none border border-purple-100 shadow-sm"
                          }`}
                        >
                          {msg.text}
                        </span>
                        {msg.citation && (
                          <span className="text-[10px] text-purple-600 font-extrabold tracking-wide uppercase flex items-center gap-1">
                            <span>📍</span> {msg.citation}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleChatSend} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        lang === "EN"
                          ? "Type your question simply here..."
                          : "Tulis soalan anda di sini secara mudah..."
                      }
                      className="flex-1 bg-slate-50 border border-purple-100 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner"
                    />
                    <Button type="submit">
                      {lang === "EN" ? "Ask AI" : "Tanya AI"}
                    </Button>
                  </form>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                    ← {t.back}
                  </Button>
                  <Button onClick={() => setCurrentStep(4)}>
                    {t.next} →
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <Card className="flex flex-col gap-6">
              <div>
                <span className="bg-red-50 text-red-700 text-xs px-2.5 py-1.5 rounded-full font-black uppercase">
                  {lang === "EN" ? "STEP 4: APPEAL PORTAL" : "LANGKAH 4: BAHAGIAN RAYUAN"}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  {lang === "EN"
                    ? "4. Rejection & Lowball Appeals"
                    : "4. Rayuan Jika Tuntutan Ditolak / Rendah"}
                </h3>
              </div>

              <DisputeUpload
                onUpload={() => setDisputeTriggered(true)}
                lang={lang}
              />

              {disputeTriggered && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <LetterPreview
                    title={
                      lang === "EN" ? "Counter-Argument Letter" : "Surat Bantahan Rayuan"
                    }
                    content={disputeLetter}
                    onCopy={() => alert("Copied!")}
                    lang={lang}
                  />
                  <LetterPreview
                    title={lang === "EN" ? "FMOS Complaint Package" : "Pakej Aduan FMOS"}
                    content={disputeLetter} // Mock
                    onCopy={() => alert("Copied!")}
                    lang={lang}
                  />
                </div>
              )}

              <div className="flex justify-start mt-4">
                <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                  ← {t.back}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
