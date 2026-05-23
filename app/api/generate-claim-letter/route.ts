import { callAI } from "@/lib/ai-client";
import { DEMO_CLAIM } from "@/lib/mock-data";
import { getMockPolicyAnalysis } from "@/lib/mock-analysis";
import type {
  ApiResponse,
  DisasterType,
  GeneratedLetter,
  PolicyAnalysis,
  PropertyType,
  ValuationResult,
} from "@/types/index";

export const runtime = "nodejs";

type GenerateClaimLetterRequest = {
  propertyType: PropertyType;
  disasterType: DisasterType;
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

function isDisasterType(value: unknown): value is DisasterType {
  return (
    value === "fire" ||
    value === "flood" ||
    value === "storm" ||
    value === "break-in"
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
    value.disasterType !== undefined &&
    !isDisasterType(value.disasterType)
  ) {
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
    disasterType: value.disasterType ?? DEMO_CLAIM.disasterType,
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
  const { disasterType, policyAnalysis, propertyType, valuation } = input;
  const generatedAt = new Date().toISOString();
  const letterDate = new Date(generatedAt).toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const coverageRows = policyAnalysis.coverageItems
    .map((item) => {
      return `| ${item.label} | ${item.status} | ${item.clause} | ${item.detail} |`;
    })
    .join("\n");
  const warrantyStatus =
    policyAnalysis.warrantyRisks.length > 0 ? "Flagged" : "Cleared";
  const warrantyRows =
    policyAnalysis.warrantyRisks.length > 0
      ? policyAnalysis.warrantyRisks
          .map((risk) => {
            return `- ${risk.title} (${risk.severity}) - ${risk.clause}: ${risk.description}`;
          })
          .join("\n")
      : "- No warranty risks identified from the policy analysis.";

  return {
    type: "claim",
    title: `Formal Claim Letter - ${policyAnalysis.claimId}`,
    generatedAt,
    body: `${letterDate}

Reference: ${policyAnalysis.claimId}

To: Claims Director

Subject: Formal claim submission for ${disasterType} loss at ${propertyType}

Dear Claims Director,

I am submitting this formal claim for the ${disasterType} loss affecting my ${propertyType}. Based on the enclosed claim documents and policy review, the claim falls within the stated policy coverage and should be assessed without delay.

Valuation summary:
- Sum insured: ${formatRm(valuation.sumInsured)}
- Actual rebuild cost: ${formatRm(valuation.actualRebuildCost)}
- Assessed loss value: ${formatRm(valuation.lossValue)}
- Average Clause payout: ${formatRm(valuation.acvPayout)}
- Underinsurance shortfall: ${formatRm(valuation.underinsuranceShortfall)}
- Deductible / excess: ${formatRm(policyAnalysis.deductible)}

Coverage summary:

| Coverage item | Status | Clause | Detail |
| --- | --- | --- | --- |
${coverageRows}

Warranty review status: ${warrantyStatus}
${warrantyRows}

The Average Clause calculation has already been applied to the valuation. On that basis, I demand settlement using the calculated payout of ${formatRm(valuation.acvPayout)}, with any proposed deduction, reserve, or shortfall clearly reconciled against the sum insured of ${formatRm(valuation.sumInsured)} and the underinsurance shortfall of ${formatRm(valuation.underinsuranceShortfall)}.

Please confirm the approved settlement amount in writing and identify any policy clause relied upon for deductions beyond the deductible stated above.

Yours faithfully,
Claimant`,
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
      `Property type:\n${input.propertyType}\n\nDisaster type:\n${input.disasterType}\n\nValuation:\n${JSON.stringify(input.valuation, null, 2)}\n\nPolicy analysis:\n${JSON.stringify(input.policyAnalysis, null, 2)}`,
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
