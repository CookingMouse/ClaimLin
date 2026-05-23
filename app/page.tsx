"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
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

// New UI Components
import FraudShieldIcon from "@/components/ui/FraudShieldIcon";
import SourceChip from "@/components/ui/SourceChip";
import PredictivePromptChip from "@/components/ui/PredictivePromptChip";
import PayoutBarChart from "@/components/ui/PayoutBarChart";
import ClawbackTracker from "@/components/ui/ClawbackTracker";

export default function ClaimLinApp() {
  const [lang, setLang] = useState<"EN" | "BM">("EN");
  const [easyMode, setEasyMode] = useState(false);
  const [disasterType, setDisasterType] = useState<DisasterType>("fire");
  const [view, setView] = useState<"workspace" | "cases">("workspace");
  const [savedCases, setSavedCases] = useState<{ id: string; label: string; disasterType: DisasterType; createdAt: string }[]>([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [newCaseName, setNewCaseName] = useState("");
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyType>("Landed Home");
  const [uploadedFiles, setUploadedFiles] = useState<
    Partial<Record<DocumentKey, ClaimDocument>>
  >({});
  const [analyzing, setAnalyzing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

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

  const handleOpenCases = () => {
    if (Object.keys(uploadedFiles).length > 0) {
      setSavedCases((prev) => {
        const id = `case-${Date.now()}`;
        const label = `${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} Claim — ${new Date().toLocaleDateString()}`;
        const exists = prev.some((c) => c.id === id);
        return exists ? prev : [{ id, label, disasterType, createdAt: new Date().toISOString() }, ...prev];
      });
    }
    setView("cases");
  };

  const handleStartNewCase = () => {
    setShowNameModal(true);
    setNewCaseName("");
  };

  const handleConfirmNewCase = () => {
    if (!newCaseName.trim()) return;
    const id = `case-${Date.now()}`;
    setSavedCases((prev) => [{ id, label: newCaseName.trim(), disasterType, createdAt: new Date().toISOString() }, ...prev]);
    setUploadedFiles({});
    setPolicyAnalysis(null);
    setChatMessages([{ sender: "ai", text: "Hello! I am your Defender Chat. I've indexed your uploaded sources. How can I help you challenge your insurer today?", citation: "" }]);
    setLogs([]);
    setShowNameModal(false);
    setNewCaseName("");
    setView("workspace");
  };

  const handleOpenCase = (id: string) => {
    const found = savedCases.find((c) => c.id === id);
    if (found) setDisasterType(found.disasterType);
    setView("workspace");
  };

  const handleRemove = (key: DocumentKey) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
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

  const handleExportPackage = async () => {
    setLoading((prev) => ({ ...prev, letter: true }));
    // Simulate API
    setTimeout(() => {
      setGeneratedLetter(`OFFICIAL APPEAL PORTFOLIO
Claim ID: CL-2026-9001 | Asset: ${selectedProperty}

PROPERTY VALUE AUDIT:
- Sum Insured: RM ${sumInsured.toLocaleString()}
- Rebuild Price Valuation: RM ${actualRebuildCost.toLocaleString()}

Total Gap Identified: RM ${(actualRebuildCost - sumInsured).toLocaleString()}

This portfolio contains verified GPS metadata and underinsurance calculations.`);
      setGeneratedLetter(prev => prev + "\n\n(Generated via ClaimLin Auto-Advocate)");
      setLoading((prev) => ({ ...prev, letter: false }));
      setShowLetterModal(true);
    }, 1500);
  };

  const claimStrength = useMemo(
    () => calculateClaimStrength(uploadedFiles),
    [uploadedFiles]
  );

  const valuation = useMemo(
    () => calculateValuation(sumInsured, actualRebuildCost, lossValue),
    [sumInsured, actualRebuildCost, lossValue]
  );

  const hiddenDamages = useMemo(() => getMockHiddenDamages("fire"), []);

  const withheldAmount = 12500; // Mock RCV withheld

  const [leftWidth, setLeftWidth] = useState(320);
  const [rightWidth, setRightWidth] = useState(384);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"left" | "right" | null>(null);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const onDragStart = useCallback((side: "left" | "right", e: React.MouseEvent) => {
    dragging.current = side;
    dragStartX.current = e.clientX;
    dragStartWidth.current = side === "left" ? leftWidth : rightWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [leftWidth, rightWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - dragStartX.current;
      if (dragging.current === "left") {
        setLeftWidth(Math.min(520, Math.max(200, dragStartWidth.current + delta)));
      } else {
        setRightWidth(Math.min(520, Math.max(200, dragStartWidth.current - delta)));
      }
    };
    const onMouseUp = () => {
      dragging.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className={`flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden ${easyMode ? 'text-lg' : 'text-sm'}`}>
      <Header lang={lang} setLang={setLang} easyMode={easyMode} setEasyMode={setEasyMode} />

      {/* CASES LIST VIEW */}
      {view === "cases" && (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">{lang === "EN" ? "My Cases" : "Kes Saya"}</h2>
              <button onClick={handleStartNewCase} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-md">
                + {lang === "EN" ? "New Case" : "Kes Baru"}
              </button>
            </div>

            {savedCases.length === 0 ? (
              <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-medium">{lang === "EN" ? "No saved cases yet. Start a new one." : "Tiada kes disimpan. Mulakan kes baru."}</p>
                <button onClick={handleStartNewCase} className="mt-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all">
                  + {lang === "EN" ? "Start New Case" : "Mulakan Kes Baru"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {savedCases.map((c) => (
                  <button key={c.id} onClick={() => handleOpenCase(c.id)}
                    className="bg-white rounded-2xl border border-purple-100 p-5 text-left hover:border-purple-300 hover:shadow-sm transition-all flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{c.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(c.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main 3-Panel Layout */}
      <div ref={containerRef} className={`flex overflow-hidden ${view === "cases" ? "hidden" : "flex-1"}`}>

        {/* LEFT PANEL: Smart Source Vault */}
        <aside style={{ width: leftWidth, minWidth: 200, maxWidth: 520 }} className="border-r border-slate-200 bg-white flex flex-col overflow-y-auto shrink-0">
          <div className="p-4 border-b border-slate-100">
            <Button onClick={handleOpenCases} variant="primary" className="w-full justify-start gap-2 py-3 rounded-2xl shadow-purple-600/5">
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

        {/* LEFT DRAG HANDLE */}
        <div
          onMouseDown={(e) => onDragStart("left", e)}
          className="w-1 hover:w-1.5 bg-slate-200 hover:bg-purple-400 cursor-col-resize transition-all shrink-0 active:bg-purple-600"
        />

        {/* MIDDLE PANEL: Defender Chat */}
        <main className="flex-1 flex flex-col bg-slate-50 relative min-w-0">
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

        {/* RIGHT DRAG HANDLE */}
        <div
          onMouseDown={(e) => onDragStart("right", e)}
          className="w-1 hover:w-1.5 bg-slate-200 hover:bg-purple-400 cursor-col-resize transition-all shrink-0 active:bg-purple-600"
        />

        {/* RIGHT PANEL: Audit & Action Center */}
        <aside style={{ width: rightWidth, minWidth: 200, maxWidth: 520 }} className="border-l border-slate-200 bg-white flex flex-col overflow-y-auto shrink-0">
          <div className="p-6 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.auditTitle}</span>
              <PayoutBarChart offer={45000} deserve={valuation.acvPayout} lang={lang} />
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
              <Button 
                onClick={handleExportPackage} 
                disabled={loading.letter} 
                className="w-full py-4 rounded-2xl text-sm gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.exportAppeal}
              </Button>
            </div>
          </div>
        </aside>

      </div>

      <Footer lang={lang} />

      {/* Appeal Portfolio Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
            <div className="p-4 bg-purple-600 text-white font-black flex justify-between items-center text-sm">
              <span>{lang === 'EN' ? 'Appeal Portfolio Ready' : 'Pakej Rayuan Sedia'}</span>
              <button onClick={() => setShowLetterModal(false)} className="hover:bg-purple-700 p-1 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <LetterPreview 
                title={lang === 'EN' ? "Final Appeal Package" : "Pakej Rayuan Akhir"} 
                content={generatedLetter} 
                onCopy={() => alert("Copied!")} 
                lang={lang} 
              />
            </div>
          </div>
        </div>
      )}
      {/* NEW CASE NAME MODAL */}
      {showNameModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <h3 className="text-lg font-black text-slate-900">
                {lang === "EN" ? "Name Your Case" : "Namakan Kes Anda"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === "EN" ? "Give this claim a name so you can find it later." : "Berikan nama kes ini supaya mudah dicari kemudian."}
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleConfirmNewCase(); }} className="p-6 flex flex-col gap-4">
              <input
                autoFocus
                type="text"
                value={newCaseName}
                onChange={(e) => setNewCaseName(e.target.value)}
                placeholder={lang === "EN" ? "e.g. Shah Alam House Fire — April 2026" : "cth. Kebakaran Rumah Shah Alam — April 2026"}
                className="w-full bg-slate-50 border border-purple-100 focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowNameModal(false); setNewCaseName(""); }}
                  className="flex-1 border border-slate-200 text-slate-600 font-black text-sm py-3 rounded-xl hover:bg-slate-50 transition-all"
                >
                  {lang === "EN" ? "Cancel" : "Batal"}
                </button>
                <button
                  type="submit"
                  disabled={!newCaseName.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm py-3 rounded-xl transition-all shadow-md"
                >
                  {lang === "EN" ? "Start Case" : "Mulakan Kes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
