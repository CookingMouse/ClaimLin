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
import Button from "@/components/ui/Button";
import DocumentUpload from "@/components/claim/DocumentUpload";
import ClaimStrengthGauge from "@/components/claim/ClaimStrengthGauge";
import MissingDocChecklist from "@/components/claim/MissingDocChecklist";
import PolicySummaryCards from "@/components/policy/PolicySummaryCards";
import WarrantyAlerts from "@/components/policy/WarrantyAlerts";
import HiddenDamageList from "@/components/policy/HiddenDamageList";

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
  const [selectedProperty] = useState<PropertyType>("Landed Home");
  const [uploadedFiles, setUploadedFiles] = useState<
    Partial<Record<DocumentKey, ClaimDocument>>
  >({});

  // Policy Analysis State
  const [policyAnalysis, setPolicyAnalysis] = useState<PolicyAnalysis | null>(
    null
  );

  // Valuation States
  const [sumInsured, setSumInsured] = useState(0);
  const [actualRebuildCost, setActualRebuildCost] = useState(0);
  const [lossValue, setLossValue] = useState(0);

  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am your Defender Chat. I've indexed your uploaded sources. How can I help you challenge your insurer today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Letter / Modal States
  const [modalLetter, setModalLetter] = useState<string | null>(null);

  // Mobile tab navigation
  const [activeTab, setActiveTab] = useState<"sources" | "chat" | "audit">("chat");

  // Welcome banner
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);

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
    setUploadedFiles(DEMO_CLAIM);
    setSumInsured(350000);
    setActualRebuildCost(450000);
    setLossValue(120000);
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

    setShowWelcomeBanner(false);
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

  const handleGenerateLetter = async (type: 'claim' | 'dispute' | 'ofs') => {
    setLoading(prev => ({ ...prev, letter: true }));
    try {
      let res;
      if (type === 'claim') {
        res = await fetch('/api/generate-claim-letter', {
          method: 'POST',
          body: JSON.stringify({ propertyType: selectedProperty, disasterType, valuation, policyAnalysis })
        });
      } else if (type === 'dispute') {
        res = await fetch('/api/generate-dispute-letter', {
          method: 'POST',
          body: JSON.stringify({ insurerOfferText: "Insurer offer pending", policyAnalysis })
        });
      } else {
        res = await fetch('/api/generate-ofs-letter', {
          method: 'POST',
          body: JSON.stringify({ claimData: { propertyType: selectedProperty, disasterType }, disputeLetterText: "Prior dispute letter" })
        });
      }
      
      const data = await res.json();
      setModalLetter(data.letter || data.body);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, letter: false }));
    }
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

  // Hydration fix for PDF
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={`flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden ${easyMode ? 'text-lg' : 'text-sm'}`}>
      <Header lang={lang} setLang={setLang} easyMode={easyMode} setEasyMode={setEasyMode} />

      {/* Main 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* LEFT PANEL: Smart Source Vault */}
        <aside className={`md:w-80 md:border-r border-slate-200 bg-white flex-col overflow-y-auto ${activeTab === 'sources' ? 'flex flex-1' : 'hidden md:flex'}`}>
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
                {(["fire", "flood", "storm", "break-in"] as const).map((type) => {
                  const icons = { fire: "🔥", flood: "🌊", storm: "⛈️", "break-in": "🔓" };
                  return (
                    <button
                      key={type}
                      onClick={() => setDisasterType(type)}
                      className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${
                        disasterType === type ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {icons[type]} {type}
                    </button>
                  );
                })}
              </div>

              {/* Load Demo Claim Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-1 border-slate-100 hover:border-slate-200 bg-purple-50/30 text-purple-700"
                onClick={handleLoadDemo}
              >
                {t.loadDemo}
              </Button>
            </div>

            {/* Source Upload Slots */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sources</span>
                <span className="text-[10px] font-bold text-slate-300 italic">{Object.keys(uploadedFiles).length} files</span>
              </div>
              
              <DocumentUpload
                uploadedFiles={uploadedFiles}
                onUpload={handleUpload}
                onRemove={handleRemove}
                lang={lang}
              />
              
              {/* Custom Photo Shield Indicator */}
              {uploadedFiles.photos && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-fadeIn">
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

            {/* Valuation Inputs */}
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 mt-2 pb-8">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Valuation Parameters</span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">Sum Insured (RM)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-slate-400">RM</span>
                    <input 
                      type="number" 
                      value={sumInsured} 
                      onChange={(e) => setSumInsured(Number(e.target.value))}
                      className="bg-transparent border-none outline-none text-xs font-black w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">Actual Rebuild Cost (RM)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-slate-400">RM</span>
                    <input 
                      type="number" 
                      value={actualRebuildCost} 
                      onChange={(e) => setActualRebuildCost(Number(e.target.value))}
                      className="bg-transparent border-none outline-none text-xs font-black w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">Estimated Loss Value (RM)</label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-slate-400">RM</span>
                    <input 
                      type="number" 
                      value={lossValue} 
                      onChange={(e) => setLossValue(Number(e.target.value))}
                      className="bg-transparent border-none outline-none text-xs font-black w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE PANEL: Defender Chat */}
        <main className={`flex-1 flex-col bg-slate-50 relative ${activeTab === 'chat' ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
            {showWelcomeBanner && Object.keys(uploadedFiles).length === 0 && (
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-start gap-3">
                <span className="text-lg">💡</span>
                <p className="flex-1 text-xs font-medium text-purple-800 leading-relaxed">
                  {lang === 'EN'
                    ? 'Upload your insurance policy to the left to get started. Or click ⚡ Load Demo Claim to see a live example.'
                    : 'Muat naik polisi insurans anda di sebelah kiri untuk mula. Atau klik ⚡ Muat Tuntutan Demo untuk lihat contoh langsung.'}
                </p>
                <button onClick={() => setShowWelcomeBanner(false)} className="text-purple-300 hover:text-purple-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
            {Object.keys(uploadedFiles).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                <div className="p-4 bg-slate-200 rounded-full mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-slate-500">Ready for audit</p>
                <p className="text-xs text-slate-400 mt-1">Upload a policy or load a demo to start the analysis</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`max-w-[85%] md:max-w-[80%] flex flex-col gap-1 ${msg.sender === 'user' ? 'self-end items-end' : 'self-start'} animate-fadeIn`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.citation && <SourceChip source={msg.citation} />}
                </div>
              ))
            )}
            {loading.chat && (
              <div className="self-start bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 animate-pulse">
                {lang === 'EN' ? 'Thinking...' : 'Berfikir...'}
              </div>
            )}
          </div>

          {/* Chat Controls */}
          <div className="p-4 md:p-6 bg-gradient-to-t from-slate-50 to-transparent">
            {/* Predictive Chips */}
            {uploadedFiles.policy && (
              <div className="flex flex-wrap gap-2 mb-4">
                {t.predictive.map((p, i) => (
                  <PredictivePromptChip key={i} text={p} onClick={handleChatSend} />
                ))}
              </div>
            )}

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
              <Button type="submit" disabled={loading.chat || !uploadedFiles.policy} className="rounded-xl px-4 md:px-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </form>
          </div>
        </main>

        {/* RIGHT PANEL: Audit & Action Center */}
        <aside className={`md:w-96 md:border-l border-slate-200 bg-white flex-col overflow-y-auto ${activeTab === 'audit' ? 'flex flex-1' : 'hidden md:flex'}`}>
          <div className="p-4 md:p-6 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.auditTitle}</span>
              {Object.keys(uploadedFiles).length > 0 ? (
                <PayoutBarChart insurerOffer={insurerOffer} fairEntitlement={fairEntitlement} lang={lang} />
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-2xl opacity-50">
                  <p className="text-[10px] font-black text-slate-300 uppercase">Valuation pending</p>
                </div>
              )}
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
                <div className="flex flex-col gap-4 animate-fadeIn">
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
              {policyAnalysis ? (
                <HiddenDamageList items={hiddenDamages} lang={lang} />
              ) : (
                <div className="p-4 text-center border-2 border-dashed border-slate-50 rounded-2xl opacity-30">
                  <p className="text-[10px] font-bold text-slate-300">Awaiting Analysis</p>
                </div>
              )}
            </div>

            {/* Generate Letter UI */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Generate Letter</span>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleGenerateLetter('claim')} 
                  disabled={loading.letter || !policyAnalysis}
                  className="text-[9px] px-1"
                >
                  {loading.letter ? '...' : 'Claim Letter'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleGenerateLetter('dispute')} 
                  disabled={loading.letter}
                  className="text-[9px] px-1"
                >
                  {loading.letter ? '...' : 'Dispute Letter'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleGenerateLetter('ofs')} 
                  disabled={loading.letter}
                  className="text-[9px] px-1"
                >
                  {loading.letter ? '...' : 'OFS Letter'}
                </Button>
              </div>
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
                      disabled={pdfLoading || !policyAnalysis}
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

      {/* Mobile Tab Bar */}
      <nav className="md:hidden flex border-t border-slate-200 bg-white flex-none">
        {(["sources", "chat", "audit"] as const).map((tab) => {
          const labels = {
            sources: lang === "EN" ? "Sources" : "Sumber",
            chat: lang === "EN" ? "Chat" : "Sembang",
            audit: lang === "EN" ? "Audit" : "Audit",
          };
          const tabIcons = {
            sources: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
            chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
            audit: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-[10px] font-black uppercase transition-colors ${activeTab === tab ? "text-purple-600" : "text-slate-400"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{tabIcons[tab]}</svg>
              {labels[tab]}
            </button>
          );
        })}
      </nav>

      {/* Letter Modal */}
      {modalLetter && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-4 bg-purple-600 text-white font-black flex justify-between items-center text-sm">
              <span>Generated Document</span>
              <button onClick={() => setModalLetter(null)} className="hover:bg-purple-700 p-1 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {modalLetter}
              </pre>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setModalLetter(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block"><Footer lang={lang} /></div>
    </div>
  );
}
