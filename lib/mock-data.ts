import { DocumentKey, ClaimDocument } from "../types";

export const DEMO_CLAIM: Partial<Record<DocumentKey, ClaimDocument>> = {
  policy: { key: "policy", name: "Allianz_Householder_Policy.pdf" },
  photos: { key: "photos", name: "Ruined_Kitchen_Evidence.jpg" },
  policeReport: { key: "policeReport", name: "PDRM_Shah_Alam_Report.pdf" },
  bombaReport: { key: "bombaReport", name: "Bomba_Forensic_Clearance.pdf" },
  receipts: { key: "receipts", name: "Shopee_Furniture_Invoices.pdf" },
};
