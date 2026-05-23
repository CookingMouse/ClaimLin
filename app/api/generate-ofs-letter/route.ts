import { callAI } from "@/lib/ai-client";
import { DEMO_CLAIM } from "@/lib/mock-data";
import type { ApiResponse, Claim, GeneratedLetter } from "@/types/index";

export const runtime = "nodejs";

type GenerateOfsLetterRequest = {
  claimData: Claim;
  disputeLetterText: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPartialClaim(value: unknown): value is Partial<Claim> {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.id === undefined || typeof value.id === "string") &&
    (value.propertyType === undefined ||
      value.propertyType === "Landed Home" ||
      value.propertyType === "High-Rise Unit" ||
      value.propertyType === "Shoplot" ||
      value.propertyType === "Industrial Factory") &&
    (value.disasterType === undefined ||
      value.disasterType === "fire" ||
      value.disasterType === "flood") &&
    (value.status === undefined ||
      value.status === "Draft" ||
      value.status === "Submitted" ||
      value.status === "Disputed" ||
      value.status === "Resolved") &&
    (value.documents === undefined || isRecord(value.documents)) &&
    (value.createdAt === undefined || typeof value.createdAt === "string") &&
    (value.updatedAt === undefined || typeof value.updatedAt === "string")
  );
}

function parseRequestBody(value: unknown): GenerateOfsLetterRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  if (value.claimId !== undefined && typeof value.claimId !== "string") {
    return null;
  }

  if (
    value.disputeLetterText !== undefined &&
    typeof value.disputeLetterText !== "string"
  ) {
    return null;
  }

  if (value.claimData !== undefined && !isPartialClaim(value.claimData)) {
    return null;
  }

  const partialClaim = value.claimData;
  const claimId = value.claimId?.trim() || partialClaim?.id;

  if (!claimId && partialClaim === undefined) {
    return null;
  }

  const claimData: Claim = {
    ...DEMO_CLAIM,
    ...partialClaim,
    documents: partialClaim?.documents ?? DEMO_CLAIM.documents,
    id: claimId ?? DEMO_CLAIM.id,
  };
  const disputeLetterText =
    value.disputeLetterText?.trim() ||
    "No dispute letter text was provided. Please review the insurer's handling of the disputed claim and the policyholder's unresolved objections.";

  return {
    claimData,
    disputeLetterText,
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

function buildMockOfsLetter(input: GenerateOfsLetterRequest): GeneratedLetter {
  return {
    type: "ofs",
    title: `OFS Complaint Letter - ${input.claimData.id}`,
    generatedAt: new Date().toISOString(),
    body: `To the Ombudsman for Financial Services,

Re: Complaint regarding insurance claim ${input.claimData.id}

I request the Ombudsman for Financial Services to review the handling of my ${input.claimData.disasterType} claim for my ${input.claimData.propertyType}.

I have disputed the insurer's position and set out the basis for disagreement in my prior letter. The insurer's response has not adequately addressed the policy coverage, supporting documents, or settlement calculation.

I respectfully request an independent review and a fair resolution based on the policy terms, the submitted evidence, and the insurer's claim-handling obligations.`,
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
      "Missing required field: claimId or claimData",
    );
  }

  try {
    const letterBody = await callAI(
      "You are drafting a formal complaint to the Ombudsman for Financial Services in Malaysia. Generate a formal OFS complaint letter only, with no markdown.",
      `Claim data:\n${JSON.stringify(input.claimData, null, 2)}\n\nDispute letter text:\n${input.disputeLetterText}`,
    );
    const letter: GeneratedLetter = {
      type: "ofs",
      title: `OFS Complaint Letter - ${input.claimData.id}`,
      body: letterBody,
      generatedAt: new Date().toISOString(),
    };
    const response: ApiResponse<GeneratedLetter> = {
      data: letter,
    };

    return Response.json(response);
  } catch {
    const response: ApiResponse<GeneratedLetter> = {
      data: buildMockOfsLetter(input),
      mock: true,
    };

    return Response.json(response);
  }
}
