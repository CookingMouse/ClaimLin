import { callAI } from "@/lib/ai-client";
import { getMockPolicyAnalysis } from "@/lib/mock-analysis";
import type {
  ApiResponse,
  CoverageItem,
  PolicyAnalysis,
  WarrantyRisk,
} from "@/types/index";

export const runtime = "nodejs";

type AnalyzePolicyRequest = {
  policyText: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCoverageStatus(
  value: unknown,
): value is CoverageItem["status"] {
  return (
    value === "covered" || value === "not-covered" || value === "conditional"
  );
}

function isRiskSeverity(
  value: unknown,
): value is WarrantyRisk["severity"] {
  return value === "low" || value === "medium" || value === "high";
}

function isCoverageItem(value: unknown): value is CoverageItem {
  return (
    isRecord(value) &&
    typeof value.label === "string" &&
    isCoverageStatus(value.status) &&
    typeof value.detail === "string" &&
    typeof value.clause === "string"
  );
}

function isWarrantyRisk(value: unknown): value is WarrantyRisk {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    isRiskSeverity(value.severity) &&
    typeof value.clause === "string"
  );
}

function isPolicyAnalysis(value: unknown): value is PolicyAnalysis {
  return (
    isRecord(value) &&
    typeof value.claimId === "string" &&
    typeof value.deductible === "number" &&
    Array.isArray(value.coverageItems) &&
    value.coverageItems.every(isCoverageItem) &&
    Array.isArray(value.warrantyRisks) &&
    value.warrantyRisks.every(isWarrantyRisk) &&
    typeof value.rawSummary === "string"
  );
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("AI response did not contain a JSON object");
  }

  return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
}

function parsePolicyAnalysis(text: string): PolicyAnalysis {
  const parsed = parseJsonObject(text);

  if (!isPolicyAnalysis(parsed)) {
    throw new Error("AI response did not match PolicyAnalysis");
  }

  return parsed;
}

function parseRequestBody(value: unknown): AnalyzePolicyRequest | null {
  if (!isRecord(value) || typeof value.policyText !== "string") {
    return null;
  }

  const policyText = value.policyText.trim();

  if (!policyText) {
    return null;
  }

  return { policyText };
}

async function readJson(request: Request): Promise<unknown | null> {
  try {
    const body: unknown = await request.json();
    return body;
  } catch {
    return null;
  }
}

function badRequest(message: string): Response {
  const response: ApiResponse<PolicyAnalysis> = {
    error: message,
  };

  return Response.json(response, { status: 400 });
}

export async function POST(request: Request): Promise<Response> {
  const requestBody = await readJson(request);
  const input = parseRequestBody(requestBody);

  if (!input) {
    return badRequest("Missing required field: policyText");
  }

  try {
    const aiResponse = await callAI(
      "You are a Malaysian insurance policy analyst. Return only valid JSON matching this TypeScript shape: { claimId: string; deductible: number; coverageItems: { label: string; status: 'covered' | 'not-covered' | 'conditional'; detail: string; clause: string; }[]; warrantyRisks: { id: string; title: string; description: string; severity: 'low' | 'medium' | 'high'; clause: string; }[]; rawSummary: string; }. Use Malaysian insurance terminology and express deductible as a number in RM.",
      `Extract coverage, deductibles, and warranty risks from this policy text:\n\n${input.policyText}`,
    );
    const analysis = parsePolicyAnalysis(aiResponse);
    const response: ApiResponse<PolicyAnalysis> = {
      data: analysis,
    };

    return Response.json(response);
  } catch {
    const response: ApiResponse<PolicyAnalysis> = {
      data: getMockPolicyAnalysis(),
      mock: true,
    };

    return Response.json(response);
  }
}
