import type { Claim } from "../types/index";

export const DEMO_CLAIM: Claim = {
  id: "CLM-2026-04-SHAH-ALAM-ALLIANZ-FIRE",
  propertyType: "Landed Home",
  disasterType: "fire",
  status: "Draft",
  documents: {
    policy: {
      key: "policy",
      name: "Allianz_HomeShield_Policy_Schedule_Shah_Alam_April_2026.pdf",
    },
    photos: {
      key: "photos",
      name: "Shah_Alam_Fire_Damage_Photos_2026-04-14.zip",
    },
    policeReport: {
      key: "policeReport",
      name: "PDRM_Report_Shah_Alam_Fire_2026-04-14.pdf",
    },
    bombaReport: {
      key: "bombaReport",
      name: "BOMBA_Incident_Report_Selangor_Shah_Alam_2026-04-14.pdf",
    },
    receipts: {
      key: "receipts",
      name: "Repair_Receipts_Inventory_Allianz_Claim_April_2026.xlsx",
    },
  },
  createdAt: "2026-04-14T10:30:00+08:00",
  updatedAt: "2026-04-18T15:45:00+08:00",
};
