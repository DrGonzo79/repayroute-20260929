import pytest
from fastapi.testclient import TestClient

from main import amortized_payment, app

client = TestClient(app)


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_brief_calculates_payment_and_public_service_steps() -> None:
    response = client.post("/v1/brief", json={
        "agi": 54000, "family_size": 1, "balance": 48200, "annual_rate": 5.5,
        "current_payment": 185, "public_service": True, "pslf_years": 4,
    })
    assert response.status_code == 200
    body = response.json()
    assert body["standard_payment"] == pytest.approx(523.10, abs=0.01)
    assert body["monthly_change"] == pytest.approx(338.10, abs=0.01)
    assert body["remaining_pslf_years"] == 6
    assert "PSLF Help Tool" in body["next_steps"][1]


def test_zero_interest_is_supported() -> None:
    assert amortized_payment(12000, 0) == 100


def test_invalid_input_returns_422() -> None:
    response = client.post("/v1/brief", json={
        "agi": -1, "family_size": 0, "balance": 0, "annual_rate": 99,
        "current_payment": -5, "public_service": False,
    })
    assert response.status_code == 422
    assert len(response.json()["detail"]) >= 5


def test_missing_fields_returns_422() -> None:
    response = client.post("/v1/brief", json={"agi": 50000})
    assert response.status_code == 422
