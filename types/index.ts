export type PropertyType = "Landed Home" | "High-Rise Unit" | "Shoplot" | "Industrial Factory";

export type DisasterType = "fire" | "flood" | "storm" | "break-in";

export type ClaimStatus = "Draft" | "Submitted" | "Disputed" | "Resolved";

export type DocumentKey =
  | "policy"
  | "photos"
  | "policeReport"
  | "bombaReport"
  | "receipts"
  | "insurerOffer";

export interface ClaimDocument {
  key: DocumentKey;
  name: string;
  file?: File;
}

export interface Claim {
  id: string;
  propertyType: PropertyType;
  disasterType: DisasterType;
  status: ClaimStatus;
  documents: Partial<Record<DocumentKey, ClaimDocument>>;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyRisk {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  clause: string;
}

export interface CoverageItem {
  label: string;
  status: "covered" | "not-covered" | "conditional";
  detail: string;
  clause: string;
}

export interface PolicyAnalysis {
  claimId: string;
  deductible: number;
  coverageItems: CoverageItem[];
  warrantyRisks: WarrantyRisk[];
  rawSummary: string;
}

export interface HiddenDamageItem {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface LedgerItem {
  id: number;
  name: string;
  ageYears: number;
  originalValue: number;
  replaced: boolean;
}

export interface ValuationResult {
  sumInsured: number;
  actualRebuildCost: number;
  lossValue: number;
  coverageRatio: number;
  isUnderInsured: boolean;
  acvPayout: number;
  underinsuranceShortfall: number;
  ledgerItems: LedgerItem[];
}

export interface ClaimStrengthResult {
  score: number;
  factors: {
    label: string;
    completed: boolean;
    weight: number;
  }[];
}

export interface GeneratedLetter {
  type: "claim" | "dispute" | "ofs";
  title: string;
  body: string;
  generatedAt: string;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  citation?: string;
}

export interface LogEntry {
  agent: string;
  msg: string;
  status: "success" | "pending" | "error";
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  mock?: boolean;
}
