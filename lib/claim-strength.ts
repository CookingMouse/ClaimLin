import { DocumentKey, ClaimDocument, ClaimStrengthResult } from "../types";

export function calculateClaimStrength(
  documents: Partial<Record<DocumentKey, ClaimDocument>>
): ClaimStrengthResult {
  let score = 10;
  if (documents.policy) score += 20;
  if (documents.photos) score += 20;
  if (documents.policeReport) score += 20;
  if (documents.bombaReport) score += 15;
  if (documents.receipts) score += 15;

  return {
    score,
    factors: [
      { label: "Policy Uploaded", completed: !!documents.policy, weight: 20 },
      { label: "Photos Uploaded", completed: !!documents.photos, weight: 20 },
      {
        label: "Police Report Uploaded",
        completed: !!documents.policeReport,
        weight: 20,
      },
      {
        label: "Bomba Report Uploaded",
        completed: !!documents.bombaReport,
        weight: 15,
      },
      {
        label: "Receipts Uploaded",
        completed: !!documents.receipts,
        weight: 15,
      },
    ],
  };
}
