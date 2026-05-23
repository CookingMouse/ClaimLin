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
  const flaggedWarranties =
    input.policyAnalysis.warrantyRisks.length > 0
      ? input.policyAnalysis.warrantyRisks
          .map((risk) => `${risk.title} (${risk.clause})`)
          .join("; ")
      : "No warranty breach has been identified in the policy analysis.";

  return {
    type: "dispute",
    title: `Dispute Letter - ${input.policyAnalysis.claimId}`,
    generatedAt: new Date().toISOString(),
    body: `To the Claims Manager,

Re: Dispute of settlement offer for claim ${input.policyAnalysis.claimId}

I refer to your settlement position${input.fileName ? ` in ${input.fileName}` : ""} and respectfully dispute the proposed offer.

The policy analysis identifies the following covered items and clauses: ${coveredClauses}. The stated deductible is RM${input.policyAnalysis.deductible.toLocaleString("en-MY")}. The warranty review records the following status: ${flaggedWarranties}.

My dispute is based on the following three grounds:

1. The insurer's offer is below the Average Clause calculation. The settlement position does not reconcile the offer against the insured value, rebuild cost, loss value, and deductible in a transparent clause-by-clause calculation.

2. The depreciation applied exceeds Malaysian market rates. The offer appears to apply broad depreciation without item-level justification, replacement evidence, or reference to local reinstatement pricing.

3. The RCV rider entitles the claimant to replacement cost, not ACV. Where replacement cost cover applies, the settlement must reflect reinstatement or replacement cost subject to the policy wording, not a reduced actual cash value figure.

I therefore demand a revised settlement within 14 days from the date of this letter. If the insurer maintains its position, please provide the full adjuster worksheet, clause references, depreciation basis, and Average Clause calculation relied upon.`,
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
