"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  PropertyType,
  DisasterType,
  DocumentKey,
  ClaimDocument,
  LogEntry,
  ChatMessage,
  PolicyAnalysis,
} from "@/types";
import { calculateClaimStrength } from "@/lib/claim-strength";
import { calculateValuation } from "@/lib/average-clause";
import {
  getMockPolicyAnalysis,
  getMockHiddenDamages,
} from "@/lib/mock-analysis";
import { DEMO_CLAIM } from "@/lib/mock-data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DocumentUpload from "@/components/claim/DocumentUpload";
import ClaimStrengthGauge from "@/components/claim/ClaimStrengthGauge";
import MissingDocChecklist from "@/components/claim/MissingDocChecklist";
import AgentProgressLog from "@/components/claim/AgentProgressLog";
import PolicySummaryCards from "@/components/policy/PolicySummaryCards";
import WarrantyAlerts from "@/components/policy/WarrantyAlerts";
import HiddenDamageList from "@/components/policy/HiddenDamageList";
import LetterPreview from "@/components/dispute/LetterPreview";

// New UI Components
import FraudShieldIcon from "@/components/ui/FraudShieldIcon";
import SourceChip from "@/components/ui/SourceChip";
import PredictivePromptChip from "@/components/ui/PredictivePromptChip";
import PayoutBarChart from "@/components/ui/PayoutBarChart";
import ClawbackTracker from "@/components/ui/ClawbackTracker";

// PDF Components
import { PDFDownloadLink } from "@react-pdf/renderer";
import ClaimLetterPDF from "@/components/pdf/ClaimLetterPDF";

export default function ClaimLinApp() {
  const [lang, setLang] = useState<"EN" | "BM">("EN");
  const [easyMode, setEasyMode] = useState(false);
  const [disasterType, setDisasterType] = useState<DisasterType>("fire");
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyType>("Landed Home");
  const [uploadedFiles, setUploadedFiles] = useState<
    Partial<Record<DocumentKey, ClaimDocument>>
  >({});
  const [analyzing, setAnalyzing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  // Policy Analysis State
  const [policyAnalysis, setPolicyAnalysis] = useState<PolicyAnalysis | null>(
    null
  );

  // Valuation States
  const [sumInsured, setSumInsured] = useState(350000);
  const [actualRebuildCost, setActualRebuildCost] = useState(500000);
  const [lossValue, setLossValue] = useState(150000);

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am your Defender Chat. I've indexed your uploaded sources. How can I help you challenge your insurer today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Letter / Modal States
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>("");

  // API Loading & Error States
  const [loading, setLoading] = useState({
    policy: false,
    chat: false,
    letter: false,
  });

  const t = {
    EN: {
      createCase: "Create New Case",
      loadDemo: "⚡ Load Demo Claim",
      dropContract: "Drop your 50-page insurance contract here",
      dropPhotos: "Drop damage photos here",
      dropPolice: "Drop police report here",
      dropBomba: "Drop Bomba forensics here",
      dropReceipts: "Drop purchase receipts here",
      chatTitle: "Defender Chat",
      auditTitle: "Audit & Action Center",
      exportAppeal: "Export Appeal Package",
      predictive: [
        "I see heavy soot in your photos. Add HVAC cleaning to claim?",
        "Your policy has a 60-day premium rule. Is your receipt ready?",
        "Insurer offer is RM 45k below market. Draft an objection?",
      ],
      loading: "Analyzing...",
    },
    BM: {
      createCase: "Buka Kes Baru",
      loadDemo: "⚡ Muat Tuntutan Demo",
      dropContract: "Letakkan kontrak insurans 50-muka surat di sini",
      dropPhotos: "Letakkan gambar kerosakan di sini",
      dropPolice: "Letakkan laporan polis di sini",
      dropBomba: "Letakkan forensik Bomba di sini",
      dropReceipts: "Letakkan resit pembelian di sini",
      chatTitle: "Sembang Pembela",
      auditTitle: "Pusat Audit & Tindakan",
      exportAppeal: "Eksport Pakej Rayuan",
      predictive: [
        "Saya nampak kesan jelaga. Tambah cuci HVAC ke tuntutan?",
        "Polisi ada syarat premium 60 hari. Resit sudah sedia?",
        "Tawaran insurans rendah RM 45k. Draf bantahan?",
      ],
      loading: "Menganalisis...",
    },
  }[lang];

  // Logic: Handle Upload
  const handleUpload = (key: DocumentKey, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [key]: { key, name: file.name, file },
    }));
    if (key === "policy") analyzePolicy();
  };

  const handleRemove = (key: DocumentKey) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleLoadDemo = () => {
    setUploadedFiles(DEMO_CLAIM.documents);
    analyzePolicy();
  };

  // Logic: AI Pipeline (Mock)
  const analyzePolicy = async () => {
    setLoading((prev) => ({ ...prev, policy: true }));
    // Simulate API delay
    setTimeout(() => {
      setPolicyAnalysis(getMockPolicyAnalysis());
      setLoading((prev) => ({ ...prev, policy: false }));
    }, 1500);
  };

  const handleChatSend = async (text: string) => {
    if (!text.trim() || loading.chat) return;

    setChatMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading((prev) => ({ ...prev, chat: true }));

    // Simulate API delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Based on my audit of your Allianz SmartHome policy, Section 4 (Special Perils) explicitly covers this event. I recommend citing Page 12 in your appeal.",
          citation: "Policy, p.12",
        },
      ]);
      setLoading((prev) => ({ ...prev, chat: false }));
    }, 1000);
  };

  const claimStrength = useMemo(
    () => calculateClaimStrength(uploadedFiles),
    [uploadedFiles]
  );

  const valuation = useMemo(
    () => calculateValuation(sumInsured, actualRebuildCost, lossValue),
    [sumInsured, actualRebuildCost, lossValue]
  );

  const insurerOffer = valuation.acvPayout * 0.65;
  const fairEntitlement = valuation.acvPayout;

  const withheldAmount = 12500; // Mock RCV withheld

  const hiddenDamages = useMemo(() => getMockHiddenDamages(disasterType), [disasterType]);

  return (
    <div className={`flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden ${easyMode ? 'text-lg' : 'text-sm'}`}>
      <Header lang={lang} setLang={setLang} easyMode={easyMode} setEasyMode={setEasyMode} />

      {/* Main 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* LEFT PANEL: Smart Source Vault */}
        <aside className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-100 flex flex-col gap-2">
            <Button variant="primary" className="w-full justify-start gap-2 py-3 rounded-2xl shadow-purple-600/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t.createCase}
            </Button>
          </div>

          <div className="p-4 flex flex-col gap-6">
            {/* Disaster Type Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Selected Event</span>
              <div className="grid grid-cols-2 gap-2">
                {["fire", "flood", "storm", "break-in"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDisasterType(type as DisasterType)}
                    className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${
                      disasterType === type ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Load Demo Claim Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-1 border-slate-100 hover:border-slate-200"
                onClick={handleLoadDemo}
              >
                {t.loadDemo}
              </Button>
            </div>

            {/* Source Upload Slots */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sources</span>
              
              <DocumentUpload
                uploadedFiles={uploadedFiles}
                onUpload={handleUpload}
                onRemove={handleRemove}
                lang={lang}
              />
              
              {/* Custom Photo Shield Indicator */}
              {uploadedFiles.photos && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                  <FraudShieldIcon active={true} />
                  <div>
                    <p className="text-[11px] font-black text-emerald-700 uppercase">FraudShield Active</p>
                    <p className="text-[9px] text-emerald-600 font-bold">GPS & Metadata Verified</p>
                  </div>
                </div>
              )}
            </div>

            <ClaimStrengthGauge score={claimStrength.score} lang={lang} />
            <MissingDocChecklist uploadedFiles={uploadedFiles} lang={lang} />
          </div>
        </aside>

        {/* MIDDLE PANEL: Defender Chat */}
        <main className="flex-1 flex flex-col bg-slate-50 relative min-h-[400px]">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] flex flex-col gap-1 ${msg.sender === 'user' ? 'self-end items-end' : 'self-start'}`}>
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                {msg.citation && <SourceChip source={msg.citation} />}
              </div>
            ))}
            {loading.chat && (
              <div className="self-start bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 animate-pulse">
                {lang === 'EN' ? 'Thinking...' : 'Berfikir...'}
              </div>
            )}
          </div>

          {/* Chat Controls */}
          <div className="p-6 bg-gradient-to-t from-slate-50 to-transparent">
            {/* Predictive Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {t.predictive.map((p, i) => (
                <PredictivePromptChip key={i} text={p} onClick={handleChatSend} />
              ))}
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleChatSend(chatInput); setChatInput(""); }}
              className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-lg focus-within:border-purple-400 transition-all"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={lang === 'EN' ? "Ask Defender anything..." : "Tanya Defender apa sahaja..."}
                className="flex-1 px-4 py-3 bg-transparent outline-none text-sm font-medium"
              />
              <Button type="submit" disabled={loading.chat} className="rounded-xl px-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </form>
          </div>
        </main>

        {/* RIGHT PANEL: Audit & Action Center */}
        <aside className="w-full md:w-96 border-l border-slate-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-6 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.auditTitle}</span>
              <PayoutBarChart insurerOffer={insurerOffer} fairEntitlement={fairEntitlement} lang={lang} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">RCV Clawback</span>
              <ClawbackTracker 
                withheldAmount={withheldAmount} 
                onUploadReceipt={(f) => alert(`Receipt uploaded: ${f.name}`)} 
                lang={lang} 
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Policy Audit</span>
              {policyAnalysis ? (
                <div className="flex flex-col gap-4">
                  <PolicySummaryCards analysis={policyAnalysis} lang={lang} />
                  <WarrantyAlerts risks={policyAnalysis.warrantyRisks} lang={lang} />
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 font-bold uppercase text-[10px]">
                  {loading.policy ? t.loading : (lang === 'EN' ? 'No Policy Indexed' : 'Tiada Polisi')}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hidden Hazard Audit</span>
              <HiddenDamageList items={hiddenDamages} lang={lang} />
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              {isClient && (
                <PDFDownloadLink
                  document={
                    <ClaimLetterPDF
                      propertyType={selectedProperty}
                      disasterType={disasterType}
                      valuation={valuation}
                      policyAnalysis={policyAnalysis}
                    />
                  }
                  fileName="ClaimLin_Appeal_Package.pdf"
                >
                  {({ loading: pdfLoading }) => (
                    <Button
                      disabled={pdfLoading}
                      className="w-full py-4 rounded-2xl text-sm gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {pdfLoading ? t.loading : t.exportAppeal}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </aside>

      </div>

      <Footer lang={lang} />
    </div>
  );
}
