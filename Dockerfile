FROM python:3.12-slim
# Refresh the system certificate store when rebuilding this image.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates \
 && update-ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY api/pyproject.toml api/uv.lock ./api/
RUN pip install --no-cache-dir uv && cd api && uv sync --frozen --no-dev 'certifi>=2026.10.19'
COPY api ./api
COPY data ./data
EXPOSE 8000
CMD ["api/.venv/bin/uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
