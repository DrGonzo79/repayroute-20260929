# RepayRoute

A runnable Idea of the Day prototype that turns a possible student-loan payment change into a transparent estimate and a servicer call-preparation checklist.

**Live frontend:** https://drgonzo79.github.io/repayroute-20260929/

## What works

- Edit or switch fictional borrower profiles.
- Generate a deterministic 10-year payment estimate and clearly labeled income-linked illustration.
- See payment pressure, a PSLF-aware checklist, calculation method, validation, loading, empty, and saved-session states.
- Run the same domain operation through a typed FastAPI endpoint.

This is educational demo software, not financial/legal advice or an official plan quote. It does not enroll users or persist data. GitHub Pages hosts only the frontend; the Python service is tested source and is **not deployed**.

## Run the frontend

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Run the API

```bash
cd api
uv sync --locked
uv run uvicorn main:app --reload
```

`POST /v1/brief` accepts income, household, loan, rate, current-payment, and public-service context.

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
cd api && uv run pytest
```

## Documentation

- `research/notes.md` — source summary and retrieval boundaries
- `docs/OFFICE_HOURS.md` — customer, status quo, wedge, and validation diagnosis
- `docs/PRODUCT.md` — ICP, JTBD, MVP, economics, moat, risks, and roadmap
- `docs/ARCHITECTURE.md` — current and production data flows
- `docs/CEO_REVIEW.md` — premise, architecture, security, failure, testing, and UX review
- `docs/BUILD_PROMPTS.md` — phased prompts beyond the demo

Source inspiration: [IdeaBrowser public idea](https://www.ideabrowser.com/hub/ideas/student-loan-plan-picker-for-borrowers-kicked-off-save-7306dde7). This repository contains a summary, not private newsletter text.
