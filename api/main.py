from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field

FIXTURES = json.loads((Path(__file__).parent.parent / "data" / "demo.json").read_text())
app = FastAPI(title="RepayRoute API", version="0.1.0")


class BriefRequest(BaseModel):
    agi: int = Field(ge=0, le=1_000_000)
    family_size: int = Field(ge=1, le=20)
    balance: float = Field(gt=0, le=2_000_000)
    annual_rate: float = Field(ge=0, le=25)
    current_payment: float = Field(ge=0, le=100_000)
    public_service: bool = False
    pslf_years: int = Field(default=0, ge=0, le=10)


class BriefResponse(BaseModel):
    standard_payment: float
    illustrative_income_payment: float
    monthly_change: float
    pressure: Literal["low", "watch", "high"]
    remaining_pslf_years: int | None
    next_steps: list[str]
    disclaimer: str


def amortized_payment(balance: float, annual_rate: float, months: int = 120) -> float:
    monthly_rate = annual_rate / 100 / 12
    if monthly_rate == 0:
        return balance / months
    factor = math.pow(1 + monthly_rate, months)
    return balance * monthly_rate * factor / (factor - 1)


def build_brief(request: BriefRequest) -> BriefResponse:
    standard = amortized_payment(request.balance, request.annual_rate)
    poverty = FIXTURES["povertyGuideline"] + max(0, request.family_size - 1) * 5_500
    discretionary = max(0, request.agi - poverty * FIXTURES["incomeProtectionMultiplier"])
    income_payment = discretionary * FIXTURES["incomeShare"] / 12
    change = standard - request.current_payment
    share = standard * 12 / max(request.agi, 1)
    pressure: Literal["low", "watch", "high"] = "high" if share >= 0.15 else "watch" if share >= 0.08 else "low"
    steps_key = "publicService" if request.public_service else "general"
    remaining = max(0, 10 - request.pslf_years) if request.public_service else None
    return BriefResponse(
        standard_payment=round(standard, 2),
        illustrative_income_payment=round(income_payment, 2),
        monthly_change=round(change, 2),
        pressure=pressure,
        remaining_pslf_years=remaining,
        next_steps=FIXTURES["steps"][steps_key],
        disclaimer=FIXTURES["disclaimer"],
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/brief", response_model=BriefResponse)
def create_brief(request: BriefRequest) -> BriefResponse:
    return build_brief(request)
