import type {
  ClaimDocument,
  ClaimStrengthResult,
  DocumentKey,
} from "../types/index";

const CLAIM_STRENGTH_FACTORS: ClaimStrengthResult["factors"] = [
  {
    label: "Base claim details",
    completed: true,
    weight: 10,
  },
  {
    label: "Policy schedule",
    completed: false,
    weight: 20,
  },
  {
    label: "Damage photos",
    completed: false,
    weight: 20,
  },
  {
    label: "Police report",
    completed: false,
    weight: 20,
  },
  {
    label: "BOMBA report",
    completed: false,
    weight: 15,
  },
  {
    label: "Receipts and repair estimates",
    completed: false,
    weight: 15,
  },
];

const DOCUMENT_FACTOR_KEYS: Partial<Record<DocumentKey, number>> = {
  policy: 1,
  photos: 2,
  policeReport: 3,
  bombaReport: 4,
  receipts: 5,
};

export function calculateClaimStrength(
  documents: Partial<Record<DocumentKey, ClaimDocument>>,
): ClaimStrengthResult {
  const factors = CLAIM_STRENGTH_FACTORS.map((factor) => ({ ...factor }));

  for (const [documentKey, factorIndex] of Object.entries(
    DOCUMENT_FACTOR_KEYS,
  ) as [DocumentKey, number][]) {
    factors[factorIndex] = {
      ...factors[factorIndex],
      completed: Boolean(documents[documentKey]),
    };
  }

  const score = factors.reduce((total, factor) => {
    return factor.completed ? total + factor.weight : total;
  }, 0);

  return {
    score: Math.min(100, Math.max(0, score)),
    factors,
  };
}
