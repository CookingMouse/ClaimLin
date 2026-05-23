import { callAI } from "@/lib/ai-client";
import { getMockPolicyAnalysis } from "@/lib/mock-analysis";
import type {
  ApiResponse,
  GeneratedLetter,
  PolicyAnalysis,
  PropertyType,
  ValuationResult,
} from "@/types/index";

export const runtime = "nodejs";

type GenerateClaimLetterRequest = {
  propertyType: PropertyType;
  valuation: ValuationResult;
  policyAnalysis: PolicyAnalysis;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPropertyType(value: unknown): value is PropertyType {
  return (
    value === "Landed Home" ||
    value === "High-Rise Unit" ||
    value === "Shoplot" ||
    value === "Industrial Factory"
  );
}

function isValuationResult(value: unknown): value is ValuationResult {
  return (
    isRecord(value) &&
    typeof value.sumInsured === "number" &&
    typeof value.actualRebuildCost === "number" &&
    typeof value.lossValue === "number" &&
    typeof value.coverageRatio === "number" &&
    typeof value.isUnderInsured === "boolean" &&
    typeof value.acvPayout === "number" &&
    typeof value.underinsuranceShortfall === "number" &&
    Array.isArray(value.ledgerItems)
  );
}

function isPolicyAnalysis(value: unknown): value is PolicyAnalysis {
  return (
    isRecord(value) &&
    typeof value.claimId === "string" &&
    typeof value.deductible === "number" &&
    Array.isArray(value.coverageItems) &&
    Array.isArray(value.warrantyRisks) &&
    typeof value.rawSummary === "string"
  );
}

function parseRequestBody(
  value: unknown,
): GenerateClaimLetterRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  if (!isPropertyType(value.propertyType) || !isValuationResult(value.valuation)) {
    return null;
  }

  if (
    value.policyAnalysis !== undefined &&
    !isPolicyAnalysis(value.policyAnalysis)
  ) {
    return null;
  }

  return {
    propertyType: value.propertyType,
    valuation: value.valuation,
    policyAnalysis: value.policyAnalysis ?? getMockPolicyAnalysis(),
  };
}

async function readJson(request: Request): Promise<unknown | null> {
  try {
    const body: unknown = await request.json();
    return body;
  } catch {
    return null;
  }
}

function formatRm(value: number): string {
  return `RM${value.toLocaleString("en-MY", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function buildMockClaimLetter(
  input: GenerateClaimLetterRequest,
): GeneratedLetter {
  const { policyAnalysis, propertyType, valuation } = input;
  const coveredClauses = policyAnalysis.coverageItems
    .map((item) => item.clause)
    .join(", ");

  return {
    type: "claim",
    title: `Formal Claim Letter - ${policyAnalysis.claimId}`,
    generatedAt: new Date().toISOString(),
    body: `To the Claims Manager,

Re: Insurance claim ${policyAnalysis.claimId}

I am submitting this formal claim for the loss affecting my ${propertyType}. Based on the policy analysis, the relevant coverage clauses are ${coveredClauses}. The applicable deductible is ${formatRm(policyAnalysis.deductible)}.

The assessed loss value is ${formatRm(valuation.lossValue)}. The sum insured is ${formatRm(valuation.sumInsured)} against an estimated rebuild cost of ${formatRm(valuation.actualRebuildCost)}, resulting in an estimated claim payout of ${formatRm(valuation.acvPayout)} after the average clause calculation.

Please assess the attached documents and confirm the approved settlement amount in writing.`,
  };
}

function badRequest(message: string): Response {
  const response: ApiResponse<GeneratedLetter> = {
    error: message,
  };

  return Response.json(response, { status: 400 });
}

export async function POST(request: Request): Promise<Response> {
  const requestBody = await readJson(request);
  const input = parseRequestBody(requestBody);

  if (!input) {
    return badRequest(
      "Missing required fields: propertyType, valuation",
    );
  }

  try {
    const letterBody = await callAI(
      "You are a Malaysian insurance claims advocate. Generate a professional claim letter only, with no markdown. Cite relevant policy clauses and include the valuation figures.",
      `Property type:\n${input.propertyType}\n\nValuation:\n${JSON.stringify(input.valuation, null, 2)}\n\nPolicy analysis:\n${JSON.stringify(input.policyAnalysis, null, 2)}`,
    );
    const letter: GeneratedLetter = {
      type: "claim",
      title: `Formal Claim Letter - ${input.policyAnalysis.claimId}`,
      body: letterBody,
      generatedAt: new Date().toISOString(),
    };
    const response: ApiResponse<GeneratedLetter> = {
      data: letter,
    };

    return Response.json(response);
  } catch {
    const response: ApiResponse<GeneratedLetter> = {
      data: buildMockClaimLetter(input),
      mock: true,
    };

    return Response.json(response);
  }
}
