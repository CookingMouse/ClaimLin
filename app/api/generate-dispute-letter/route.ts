import { callAI } from "@/lib/ai-client";
import { getMockPolicyAnalysis } from "@/lib/mock-analysis";
import type {
  ApiResponse,
  GeneratedLetter,
  PolicyAnalysis,
} from "@/types/index";

export const runtime = "nodejs";

type GenerateDisputeLetterRequest = {
  insurerOfferText: string;
  fileName?: string;
  policyAnalysis: PolicyAnalysis;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
): GenerateDisputeLetterRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    value.insurerOfferText !== undefined &&
    typeof value.insurerOfferText !== "string"
  ) {
    return null;
  }

  if (value.fileName !== undefined && typeof value.fileName !== "string") {
    return null;
  }

  if (
    value.policyAnalysis !== undefined &&
    !isPolicyAnalysis(value.policyAnalysis)
  ) {
    return null;
  }

  const insurerOfferText =
    value.insurerOfferText?.trim() ||
    "Generic insurer lowball offer: the insurer has proposed a settlement below the documented claim value without a clear clause-by-clause explanation.";
  const fileName = value.fileName?.trim();

  if (!value.insurerOfferText?.trim() && !fileName) {
    return null;
  }

  return {
    insurerOfferText,
    ...(fileName ? { fileName } : {}),
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

function buildMockDisputeLetter(
  input: GenerateDisputeLetterRequest,
): GeneratedLetter {
  const coveredClauses = input.policyAnalysis.coverageItems
    .map((item) => `${item.label}: ${item.clause}`)
    .join("; ");

  return {
    type: "dispute",
    title: `Dispute Letter - ${input.policyAnalysis.claimId}`,
    generatedAt: new Date().toISOString(),
    body: `To the Claims Manager,

Re: Dispute of settlement offer for claim ${input.policyAnalysis.claimId}

I refer to your settlement position${input.fileName ? ` in ${input.fileName}` : ""} and respectfully dispute the proposed offer.

The policy analysis identifies the following covered items and clauses: ${coveredClauses}. The stated deductible is RM${input.policyAnalysis.deductible.toLocaleString("en-MY")}. Please explain how the offer reconciles with these coverage findings and identify any exclusion or condition relied upon.

Until the insurer provides a clause-by-clause explanation and revised calculation, I reserve all rights to challenge the offer through the appropriate complaint channels.`,
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
      "Missing required field: insurerOfferText or fileName",
    );
  }

  try {
    const letterBody = await callAI(
      "You are a Malaysian insurance dispute specialist. Generate a professional counter-argument letter only, with no markdown. Cross-reference the insurer offer against the policy analysis and cite relevant clauses.",
      `Source file:\n${input.fileName ?? "No file name provided."}\n\nInsurer offer:\n${input.insurerOfferText}\n\nPolicy analysis:\n${JSON.stringify(input.policyAnalysis, null, 2)}`,
    );
    const letter: GeneratedLetter = {
      type: "dispute",
      title: `Dispute Letter - ${input.policyAnalysis.claimId}`,
      body: letterBody,
      generatedAt: new Date().toISOString(),
    };
    const response: ApiResponse<GeneratedLetter> = {
      data: letter,
    };

    return Response.json(response);
  } catch {
    const response: ApiResponse<GeneratedLetter> = {
      data: buildMockDisputeLetter(input),
      mock: true,
    };

    return Response.json(response);
  }
}
