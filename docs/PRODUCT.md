# RepayRoute product plan

## Thesis

RepayRoute converts a federal student-loan payment-change notice into a transparent, non-advisory route brief: a comparable estimate, a pressure signal, and a documented call checklist. The business wins by owning the anxious “what do I do before I call?” moment, not by publishing another general loan blog.

## ICP and JTBD

**Beachhead ICP:** U.S. federal-loan borrowers affected by repayment-plan disruption, especially government/nonprofit employees with possible PSLF progress and household income under $100,000.

**JTBD:** “When my payment notice changes the number I built my budget around, help me understand the size of the change and prepare the evidence and questions I need, so I can speak to my servicer without losing time or blindly accepting a bad outcome.”

## MVP

1. Enter income, family size, balance, interest rate, current payment, and public-service context.
2. Calculate a transparent 10-year amortization and a clearly labeled income-linked illustration.
3. Show payment delta and budget-pressure band.
4. Produce a contextual documentation/call checklist.
5. Save only session-local demo state.

Explicit exclusions: plan eligibility decisions, enrollment, document upload, accounts, credit pulls, lender referrals, official payment quotes, and automated financial advice.

## Data model

- `BorrowerSnapshot`: AGI, family size, balance, weighted rate, current payment, public-service flag, self-reported PSLF years.
- `PolicyFixture`: dated poverty guideline, protection multiplier, illustrative income share, required disclaimer.
- `RouteBrief`: standard estimate, illustrative income estimate, delta, pressure band, remaining PSLF runway, next steps.
- Future: `SourceCitation`, `NoticeArtifact`, `ServicerInteraction`, `HumanReview`, and append-only `PolicyVersion`.

The prototype uses one shared JSON fixture for frontend and Python. Production stores encrypted case data separately from identity, with retention controls and explicit consent.

## Technical architecture

The GitHub Pages build runs a static Next.js/TypeScript client with the deterministic domain operation mirrored locally for a functional demo. A FastAPI service implements and tests the same operation as the future server boundary. It is source-only and not publicly hosted.

Production separates UI, versioned calculation service, cited policy rules, and audit ledger. Calculations return the exact policy version and formula inputs. Sensitive documents never enter analytics.

## AI/model strategy

No model is used in the prototype. Determinism and auditability matter more than generated prose. Later, an LLM may extract fields from notices and draft questions, but only behind schema validation, citation requirements, confidence thresholds, and human review. The model never selects a plan or silently changes numeric output.

## Economics and offer ladder

Public page details were unavailable, so these are hypotheses, not source claims:

- Free: self-serve route brief and official-resource checklist.
- $29: human-reviewed notice-to-call brief.
- $99/year: case history, reminders, and annual review.
- B2B2C: fixed per-member access for nonprofit counseling organizations or employers; no lead-sale economics.

At $29, a human review must take under 12 minutes to preserve roughly 70% gross margin at a $45/hour loaded reviewer cost. The business should not buy search traffic until free-to-paid conversion exceeds 8% and refund/complaint rate stays under 2%.

## GTM and validation

Start with search pages for exact notice language and partner distribution through teachers’ associations, public-service employers, borrower communities, and nonprofit counselors. Do not use fear-based countdowns. Validation sequence: 5 observed sessions → 20 concierge briefs → 100-user cohort → one counselor/employer pilot. Measure brief completion, official-link clicks, checklist use during a real call, paid conversion, resolution time, and comprehension errors.

Source growth signals are significant affected population and 40,000+ monthly searches. They establish timing, not product-market fit.

## Moat

Content and calculators are not moats. Potential compounding assets are a versioned policy-to-outcome corpus, de-identified notice/servicer failure patterns, trusted counselor distribution, and a borrower-owned evidence ledger. The moat fails if data provenance or neutrality is compromised.

## Risks

- **Regulatory/advice:** users may treat illustrations as recommendations. Use explicit scope, citations, comprehension checks, and counsel review.
- **Policy staleness:** every rule needs effective dates, owner, source, and automatic expiry.
- **Sensitive data:** collect the minimum, encrypt it, and default to deletion.
- **Servicer variance:** never promise acceptance or resolution.
- **Trust:** lead-selling would corrupt incentives; revenue should come from borrowers or aligned institutions.
- **Access:** affected users may have limited bandwidth or financial literacy; support mobile, plain language, and printable output.

## 30/60/90 days

**0–30:** observe five borrowers, run 20 concierge briefs, retain formula/copy review from a qualified counselor, and test $29 payment intent.

**31–60:** build notice ingestion with manual verification, policy-version citations, printable brief, consent/retention controls, and event-level observability. Pilot with one nonprofit counseling partner.

**61–90:** launch a 100-user cohort, add case history and reminders, measure real call outcomes, and decide whether to deepen PSLF or broaden to another disrupted cohort. Kill or reposition if users do not act on the checklist or paid conversion stays below 3%.
