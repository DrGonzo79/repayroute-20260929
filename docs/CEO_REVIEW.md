# CEO review

Mode: **Scope reduction**. A broad “student-loan resource” would become a low-trust content farm. The accepted scope is one high-anxiety workflow with transparent math and a human escalation path.

## Nuclear scope challenge

The actual outcome is a borrower entering a servicer interaction prepared, not a borrower “choosing a plan” in an app. The plan-picker premise was discarded. Doing nothing leaves users with conflicting tabs and undocumented calls. The 12-month ideal is a neutral, cited case record used by borrowers and counselors; this prototype tests the first route-brief interaction toward that state.

Alternatives reviewed: (A) quiz/content funnel—fast but shallow; (B) notice-to-call brief—selected; (C) connected case manager—defensible but premature. Existing leverage: browser-native calculations, official-resource links, a shared fixture, FastAPI validation, and static hosting. No paid API is required.

## 1. Architecture review

Strong boundary between static demonstration and source-only API. The intentional duplicate calculation must become a generated shared specification before production to prevent drift. Happy, nil, empty, and upstream-error paths are mapped in `ARCHITECTURE.md`. Rollback is a Pages workflow redeploy; policy calculations need an independent kill switch in production.

## 2. Error and rescue map

- `InputValidationError`: nonpositive balance/family size or invalid rate → block calculation and show corrective copy.
- `PolicyUnavailableError` (future): expired/missing rule → show official resources; no fallback estimate.
- `OfficialSourceTimeout` (future): source verification timeout → retain draft and retry.
- `CaseSaveError` (future): persistence failure → keep visible result and offer export.
- `NoticeExtractionUncertain` (future): OCR/model confidence below threshold → require user confirmation.

Catch-all “something went wrong” handling is rejected.

## 3. Security and threat model

Prototype has no accounts, uploads, persistence, secrets, or API calls. Numeric bounds prevent pathological inputs. Production threats include identity/financial-data exposure, malicious document content, prompt injection in extracted notices, cross-tenant access, and analytics leakage. Mitigations: content isolation, schema allowlists, authorization-by-case tests, field encryption, redacted logs, retention limits, rate limits, and dependency scanning.

## 4. Data flow and interaction edge cases

Inputs are typed, bounded, transformed deterministically, and rendered without persistence. Empty labels and invalid numeric values stop at validation. Double-click is disabled during calculation. Changing a field clears stale results. Reset and scenario switching clear saved state. Navigation during the simulated delay loses only local transient state. Very long labels are capped at 32 characters.

## 5. Code quality review

The domain operation is named and small. Fixture keys are explicit; TypeScript strict mode and Pydantic constrain contracts. Known debt: frontend/backend formula duplication. Do not add a shared code-generation layer until the second calculation exists; then generate golden vectors from a language-neutral policy schema.

## 6. Test review

Browser tests cover default calculation, method disclosure, profile switching, session save, invalid input, and mobile overflow on desktop/mobile Chromium. Python tests cover health, valid public-service output, zero interest, multiple invalid fields, and missing fields. Gaps deferred: screen-reader audit, cross-browser WebKit/Firefox, policy-version golden vectors, and visual-regression snapshots.

## 7. Observability and monitoring

Static demo observability is limited to GitHub Actions build/test status and Pages availability. Production metrics: calculation success/error by named class, policy age, completion funnel, official-link click, checklist export, review turnaround, comprehension-error rate, and complaint/refund rate. Alert on expired policy, error rate above 2%, or any cross-tenant authorization failure. Never include financial values in event payloads.

## 8. Database and state management

No database is accepted for the demo. React state is session-only. Production needs immutable policy versions and an append-only case-event table; borrower identity and case content should be separated. Index by tenant/case and effective policy version. Enforce row ownership and retention at the database layer.

## 9. API design and contract

`POST /v1/brief` accepts bounded numeric context and returns named estimates, pressure, next steps, and disclaimer. Pydantic returns 422 for malformed input. Before public deployment, add versioned policy/citation fields, idempotency keys for saved cases, request size limits, authenticated rate limits, and an error envelope with stable codes.

## 10. Performance and scalability

The calculation is constant-time and static delivery scales through GitHub Pages. At 100× load, the future bottlenecks are document extraction and human review, not arithmetic. Queue extraction, cap document size/page count, autoscale stateless workers, and publish reviewer capacity/SLA. Cache public policy artifacts by immutable version.

## 11. Design and UX

Hierarchy is notice → estimate → checklist. Fictional/demo state and non-advice language are persistent. Controls have labels and focus styles; loading, error, empty, and success states are distinct. Mobile collapses the two-column workspace and browser tests guard overflow. Main risk is over-trust in the income illustration; the “not a plan quote” label, method disclosure, and official-source CTA must remain.

## CEO review summary

- **Strongest challenges:** no payment evidence; regulatory trust risk; frontend/backend formula drift.
- **Recommended path:** ship the transparent demo, then conduct five silent borrower observations and 20 concierge briefs before adding accounts or AI.
- **Accepted:** deterministic estimate, PSLF-aware checklist, method disclosure, mobile UX, tested API source.
- **Deferred:** notice OCR, accounts, case history, counselor collaboration, rule ingestion, AI drafting, live backend.
- **Not in scope:** plan recommendations, enrollment, official quotes, paid APIs, lead sales, or billable hosting.
