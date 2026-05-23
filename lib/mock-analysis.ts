import { PolicyAnalysis, HiddenDamageItem } from "../types";

export const MOCK_CHAT_RESPONSES = [
  {
    keywords: ["flood", "banjir", "water"],
    answer:
      "Yes! Your Policy Schedule contains 'Endorsement 113B: Special Perils (Flood)'. You are fully covered for flood water damage up to your selected limit.",
    citation: "Endorsement 113B (Page 47)",
  },
  {
    keywords: ["bomba", "fire", "api", "certificate"],
    answer:
      "Your fire protection is valid. Please double check that your local BOMBA fire certificate was renewed and valid on the incident date.",
    citation: "General Conditions Clause 14 (Page 18)",
  },
];

export function getMockPolicyAnalysis(): PolicyAnalysis {
  return {
    claimId: "DEMO-123",
    deductible: 1000,
    coverageItems: [
      {
        label: "Fire Protection",
        status: "covered",
        detail: "Fully Protected",
        clause: "Section I: Clause 2 (Page 14)",
      },
      {
        label: "Flood Protection",
        status: "covered",
        detail: "Active Extension",
        clause: "Endorsement 113B (Page 47)",
      },
      {
        label: "Self-Pay Deductible",
        status: "conditional",
        detail: "RM 1,000",
        clause: "Summary Schedule (Page 3)",
      },
    ],
    warrantyRisks: [
      {
        id: "1",
        title: "Premium 60-Day Rule",
        description:
          "Your premium payment must clear within 60 days. Verified valid.",
        severity: "high",
        clause: "General Conditions Clause 1",
      },
    ],
    rawSummary: "Policy verified as active and valid for flood and fire perils.",
  };
}

export function getMockHiddenDamages(): HiddenDamageItem[] {
  return [
    {
      id: "1",
      title: "Wall Wire Overheating",
      description: "Fires melt protective pipe insulation inside plaster.",
      severity: "high",
    },
    {
      id: "2",
      title: "Corrosive Soot in Ceiling Vents",
      description: "Acids from soot corrode metallic frames long-term.",
      severity: "medium",
    },
  ];
}
