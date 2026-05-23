import type {
  DisasterType,
  HiddenDamageItem,
  PolicyAnalysis,
} from "../types/index";

export function getMockPolicyAnalysis(): PolicyAnalysis {
  return {
    claimId: "CLM-2026-04-SHAH-ALAM-ALLIANZ-FIRE",
    deductible: 1000,
    coverageItems: [
      {
        label: "Fire damage",
        status: "covered",
        detail:
          "Building damage caused by accidental fire is covered under the selected Allianz home policy.",
        clause: "Section 1 - Fire, Lightning, Explosion",
      },
      {
        label: "Flood damage",
        status: "covered",
        detail:
          "Flood damage is covered because Endorsement 113B is attached to the policy schedule.",
        clause: "Endorsement 113B - Flood",
      },
      {
        label: "Household contents",
        status: "covered",
        detail:
          "Insured household contents are covered subject to proof of ownership and depreciation review.",
        clause: "Section 2 - Contents",
      },
    ],
    warrantyRisks: [
      {
        id: "premium-payment-60-day-clause",
        title: "60-day premium payment clause",
        description:
          "Coverage may be disputed if the premium was not fully paid within 60 days from policy inception or renewal.",
        severity: "medium",
        clause: "Premium Warranty - 60 Days",
      },
      {
        id: "bomba-certificate-commercial",
        title: "BOMBA certificate for commercial premises",
        description:
          "Commercial or mixed-use premises may need current BOMBA fire safety certification for full compliance.",
        severity: "low",
        clause: "Fire Safety Warranty - Commercial Premises",
      },
    ],
    rawSummary:
      "Mock Allianz policy analysis for an April 2026 Malaysian fire claim. Deductible is RM1000. Fire, flood via Endorsement 113B, and contents are marked covered, with premium payment and commercial BOMBA certificate warranties highlighted for review.",
  };
}

export function getMockHiddenDamages(
  disasterType: DisasterType,
): HiddenDamageItem[] {
  if (disasterType === "fire") {
    return [
      {
        id: "fire-electrical-wiring-degradation",
        title: "Electrical wiring degradation",
        description:
          "Heat exposure can weaken insulation and create delayed short-circuit risks behind walls and ceiling voids.",
        severity: "high",
      },
      {
        id: "fire-hvac-soot-contamination",
        title: "HVAC soot contamination",
        description:
          "Soot and acidic smoke residue can settle inside air-conditioning ducts, coils, and filters after a fire.",
        severity: "medium",
      },
      {
        id: "fire-structural-heat-stress",
        title: "Structural heat-stress",
        description:
          "Concrete, steel, and roof members may have hidden strength loss after sustained high-temperature exposure.",
        severity: "high",
      },
    ];
  }

  return [
    {
      id: "flood-subfloor-moisture",
      title: "Subfloor moisture",
      description:
        "Trapped moisture below tiles, timber, or laminate flooring can continue damaging finishes after surface drying.",
      severity: "medium",
    },
    {
      id: "flood-mould-risk",
      title: "Mould risk",
      description:
        "Warm and humid post-flood conditions can cause mould growth inside cabinets, wall cavities, and soft furnishings.",
      severity: "high",
    },
    {
      id: "flood-electrical-panel-corrosion",
      title: "Electrical panel corrosion",
      description:
        "Floodwater residue can corrode breakers and busbars, increasing failure and fire risk after power is restored.",
      severity: "high",
    },
  ];
}

export const MOCK_CHAT_RESPONSES: Record<string, string> = {
  flood:
    "Flood appears covered in this mock policy because Endorsement 113B is attached. The insurer may still ask for water ingress photos, repair estimates, and proof the loss occurred during the insured period.",
  bomba:
    "For this landed home fire claim, a BOMBA incident report is useful evidence. A BOMBA fire safety certificate is mainly flagged as a warranty risk for commercial or mixed-use premises.",
  deductible:
    "The mock deductible is RM1000, meaning the approved claim payout would usually be reduced by RM1000 before payment.",
  excess:
    "The policy excess works like the deductible in this mock analysis: RM1000 is borne by the policyholder before the insurer pays the approved balance.",
  coverage:
    "This mock policy marks fire damage, flood damage via Endorsement 113B, and insured household contents as covered, subject to documentation and warranty compliance.",
};
