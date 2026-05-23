# ClaimLin — Product Requirements Document

> AI-Powered Property Insurance Advocate | Hackathon Edition — May 2026
> Track 2: InsurTech | Market: Malaysia — Property Insurance

---

## Project Description

**ClaimLin** is an AI-native, client-side SaaS platform that acts as an automated claims advocate
for property disaster victims in Malaysia.

It puts advanced document intelligence, computer vision, and policy reasoning directly into the
hands of policyholders — eliminating the information gap between insurers and claimants,
accelerating claim timelines from months to days, and maximising fair compensation.

### Who It's For

Regular people and small businesses who have suffered a devastating property disaster (fire, flood,
etc.) and must negotiate with their insurance company for a fair payout — with no legal background
and no professional support.

### Supported Property Types

| Type | Category |
|---|---|
| Landed Home | Residential |
| High-Rise Unit | Residential |
| Shoplot | Commercial |
| Industrial Factory | Commercial |

### Core Value Propositions

1. **Information Transparency** — Translates complex policy language into plain English. Surfaces
   coverage the user did not know they had.
2. **Uncovers Hidden Money** — Identifies latent physical damages, overlooked add-on clauses, and
   entitlements insurers do not volunteer.
3. **2-Stage Cash Recovery** — Manages the full claim lifecycle: initial ACV payout, then
   recoverable depreciation clawback (RCV).

---

## Features

#### 1. Multimodal Evidence Ingestion
Securely ingests and structures disaster documentation uploaded by the user.
- OCR parses PDRM police reports and BOMBA forensic logs (dates, times, narratives)
- Accepts fire/flood photos for downstream visual analysis

#### 2. Policy Decipher & Warranty Audit
Demystifies the 50+ page insurance contract and surfaces exact entitlements and obligations.
- AI agent parses the uploaded policy PDF
- Extracts deductibles, coverage limits, named perils, and active extensions (e.g. flood, landslide)
- Flags hidden warranties (60-day premium clause, BOMBA Fire Certificate) before submission

#### 3. Hidden Damage Predictive Prompting
Educates the victim on latent physical damages to prevent acceptance of lowball repair estimates.
- Fire/flood photos analysed with domain-specific prompts
- Severity classified: low / medium / high structural damage
- Rule-based latent damage suggestions — e.g. electrical wiring degradation, HVAC soot
  contamination, structural heat-stress

#### 4. Quantum Valuation & Average Clause Estimator
Calculates the legally fair claim amount and warns the user of underinsurance penalties.
- OCR parses historical purchase receipts to establish pre-loss content value
- Building estimates cross-referenced with Malaysian CIDB reconstruction cost benchmarks
- Applies Average Clause formula: `Claim = (Sum Insured / Market Value) × Loss`
- Output: exact ACV payout + underinsurance shortfall

#### 5. Claim Strength Score
A dynamic 0–100% gauge that updates in real-time as the user completes each step.
Calculated from weighted factors:
- Documents uploaded (police report, BOMBA report, photos, receipts)
- Coverage confirmed from policy
- Hidden warranties cleared
- Valuation completed

#### 6. Insurer vs. Reality Panel
Side-by-side comparison that surfaces the payout gap:
- **"What they will likely offer: RM X"** — estimated insurer lowball based on standard depreciation
- **"What you are entitled to: RM Y"** — ClaimLin's calculated fair entitlement

#### 7. Auto-Generated Claim Letter
Produces a professional, audit-ready PDF claim package for direct submission to the insurer.
- Cites specific policy clauses
- Includes itemised valuation breakdown
- Generated via react-pdf

#### 8. In-App Policy Chatbox
A full RAG-powered chatbox grounded in the user's uploaded policy.
- Vector store + embeddings + retrieval pipeline
- Users ask plain-language questions ("Am I covered for flood?", "What is my deductible?")
- Answers cite specific policy clauses by page/section

#### 9. Missing Documents Checklist
Proactively surfaces what the user has not uploaded yet and why each missing document matters
for claim strength. Directly tied to the Claim Strength Score.

#### 10. Deadline Tracker
A timeline showing exactly how many days remain for each legal obligation:
- Notify insurer of loss
- Submit supporting documents
- Respond to adjuster queries

Based on Malaysian insurance law deadlines.

#### 11. Dispute Response Engine
For use after the insurer responds with a lowball offer or rejection.
- User uploads the insurer's response letter
- AI cross-references it against the original policy analysis
- Generates a counter-argument letter citing the specific clauses the insurer is misapplying

#### 12. OFS Complaint Letter
If the dispute remains unresolved after the counter-argument.
- Generates a formal complaint to the Ombudsman for Financial Services (OFS) under Bank Negara
  Malaysia — the official free dispute resolution channel
- Auto-filled from existing claim data, no new input required from user

#### 13. My Claim Dashboard
A persistent dashboard for authenticated returning users.
- Tracks claim status: Submitted / Disputed / Resolved
- Stores full document history
- Surfaces the next required action
- Powered by Supabase Auth (email/password)

---

## User Journey

### Stage 1 — Initial Claim

```
1.  Log in / Sign up (Supabase Auth)
2.  Select property type (Landed Home / High-Rise / Shoplot / Industrial Factory)
3.  Upload documents:
    - Insurance policy PDF
    - Fire/flood photos
    - PDRM police report
    - BOMBA forensic report
    - Purchase receipts
4.  AI deciphers policy → surfaces coverage, deductibles, warranty risks in plain English
5.  Fire/flood photo analysis → severity classification → latent damage suggestions
6.  Valuation engine → calculates fair ACV, applies Average Clause, outputs entitlement
7.  Claim Strength Score renders and updates dynamically
8.  Missing Documents Checklist flags any gaps
9.  Deadline Tracker activates with submission windows
10. Insurer vs. Reality panel displays the payout gap
11. User downloads auto-generated, audit-ready PDF claim package
12. User submits claim package to insurer
```

### Stage 2 — Dispute Loop

```
13. Insurer responds with lowball offer or rejection letter
14. User uploads insurer's response to ClaimLin
15. Dispute Response Engine cross-references against original policy analysis
16. ClaimLin generates counter-argument letter with cited misapplied clauses
17. If still unresolved → OFS formal complaint letter generated (Bank Negara Malaysia)
```

> Stage 1 and Stage 2 run on the same pipeline. No new infrastructure between stages —
> new prompts, same architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) — UI, routing, file upload |
| Backend | Next.js API Routes — no separate server |
| AI Engine | AI API — multimodal (PDFs + images), document reasoning, structured extraction |
| RAG Pipeline | Vector store + embeddings for Policy Chatbox |
| Database | Supabase (PostgreSQL) — claim data, document history, user sessions |
| File Storage | Supabase Storage — uploaded PDFs and photos |
| Authentication | Supabase Auth — email/password, enables My Claim Dashboard |
| PDF Generation | react-pdf — claim letters and OFS complaint documents |
