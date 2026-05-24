# ClaimLin

**AI-Powered Property Damage Claims Advocate for Malaysia**

ClaimLin is an independent AI advocate that helps Malaysian property owners navigate insurance claims after disasters — fire, flood, storm, or break-in. It analyzes your policy, flags hidden risks, calculates fair payouts, and generates formal dispute letters, all without needing a lawyer.

Built for **Track 2: InsurTech** hackathon.

---

## Features

### Smart Source Vault (Left Panel)
- Upload up to 5 documents: insurance policy, damage photos, police report, BOMBA forensics report, purchase receipts
- **FraudShield** — GPS and metadata verification indicator for damage photos
- **Claim Strength Gauge** — live score (0–100) weighted across all uploaded documents
- **Missing Document Checklist** — tells you exactly what's still needed
- **⚡ Load Demo Claim** — pre-loads a Shah Alam Allianz fire claim for instant demo

### Defender Chat (Middle Panel)
- RAG-powered chatbox indexed against your uploaded policy
- Ask questions like "Is flood covered?", "What is my deductible?", "What does the 60-day clause mean?"
- Predictive prompt chips surface the most relevant questions automatically
- Source citations shown inline (e.g. "Policy, p.12")

### Audit & Action Center (Right Panel)
- **Payout Bar Chart** — visualises insurer's offer vs your fair entitlement side by side
- **RCV Clawback Tracker** — tracks withheld Replacement Cost Value and prompts for receipts
- **Policy Audit** — coverage items (covered / not covered / conditional) with clause references
- **Warranty Risk Alerts** — flags risky clauses like the 60-day premium payment warranty
- **Hidden Hazard Audit** — AI-predicted hidden damages by disaster type (e.g. electrical wiring degradation after fire)
- **Export Appeal Package** — generates a formal PDF claim letter ready to send to your insurer

### Letter Generator
- **Claim Letter** — formal initial claim submission with valuation breakdown
- **Dispute Letter** — three-ground objection letter citing Average Clause, depreciation, and RCV entitlement
- **OFS/FMOS Letter** — escalation letter to the Ombudsman for Financial Services (Bank Negara Malaysia)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| PDF Generation | @react-pdf/renderer |
| AI | OpenAI-compatible API (z.ai / YTL Ilmu Lab) |
| Mock Fallback | Deterministic mock responses (no API key needed) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Install

```bash
npm install
```

### Environment Variables (optional)

Copy `.env.example` to `.env.local` and fill in your AI API key to enable real AI responses. The app works fully without a key using mock responses.

```bash
cp .env.example .env.local
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Walkthrough

1. Open the app — you'll see the 3-panel workspace
2. Click **⚡ Load Demo Claim** in the left panel to load a pre-built Shah Alam fire claim
3. Watch the **Claim Strength Gauge** update and the **Policy Audit** populate automatically
4. Ask the **Defender Chat** — try "Is flood covered?" or "What is the deductible?"
5. Check the **Payout Bar Chart** in the right panel to see the gap between insurer offer and fair entitlement
6. Click **Export Appeal Package** to download the formal claim letter as a PDF

---

## Project Structure

```
app/
  page.tsx              # Main 3-panel UI
  api/
    analyze-policy/     # Policy coverage analysis
    chat-policy/        # RAG chatbox
    check-damage-photos/ # Photo metadata + predictive chips
    generate-claim-letter/   # Formal claim letter
    generate-dispute-letter/ # Dispute objection letter
    generate-ofs-letter/     # OFS/FMOS escalation letter
    load-demo/          # Demo claim loader

components/
  claim/                # Document upload, strength gauge, checklist
  policy/               # Coverage cards, warranty alerts, hidden damages
  dispute/              # Letter preview
  valuation/            # Average clause calculator
  pdf/                  # ClaimLetterPDF (react-pdf)
  ui/                   # PayoutBarChart, ClawbackTracker, FraudShieldIcon, etc.
  layout/               # Header, Footer

lib/
  ai-client.ts          # OpenAI-compatible AI wrapper
  average-clause.ts     # Average Clause / underinsurance formula
  claim-strength.ts     # Claim strength scoring
  mock-analysis.ts      # Mock policy analysis + hidden damages
  mock-data.ts          # DEMO_CLAIM fixture

types/
  index.ts              # All shared TypeScript types
```

---

## Malaysian Insurance Context

ClaimLin is built specifically for the Malaysian insurance landscape:

- **Average Clause** — recalculates payout when sum insured is below rebuild cost: `Claim = (sumInsured / rebuildCost) × lossValue`
- **Endorsement 113B** — flood coverage endorsement specific to Malaysian home policies
- **BOMBA** — Malaysian fire and rescue department; BOMBA reports are key evidence for fire claims
- **PDRM** — Royal Malaysia Police; police reports required for break-in and theft claims
- **OFS/FMOS** — Ombudsman for Financial Services, the dispute escalation body under Bank Negara Malaysia
- **60-day Premium Warranty** — common Malaysian policy clause that voids coverage if premium is unpaid within 60 days

---

## License

MIT
