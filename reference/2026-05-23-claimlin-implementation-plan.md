# ClaimLin Hackathon Demo Implementation Plan

## Summary

Build ClaimLin as a Vercel-ready Next.js demo app by converting the existing `claimlin_ui_design.tsx` prototype into a structured product experience. The first target is a polished hackathon demo, not a full production insurance platform.

Chosen defaults:

- Target: hackathon demo.
- Prototype strategy: convert the existing UI.
- AI strategy: hybrid AI.
- Data strategy: Vercel-ready local/demo state first; Supabase later.
- Deployment: prepare for Vercel, but do not deploy in the first implementation pass.

## Phase 1: App Foundation

- Scaffold a Next.js App Router project with TypeScript, Tailwind, ESLint, and npm.
- Preserve `ClaimLin_PRD.md` and the existing prototype as source/reference files.
- Convert the prototype into the main app shell with clean sections:
  - Claim setup
  - Document upload
  - Policy analysis
  - Valuation
  - Claim strength
  - Policy chat
  - Dispute/OFS letters
- Replace prototype-only inline/demo logic with typed mock data modules and reusable components.
- Add `.env.example` with placeholders for future AI and Supabase keys.

## Phase 2: Core Demo Flow

- Implement the main Stage 1 journey:
  - Property type selection
  - Upload UI for policy, photos, police report, BOMBA report, and receipts
  - Simulated document analysis progress
  - Policy summary cards
  - Warranty/risk alerts
  - Missing document checklist
  - Deadline tracker
  - Claim strength score
- Keep uploaded files in browser state for v1.
- Use deterministic mock outputs so the demo works reliably even without API keys.
- Add sample demo data for a Malaysian fire/flood claim scenario.

## Phase 3: Hybrid AI Layer

- Add Next.js API routes for:
  - Policy explanation
  - Policy chat
  - Claim letter generation
  - Dispute response generation
  - OFS complaint generation
- If `OPENAI_API_KEY` or equivalent AI key is present, use real AI responses.
- If no key is present, fall back to polished mock responses.
- Keep OCR, image damage classification, CIDB benchmarks, and embeddings mocked for the hackathon version.
- Structure AI responses as typed JSON where possible so UI rendering is predictable.

## Phase 4: Valuation And Claim Intelligence

- Implement the Average Clause calculator:
  - `claim = (sumInsured / rebuildCost) * lossValue`
  - cap payout at the loss value when not underinsured
  - show penalty/shortfall clearly
- Implement ACV vs fair entitlement comparison:
  - likely insurer offer
  - ClaimLin estimated entitlement
  - payout gap
- Add latent damage suggestions based on property type and disaster type.
- Add claim strength scoring from uploaded documents, policy coverage status, warranty checks, and valuation completion.

## Phase 5: Letters And Downloadable Outputs

- Generate in-app letter previews for:
  - Initial claim letter
  - Counter-argument dispute letter
  - OFS complaint letter
- Use `@react-pdf/renderer` or a simpler HTML-to-print fallback depending on setup speed.
- Include cited clauses from mock/AI policy analysis.
- Add "Download PDF" or "Print/Save as PDF" actions.
- Keep the output professional and submission-ready for judges to inspect.

## Phase 6: Demo Polish And Vercel Readiness

- Make the app responsive for laptop and mobile judging screens.
- Improve visual hierarchy, empty states, loading states, and error states.
- Add a one-click "Load Demo Claim" button so judges can see the full journey quickly.
- Add README instructions:
  - install
  - run locally
  - configure AI env key
  - deploy to Vercel later
- Ensure the app runs without external services by default.

## Future Phase: Supabase MVP

After the hackathon demo works:

- Add Supabase Auth for returning users.
- Add Supabase Storage for uploaded documents/photos.
- Add PostgreSQL tables for claims, documents, policy analysis, valuations, generated letters, and chat history.
- Add a persistent "My Claim Dashboard".
- Replace mocked OCR/vision/RAG with real services incrementally.

## Public Interfaces And Types

Create typed models for:

- `Claim`
- `ClaimDocument`
- `PolicyAnalysis`
- `WarrantyRisk`
- `ValuationResult`
- `ClaimStrengthResult`
- `GeneratedLetter`
- `ChatMessage`

Create API routes:

- `POST /api/analyze-policy`
- `POST /api/chat-policy`
- `POST /api/generate-claim-letter`
- `POST /api/generate-dispute-letter`
- `POST /api/generate-ofs-letter`

All API routes must support:

- real AI mode when env keys exist
- mock fallback mode when env keys are missing

## Test Plan

- Run lint/type checks after setup.
- Test the full demo path with no API key.
- Test the AI path with an API key if available.
- Verify upload UI accepts all required document categories.
- Verify claim strength updates as documents are added.
- Verify Average Clause calculations with underinsured and fully insured cases.
- Verify generated letters render with claim details and clause references.
- Verify mobile and desktop layouts do not overlap or hide key controls.

## Assumptions

- The first implementation should prioritize hackathon judging impact over production completeness.
- Legal deadlines and OFS wording will be presented as demo guidance until validated against official Malaysian sources.
- Supabase is intentionally deferred so the app can be built and demoed faster.
- Vercel deployment will be prepared through Next.js conventions and env vars, but actual deployment is a later step.
